import { Check, ChevronRight, Clock3, PackageCheck, ShoppingBasket } from 'lucide-react';
import { Link } from 'wouter';
import { useState } from 'react';

type StoredOrder = { id: string; status: string; total: number; eta: string; paymentMethod: string };

export default function OrderSuccess() {
  const [order] = useState<StoredOrder | null>(() => {
    try { const raw = window.sessionStorage.getItem('freshcart-last-order'); return raw ? JSON.parse(raw) as StoredOrder : null; } catch { return null; }
  });
  const orderId = order?.id ?? 'FC-READY';
  return (
    <main className="fc-shell py-12 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-[30px] bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] shadow-[8px_8px_0_hsl(var(--primary)/.2)]"><Check className="h-11 w-11" strokeWidth={3} /><span className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><PackageCheck className="h-5 w-5" /></span></div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[hsl(var(--accent))]">Basket successfully sent</p>
        <h1 className="fc-display mt-3 text-5xl font-bold sm:text-7xl" data-testid="heading-order-success">That’s sorted.</h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[hsl(var(--muted-foreground))]" data-testid="text-order-confirmation">Your fresh essentials are on their way. Put the kettle on — we’ll be at your door soon.</p>
        <div className="mx-auto mt-9 grid max-w-lg divide-y divide-[hsl(var(--border))] rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-left sm:grid-cols-3 sm:divide-x sm:divide-y-0" data-testid="card-order-details">
          <div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Order number</p><p className="mt-2 text-sm font-black" data-testid="text-order-id">{orderId}</p></div>
          <div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Arrives</p><p className="mt-2 flex items-center gap-1.5 text-sm font-black" data-testid="text-order-eta"><Clock3 className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />{order?.eta ?? 'In the promised window'}</p></div>
          <div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Payment</p><p className="mt-2 text-sm font-black capitalize" data-testid="text-order-payment">{order?.paymentMethod === 'upi' ? 'UPI' : 'Cash on delivery'}</p></div>
        </div>
         <div className="mt-9 flex flex-wrap justify-center gap-3"><Link href={order ? `/track/${order.id}` : '/profile'} className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3.5 text-sm font-bold text-[hsl(var(--primary-foreground))]" data-testid="link-track-new-order">Track this order <ChevronRight className="h-4 w-4" /></Link><Link href="/profile" className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-3.5 text-sm font-bold" data-testid="link-order-profile">Your orders</Link><Link href="/shop" className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-3.5 text-sm font-bold" data-testid="link-order-shop"><ShoppingBasket className="h-4 w-4" /> Keep shopping</Link></div>
      </div>
    </main>
  );
}