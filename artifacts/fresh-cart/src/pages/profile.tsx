import { useEffect, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Check, CircleAlert, Home, MapPin, Package, Pencil, Plus, RefreshCw, Trash2, UserRound, X } from 'lucide-react';
import { Link } from 'wouter';
import {
  getGetProfileQueryKey,
  getListOrdersQueryKey,
  useCreateAddress,
  useDeleteAddress,
  useGetProfile,
  useListOrders,
  useUpdateAddress,
  useUpdateProfile,
} from '@workspace/api-client-react';
import { useCart } from '@/lib/cart';
import { getClientId } from '@/lib/customer';
import { formatRupees } from '@/components/product-card';

const clientId = getClientId();
const inputClass = 'h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3.5 text-sm outline-none transition focus:border-[hsl(var(--accent))] focus:ring-4 focus:ring-[hsl(var(--accent)/.12)]';

function StatusPill({ status }: { status: string }) {
  const label = status === 'out_for_delivery' ? 'On the way' : status.replaceAll('_', ' ');
  return <span className="rounded-full bg-[hsl(var(--secondary))] px-2.5 py-1 text-[11px] font-bold capitalize text-[hsl(var(--primary))]" data-testid={`status-order-${status}`}>{label}</span>;
}

export default function Profile() {
  const queryClient = useQueryClient();
  const { add } = useCart();
  const profileQuery = useGetProfile({ clientId }, { query: { enabled: Boolean(clientId), queryKey: getGetProfileQueryKey({ clientId }) } });
  const ordersQuery = useListOrders({ clientId }, { query: { enabled: Boolean(clientId), queryKey: getListOrdersQueryKey({ clientId }) } });
  const updateProfile = useUpdateProfile();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [profileReady, setProfileReady] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: 'Home', address: '', isDefault: false });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profileQuery.data && !profileReady) {
      setProfileForm({ name: profileQuery.data.name, phone: profileQuery.data.phone });
      setProfileReady(true);
    }
  }, [profileQuery.data, profileReady]);

  const refreshProfile = () => {
    void queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey({ clientId }) });
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!profileForm.name.trim() || profileForm.phone.trim().length < 8) {
      setError('Add your name and a phone number with at least 8 digits.');
      return;
    }
    updateProfile.mutate({ data: { clientId, name: profileForm.name.trim(), phone: profileForm.phone.trim() } }, {
      onSuccess: () => {
        refreshProfile();
        setMessage('Your shopper details are saved.');
      },
      onError: () => setError('We could not save those details. Please try again.'),
    });
  };

  const submitAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!addressForm.label.trim() || addressForm.address.trim().length < 5) {
      setError('Give this address a label and a little more detail.');
      return;
    }
    if (editingId) {
      updateAddress.mutate({ addressId: editingId, data: { clientId, label: addressForm.label.trim(), address: addressForm.address.trim(), isDefault: addressForm.isDefault } }, {
        onSuccess: () => {
          refreshProfile();
          setEditingId(null);
          setAddressForm({ label: 'Home', address: '', isDefault: false });
          setMessage('Address updated.');
        },
        onError: () => setError('We could not update that address.'),
      });
    } else {
      createAddress.mutate({ data: { clientId, label: addressForm.label.trim(), address: addressForm.address.trim(), isDefault: addressForm.isDefault } }, {
        onSuccess: () => {
          refreshProfile();
          setAddressForm({ label: 'Home', address: '', isDefault: false });
          setMessage('Address added to your saved places.');
        },
        onError: () => setError('We could not save that address.'),
      });
    }
  };

  const startEdit = (address: { id: string; label: string; address: string; isDefault: boolean }) => {
    setEditingId(address.id);
    setAddressForm({ label: address.label, address: address.address, isDefault: address.isDefault });
    setMessage('');
    setError('');
  };

  const removeAddress = (addressId: string) => {
    if (!window.confirm('Remove this saved address?')) return;
    deleteAddress.mutate({ params: { addressId, clientId } }, {
      onSuccess: () => {
        refreshProfile();
        setMessage('Address removed.');
      },
      onError: () => setError('We could not remove that address.'),
    });
  };

  const chooseDefault = (addressId: string) => {
    updateAddress.mutate({ addressId, data: { clientId, isDefault: true } }, {
      onSuccess: () => {
        refreshProfile();
        setMessage('Default delivery place updated.');
      },
      onError: () => setError('We could not change your default address.'),
    });
  };

  const reorder = (items: { productId: string; quantity: number }[]) => {
    items.forEach((item) => Array.from({ length: item.quantity }).forEach(() => add(item.productId)));
    setMessage('Everything from that order is back in your basket.');
  };

  if (profileQuery.isLoading) {
    return <main className="fc-shell py-12"><div className="animate-pulse space-y-6"><div className="h-16 w-72 rounded-2xl bg-[hsl(var(--muted))]" /><div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><div className="h-80 rounded-[26px] bg-[hsl(var(--muted))]" /><div className="h-80 rounded-[26px] bg-[hsl(var(--muted))]" /></div></div></main>;
  }

  if (profileQuery.isError) {
    return <main className="fc-shell py-16"><div className="mx-auto max-w-md rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center"><CircleAlert className="mx-auto h-9 w-9 text-[hsl(var(--accent))]" /><h1 className="fc-display mt-4 text-4xl font-bold">Your profile is taking a minute.</h1><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">We could not reach your saved details just now.</p><button type="button" onClick={() => profileQuery.refetch()} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))]" data-testid="button-retry-profile"><RefreshCw className="h-4 w-4" /> Try again</button></div></main>;
  }

  const addresses = profileQuery.data?.addresses ?? [];
  const orders = ordersQuery.data ?? [];

  return (
    <main className="fc-shell py-9 md:py-14">
      <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[hsl(var(--accent))]">Your FreshCart</p><h1 className="fc-display text-5xl font-bold sm:text-6xl" data-testid="heading-profile">A smoother grocery run.</h1><p className="mt-3 max-w-lg text-sm leading-6 text-[hsl(var(--muted-foreground))]">Keep your details and delivery places close. We will remember the little things.</p></div>
        <div className="flex items-center gap-2 rounded-full bg-[hsl(var(--secondary))] px-4 py-2 text-xs font-bold text-[hsl(var(--primary))]"><UserRound className="h-4 w-4" /> Shopper profile</div>
      </div>
      {(message || error) && <div className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 text-sm ${error ? 'border-[hsl(var(--accent)/.35)] bg-[hsl(var(--accent)/.1)]' : 'border-[hsl(var(--primary)/.25)] bg-[hsl(var(--secondary)/.7)]'}`} role="status" data-testid={error ? 'error-profile' : 'success-profile'}>{error ? <CircleAlert className="h-4 w-4 text-[hsl(var(--accent))]" /> : <Check className="h-4 w-4 text-[hsl(var(--primary))]" />}{error || message}</div>}
      <div className="grid items-start gap-6 lg:grid-cols-[.78fr_1.22fr]">
        <section className="rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-7" data-testid="section-profile-details">
          <div className="mb-6 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><UserRound className="h-5 w-5" /></span><div><h2 className="font-black">Your details</h2><p className="text-xs text-[hsl(var(--muted-foreground))]">Used for every delivery.</p></div></div>
          <form onSubmit={saveProfile} className="space-y-4">
            <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Name</span><input className={inputClass} value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} data-testid="input-profile-name" /></label>
            <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Phone</span><input className={inputClass} type="tel" value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} data-testid="input-profile-phone" /></label>
            <button type="submit" disabled={updateProfile.isPending} className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 text-sm font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5 disabled:opacity-60" data-testid="button-save-profile">{updateProfile.isPending ? 'Saving details…' : 'Save details'}</button>
          </form>
        </section>
        <section className="rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-7" data-testid="section-saved-addresses">
          <div className="mb-6 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><MapPin className="h-5 w-5" /></span><div><h2 className="font-black">Saved places</h2><p className="text-xs text-[hsl(var(--muted-foreground))]">Pick faster next time.</p></div></div><span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">{addresses.length} saved</span></div>
          {addresses.length > 0 && <div className="mb-6 grid gap-3 sm:grid-cols-2">{addresses.map((address) => <div key={address.id} className={`rounded-2xl border p-4 transition ${address.isDefault ? 'border-[hsl(var(--primary)/.45)] bg-[hsl(var(--secondary)/.55)]' : 'border-[hsl(var(--border))]'}`} data-testid={`card-address-${address.id}`}><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><Home className="h-4 w-4 shrink-0 text-[hsl(var(--primary))]" /><p className="truncate text-sm font-black">{address.label}</p>{address.isDefault && <span className="rounded-full bg-[hsl(var(--primary))] px-2 py-0.5 text-[10px] font-bold text-[hsl(var(--primary-foreground))]">Default</span>}</div><div className="flex shrink-0 gap-1"><button type="button" onClick={() => startEdit(address)} className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]" aria-label={`Edit ${address.label}`} data-testid={`button-edit-address-${address.id}`}><Pencil className="h-3.5 w-3.5" /></button><button type="button" onClick={() => removeAddress(address.id)} className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent)/.12)] hover:text-[hsl(var(--accent))]" aria-label={`Delete ${address.label}`} data-testid={`button-delete-address-${address.id}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div><p className="mt-3 line-clamp-2 text-xs leading-5 text-[hsl(var(--muted-foreground))]">{address.address}</p>{!address.isDefault && <button type="button" onClick={() => chooseDefault(address.id)} className="mt-3 text-xs font-bold text-[hsl(var(--primary))] hover:underline" data-testid={`button-default-address-${address.id}`}>Make default</button>}</div>)}</div>}
          {addresses.length === 0 && <div className="mb-5 rounded-2xl border border-dashed border-[hsl(var(--border))] px-4 py-5 text-center text-sm text-[hsl(var(--muted-foreground))]">No saved places yet. Add Home or Work below.</div>}
          <form onSubmit={submitAddress} className="rounded-2xl bg-[hsl(var(--background))] p-4" data-testid="form-address">
            <div className="mb-3 flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-black">{editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingId ? 'Edit place' : 'Add a place'}</p>{editingId && <button type="button" onClick={() => { setEditingId(null); setAddressForm({ label: 'Home', address: '', isDefault: false }); }} className="text-xs font-bold text-[hsl(var(--muted-foreground))]" data-testid="button-cancel-address"><X className="mr-1 inline h-3.5 w-3.5" />Cancel</button>}</div>
            <div className="grid gap-3 sm:grid-cols-[130px_1fr]"><input className={inputClass} value={addressForm.label} onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })} placeholder="Home" data-testid="input-address-label" /><input className={inputClass} value={addressForm.address} onChange={(event) => setAddressForm({ ...addressForm, address: event.target.value })} placeholder="Flat, street, neighbourhood" data-testid="input-address-text" /></div>
            <label className="mt-3 flex items-center gap-2 text-xs font-bold text-[hsl(var(--muted-foreground))]"><input type="checkbox" checked={addressForm.isDefault} onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })} className="accent-[hsl(var(--primary))]" data-testid="input-address-default" /> Use as my default delivery place</label>
            <button type="submit" disabled={createAddress.isPending || updateAddress.isPending} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[hsl(var(--primary))] text-sm font-bold text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--secondary))] disabled:opacity-60" data-testid="button-save-address">{createAddress.isPending || updateAddress.isPending ? 'Saving place…' : editingId ? 'Update place' : 'Save place'}</button>
          </form>
        </section>
      </div>
      <section className="mt-6 rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-7" data-testid="section-order-history">
        <div className="mb-6 flex items-end justify-between gap-3"><div><p className="mb-1 text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--accent))]">The good stuff, again</p><h2 className="fc-display text-3xl font-bold">Order history</h2></div><span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span></div>
        {ordersQuery.isLoading && <div className="space-y-3"><div className="h-20 animate-pulse rounded-2xl bg-[hsl(var(--muted))]" /><div className="h-20 animate-pulse rounded-2xl bg-[hsl(var(--muted))]" /></div>}
        {ordersQuery.isError && <div className="rounded-2xl bg-[hsl(var(--accent)/.08)] p-5 text-sm"><p className="font-bold">Orders could not be loaded.</p><button type="button" onClick={() => ordersQuery.refetch()} className="mt-2 font-bold text-[hsl(var(--primary))]" data-testid="button-retry-orders">Try again</button></div>}
        {!ordersQuery.isLoading && !ordersQuery.isError && orders.length === 0 && <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] px-5 py-10 text-center"><Package className="mx-auto h-8 w-8 text-[hsl(var(--muted-foreground))]" /><p className="mt-3 text-sm font-bold">Your first grocery run is still ahead.</p><Link href="/shop" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]" data-testid="link-empty-orders">Start shopping <ArrowRight className="h-4 w-4" /></Link></div>}
        <div className="space-y-3">{orders.map((order) => <article key={order.id} className="rounded-2xl border border-[hsl(var(--border))] p-4 sm:p-5" data-testid={`row-order-${order.id}`}><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-black">Order {order.id}</p><StatusPill status={order.status} /></div><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · {formatRupees(order.total)}</p></div><div className="flex flex-wrap gap-2"><Link href={`/track/${order.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--primary))] px-3.5 py-2 text-xs font-bold text-[hsl(var(--primary-foreground))]" data-testid={`link-track-order-${order.id}`}>Track order <ArrowRight className="h-3.5 w-3.5" /></Link><button type="button" onClick={() => reorder(order.items)} className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-3.5 py-2 text-xs font-bold" data-testid={`button-reorder-${order.id}`}><RefreshCw className="h-3.5 w-3.5" /> Reorder</button></div></div></article>)}</div>
      </section>
    </main>
  );
}