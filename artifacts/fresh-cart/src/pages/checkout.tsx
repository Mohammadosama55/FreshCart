import { useMemo, useState, type FormEvent } from 'react';
import { ArrowLeft, Check, ChevronRight, CircleAlert, CreditCard, MapPin, Minus, Plus, ShieldCheck, Trash2, WalletCards } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { getGetCatalogHighlightsQueryKey, getListProductsQueryKey, useCreateOrder, useGetCatalogHighlights, useListProducts, type OrderInputPaymentMethod } from '@workspace/api-client-react';
import { formatRupees } from '@/components/product-card';
import { useCart } from '@/lib/cart';

const defaultForm = { customerName: '', phone: '', address: '' };

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { add, decrement, remove, clear, linesFor, count } = useCart();
  const products = useListProducts(undefined, { query: { queryKey: getListProductsQueryKey() } });
  const highlights = useGetCatalogHighlights({ query: { queryKey: getGetCatalogHighlightsQueryKey() } }).data;
  const orderMutation = useCreateOrder();
  const [form, setForm] = useState(defaultForm);
  const [paymentMethod, setPaymentMethod] = useState<OrderInputPaymentMethod>('cod');
  const [formError, setFormError] = useState('');
  const lines = useMemo(() => linesFor(products.data ?? []), [products.data, linesFor]);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const freeThreshold = highlights?.freeDeliveryThreshold ?? 699;
  const deliveryFee = subtotal === 0 || subtotal >= freeThreshold ? 0 : 39;
  const total = subtotal + deliveryFee;
  const minimumOrder = highlights?.minimumOrder ?? 199;

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (count === 0 || lines.length === 0) { setFormError('Your basket is empty. Add a few essentials before checking out.'); return; }
    if (subtotal < minimumOrder) { setFormError(`A small run starts at ${formatRupees(minimumOrder)}. Add a little more to place this order.`); return; }
    if (!form.customerName.trim() || form.phone.trim().length < 8 || form.address.trim().length < 5) { setFormError('Please fill in your name, phone number, and delivery address.'); return; }
    setFormError('');
    orderMutation.mutate({ data: { items: lines.map(({ product, quantity }) => ({ productId: product.id, quantity })), customerName: form.customerName.trim(), phone: form.phone.trim(), address: form.address.trim(), paymentMethod } }, {
      onSuccess: (order) => {
        window.sessionStorage.setItem('freshcart-last-order', JSON.stringify(order));
        clear();
        setLocation('/order-success');
      },
      onError: () => setFormError('We could not place that order just now. Please check your details and try again.'),
    });
  };

  if (products.isLoading) return <main className="fc-shell py-16"><div className="animate-pulse space-y-5"><div className="h-10 w-52 rounded-full bg-[hsl(var(--muted))]" /><div className="grid gap-8 lg:grid-cols-[1fr_380px]"><div className="h-[500px] rounded-[24px] bg-[hsl(var(--muted))]" /><div className="h-[380px] rounded-[24px] bg-[hsl(var(--muted))]" /></div></div></main>;

  return (
    <main className="fc-shell py-8 md:py-12">
      <div className="mb-8 flex items-center gap-3 text-sm font-bold text-[hsl(var(--muted-foreground))]"><Link href="/shop" className="inline-flex items-center gap-1 hover:text-[hsl(var(--foreground))]" data-testid="link-back-shop"><ArrowLeft className="h-4 w-4" /> Continue shopping</Link><ChevronRight className="h-4 w-4" /><span className="text-[hsl(var(--foreground))]">Your checkout</span></div>
      {formError && <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[hsl(var(--accent)/.35)] bg-[hsl(var(--accent)/.1)] p-4 text-sm" role="alert" data-testid="error-checkout"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" /><span>{formError}</span></div>}
      {count === 0 || lines.length === 0 ? <div className="rounded-[28px] border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-16 text-center" data-testid="empty-checkout"><div className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><WalletCards className="h-7 w-7" /></div><h1 className="fc-display mt-6 text-4xl font-bold">Your basket is waiting.</h1><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">Fill it with the things your kitchen reaches for. We’ll handle the rest.</p><Link href="/shop" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))]" data-testid="link-empty-shop">Browse the shop <ChevronRight className="h-4 w-4" /></Link></div> : <form onSubmit={submitOrder} className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--accent))]">Almost there</p><h1 className="fc-display text-4xl font-bold sm:text-5xl" data-testid="heading-checkout">Let’s get this to your door.</h1></div>
          <section className="rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-7" data-testid="section-delivery-details">
            <div className="mb-5 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><MapPin className="h-4 w-4" /></span><div><h2 className="font-black">Delivery details</h2><p className="text-xs text-[hsl(var(--muted-foreground))]">Where should we bring your basket?</p></div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Your name</span><input value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="e.g. Asha Mehta" className="h-12 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm outline-none focus:border-[hsl(var(--accent))]" data-testid="input-customer-name" /></label>
              <label><span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Phone number</span><input type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+91 98765 43210" className="h-12 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm outline-none focus:border-[hsl(var(--accent))]" data-testid="input-customer-phone" /></label>
              <label><span className="mb-1.5 block text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Delivery area</span><input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Flat, street, neighbourhood" className="h-12 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 text-sm outline-none focus:border-[hsl(var(--accent))]" data-testid="input-customer-address" /></label>
            </div>
          </section>
          <section className="mt-4 rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-7" data-testid="section-payment">
            <div className="mb-5 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><CreditCard className="h-4 w-4" /></span><div><h2 className="font-black">How would you like to pay?</h2><p className="text-xs text-[hsl(var(--muted-foreground))]">Simple and secure at your doorstep.</p></div></div>
            <div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setPaymentMethod('cod')} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${paymentMethod === 'cod' ? 'border-[hsl(var(--primary))] bg-[hsl(var(--secondary))]' : 'border-[hsl(var(--border))]'}`} data-testid="button-payment-cod"><span className={`grid h-8 w-8 place-items-center rounded-xl ${paymentMethod === 'cod' ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--muted))]'}`}><WalletCards className="h-4 w-4" /></span><span><span className="block text-sm font-black">Cash on delivery</span><span className="text-xs text-[hsl(var(--muted-foreground))]">Pay when it arrives</span></span>{paymentMethod === 'cod' && <Check className="ml-auto h-4 w-4 text-[hsl(var(--primary))]" />}</button><button type="button" onClick={() => setPaymentMethod('upi')} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${paymentMethod === 'upi' ? 'border-[hsl(var(--primary))] bg-[hsl(var(--secondary))]' : 'border-[hsl(var(--border))]'}`} data-testid="button-payment-upi"><span className={`grid h-8 w-8 place-items-center rounded-xl ${paymentMethod === 'upi' ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--muted))]'}`}><CreditCard className="h-4 w-4" /></span><span><span className="block text-sm font-black">UPI</span><span className="text-xs text-[hsl(var(--muted-foreground))]">Pay digitally</span></span>{paymentMethod === 'upi' && <Check className="ml-auto h-4 w-4 text-[hsl(var(--primary))]" />}</button></div>
          </section>
        </div>
        <aside className="lg:sticky lg:top-32">
          <div className="rounded-[24px] bg-[hsl(var(--foreground))] p-5 text-[hsl(var(--background))] sm:p-7" data-testid="card-order-summary">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-black">Your basket</h2><span className="rounded-full bg-[hsl(var(--background)/.12)] px-2.5 py-1 text-xs font-bold" data-testid="text-summary-count">{count} items</span></div>
            <div className="max-h-[310px] space-y-4 overflow-y-auto pr-1">{lines.map(({ product, quantity }) => <div key={product.id} className="flex gap-3" data-testid={`row-checkout-${product.id}`}><div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl" style={{ backgroundColor: product.accent }}><img src={product.image} alt="" className="h-full w-full object-contain p-1" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{product.name}</p><p className="mt-0.5 text-xs text-[hsl(var(--background)/.55)]">{formatRupees(product.price)} · {product.unit}</p><div className="mt-2 flex items-center gap-2"><button type="button" onClick={() => decrement(product.id)} className="grid h-6 w-6 place-items-center rounded-lg bg-[hsl(var(--background)/.1)]" aria-label={`Decrease ${product.name}`} data-testid={`button-checkout-decrement-${product.id}`}><Minus className="h-3 w-3" /></button><span className="text-xs font-bold">{quantity}</span><button type="button" onClick={() => add(product.id)} className="grid h-6 w-6 place-items-center rounded-lg bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]" aria-label={`Increase ${product.name}`} data-testid={`button-checkout-increment-${product.id}`}><Plus className="h-3 w-3" /></button><button type="button" onClick={() => remove(product.id)} className="ml-auto p-1 text-[hsl(var(--background)/.5)] hover:text-[hsl(var(--accent))]" aria-label={`Remove ${product.name}`} data-testid={`button-remove-${product.id}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div><span className="text-sm font-bold">{formatRupees(product.price * quantity)}</span></div>)}</div>
            <div className="my-5 border-t border-[hsl(var(--background)/.14)]" />
            <div className="space-y-3 text-sm"><div className="flex justify-between text-[hsl(var(--background)/.65)]"><span>Basket total</span><span>{formatRupees(subtotal)}</span></div><div className="flex justify-between text-[hsl(var(--background)/.65)]"><span>Delivery</span><span className={deliveryFee === 0 ? 'text-[hsl(var(--accent))]' : ''}>{deliveryFee === 0 ? 'Free' : formatRupees(deliveryFee)}</span></div><div className="flex justify-between pt-2 text-lg font-black"><span>Total</span><span data-testid="text-order-total">{formatRupees(total)}</span></div></div>
            <button type="submit" disabled={orderMutation.isPending} className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[hsl(var(--accent))] px-4 py-3.5 text-sm font-black text-[hsl(var(--accent-foreground))] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60" data-testid="button-place-order">{orderMutation.isPending ? 'Placing your order…' : <>Place order <ChevronRight className="h-4 w-4" /></>}</button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-[hsl(var(--background)/.48)]"><ShieldCheck className="h-3.5 w-3.5" /> Your details are only used for this delivery.</p>
          </div>
        </aside>
      </form>}
    </main>
  );
}