import { useState, type CSSProperties } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import type { Product } from '@workspace/api-client-react';
import { useCart } from '@/lib/cart';

export const formatRupees = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export function ProductCard({ product }: { product: Product }) {
  const { add, decrement, quantityFor } = useCart();
  const quantity = quantityFor(product.id);
  const [imageFailed, setImageFailed] = useState(false);
  const accent = product.accent || '#f8a44c';
  return (
    <article className="fc-product-card group relative flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[hsl(var(--card-border))] bg-[hsl(var(--card))]" data-testid={`card-product-${product.id}`}>
      <div className="relative mx-2 mt-2 h-44 overflow-hidden rounded-[17px]" style={{ backgroundColor: accent } as CSSProperties}>
        <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full border-[18px] border-white/20" />
        <div className="absolute -bottom-8 -left-5 h-24 w-24 rounded-full bg-white/15" />
        {!imageFailed && product.image ? (
          <img src={product.image} alt={product.name} onError={() => setImageFailed(true)} className="relative z-10 h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-105" data-testid={`img-product-${product.id}`} />
        ) : (
          <div className="relative z-10 flex h-full items-center justify-center px-8 text-center font-serif text-2xl font-bold leading-tight text-[hsl(var(--foreground))]" data-testid={`img-fallback-${product.id}`}>{product.name}</div>
        )}
        {product.badge && <span className="absolute left-3 top-3 z-20 rounded-full bg-[hsl(var(--foreground))] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--background))]" data-testid={`badge-product-${product.id}`}>{product.badge}</span>}
      </div>
      <div className="flex flex-1 flex-col p-4 pb-3">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.13em] text-[hsl(var(--muted-foreground))]">{product.category}</p>
        <h3 className="min-h-[42px] text-[15px] font-bold leading-5 text-[hsl(var(--foreground))]" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
        <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{product.unit}</p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <span className="text-lg font-black tracking-[-0.04em] text-[hsl(var(--foreground))]" data-testid={`text-product-price-${product.id}`}>{formatRupees(product.price)}</span>
            {product.compareAtPrice && <span className="ml-1.5 text-xs text-[hsl(var(--muted-foreground))] line-through">{formatRupees(product.compareAtPrice)}</span>}
          </div>
          {quantity === 0 ? (
            <button type="button" onClick={() => add(product.id)} className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5 active:scale-95" aria-label={`Add ${product.name} to cart`} data-testid={`button-add-${product.id}`}>
              <Plus className="h-4 w-4" strokeWidth={2.8} />
            </button>
          ) : (
            <div className="flex h-9 items-center gap-2 rounded-xl bg-[hsl(var(--secondary))] px-1.5" data-testid={`control-quantity-${product.id}`}>
              <button type="button" onClick={() => decrement(product.id)} className="grid h-7 w-7 place-items-center rounded-lg text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card))]" aria-label={`Remove one ${product.name}`} data-testid={`button-decrement-${product.id}`}><Minus className="h-3.5 w-3.5" /></button>
              <span className="min-w-4 text-center text-sm font-black" data-testid={`text-quantity-${product.id}`}>{quantity}</span>
              <button type="button" onClick={() => add(product.id)} className="grid h-7 w-7 place-items-center rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" aria-label={`Add one ${product.name}`} data-testid={`button-increment-${product.id}`}><Plus className="h-3.5 w-3.5" /></button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductSkeleton() {
  return <div className="animate-pulse overflow-hidden rounded-[22px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2"><div className="h-44 rounded-[17px] bg-[hsl(var(--muted))]" /><div className="space-y-3 p-4"><div className="h-2.5 w-1/3 rounded-full bg-[hsl(var(--muted))]" /><div className="h-4 w-4/5 rounded-full bg-[hsl(var(--muted))]" /><div className="h-4 w-1/2 rounded-full bg-[hsl(var(--muted))]" /></div></div>;
}