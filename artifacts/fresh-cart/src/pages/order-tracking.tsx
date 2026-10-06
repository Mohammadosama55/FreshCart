import { ArrowLeft, Check, CircleAlert, Clock3, MapPin, Package, RefreshCw, ShoppingBag, Truck } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { getGetOrderQueryKey, useGetOrder } from '@workspace/api-client-react';
import { getClientId } from '@/lib/customer';
import { formatRupees } from '@/components/product-card';

const stages = [
  { key: 'confirmed', label: 'Confirmed', note: 'Your order is safely with us.', icon: Check },
  { key: 'packing', label: 'Being packed', note: 'A careful hand is gathering your items.', icon: Package },
  { key: 'out_for_delivery', label: 'On the way', note: 'Your basket is heading to your door.', icon: Truck },
  { key: 'delivered', label: 'Delivered', note: 'Enjoy the good stuff.', icon: ShoppingBag },
];

export default function OrderTracking() {
  const params = useParams<{ orderId: string }>();
  const clientId = getClientId();
  const orderId = params.orderId ?? '';
  const orderQuery = useGetOrder({ orderId, clientId }, {
    query: {
      enabled: Boolean(orderId && clientId),
      queryKey: getGetOrderQueryKey({ orderId, clientId }),
      refetchInterval: (query) => query.state.data?.status === 'delivered' ? false : 8000,
    },
  });

  if (orderQuery.isLoading) return <main className="fc-shell py-12"><div className="animate-pulse space-y-6"><div className="h-5 w-36 rounded bg-[hsl(var(--muted))]" /><div className="h-44 rounded-[28px] bg-[hsl(var(--muted))]" /><div className="h-80 rounded-[28px] bg-[hsl(var(--muted))]" /></div></main>;
  if (orderQuery.isError || !orderQuery.data) return <main className="fc-shell py-16"><div className="mx-auto max-w-md rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center"><CircleAlert className="mx-auto h-9 w-9 text-[hsl(var(--accent))]" /><h1 className="fc-display mt-4 text-4xl font-bold">We lost sight of that order.</h1><p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">It may belong to another shopper, or the order number needs a second look.</p><div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => orderQuery.refetch()} className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))]" data-testid="button-retry-tracking"><RefreshCw className="h-4 w-4" /> Try again</button><Link href="/profile" className="inline-flex items-center rounded-full border border-[hsl(var(--border))] px-4 py-3 text-sm font-bold" data-testid="link-tracking-orders">Your orders</Link></div></div></main>;

  const order = orderQuery.data;
  const currentIndex = Math.max(0, stages.findIndex((stage) => stage.key === order.status));
  return (
    <main className="fc-shell py-8 md:py-12">
      <Link href="/profile" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]" data-testid="link-back-orders"><ArrowLeft className="h-4 w-4" /> Back to your orders</Link>
      <div className="grid items-start gap-6 lg:grid-cols-[1.12fr_.88fr]">
        <div>
          <div className="rounded-[28px] bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))] sm:p-8" data-testid="card-tracking-status">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary-foreground)/.65)]">Order {order.id}</p><h1 className="fc-display mt-2 text-4xl font-bold sm:text-5xl">{order.status === 'delivered' ? 'All yours.' : order.status === 'out_for_delivery' ? 'Nearly at your door.' : 'We are on it.'}</h1></div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><Truck className="h-6 w-6" /></div></div>
            <div className="mt-8 flex items-center gap-2 text-sm font-bold"><Clock3 className="h-4 w-4" /> {order.status === 'delivered' ? 'Delivered successfully' : `Arriving ${order.eta}`}</div>
            <div className="mt-7 grid gap-5">{stages.map((stage, index) => { const Icon = stage.icon; const active = index <= currentIndex; return <div key={stage.key} className="flex items-start gap-3" data-testid={`stage-${stage.key}`}><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${active ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' : 'bg-[hsl(var(--primary-foreground)/.12)] text-[hsl(var(--primary-foreground)/.45)]'}`}><Icon className="h-4 w-4" /></span><div><p className={`text-sm font-black ${active ? '' : 'text-[hsl(var(--primary-foreground)/.45)]'}`}>{stage.label}</p><p className={`mt-0.5 text-xs ${active ? 'text-[hsl(var(--primary-foreground)/.65)]' : 'text-[hsl(var(--primary-foreground)/.35)]'}`}>{stage.note}</p></div>{index === currentIndex && <span className="ml-auto mt-1 h-2 w-2 animate-pulse rounded-full bg-[hsl(var(--accent))]" />}</div>; })}</div>
          </div>
          <div className="mt-6 rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-7" data-testid="card-tracked-items"><div className="mb-5 flex items-center justify-between"><h2 className="font-black">In this basket</h2><span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div><div className="space-y-3">{order.items.map((item) => <div key={item.productId} className="flex items-center justify-between rounded-xl bg-[hsl(var(--background))] px-4 py-3" data-testid={`row-tracked-item-${item.productId}`}><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><ShoppingBag className="h-4 w-4" /></span><span className="text-sm font-bold">{item.productId}</span></div><span className="text-sm font-black">× {item.quantity}</span></div>)}</div></div>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-32">
          <div className="rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--accent))]">Delivery snapshot</p><div className="mt-5 flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--primary))]" /><div><p className="text-sm font-black">Going to</p><p className="mt-1 text-sm leading-6 text-[hsl(var(--muted-foreground))]" data-testid="text-tracking-address">{order.address}</p></div></div><div className="my-5 border-t border-[hsl(var(--border))]" /><div className="flex items-end justify-between"><span className="text-sm text-[hsl(var(--muted-foreground))]">Order total</span><span className="text-2xl font-black" data-testid="text-tracking-total">{formatRupees(order.total)}</span></div><p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">Paid by {order.paymentMethod === 'upi' ? 'UPI' : 'cash on delivery'}</p></div>
          <div className="rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.55)] p-5 sm:p-7"><p className="text-sm font-black">Need another grocery run?</p><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Your saved places and past baskets are waiting in your profile.</p><Link href="/profile" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]" data-testid="link-tracking-profile">Open profile <ArrowLeft className="h-4 w-4 rotate-180" /></Link></div>
        </aside>
      </div>
    </main>
  );
}