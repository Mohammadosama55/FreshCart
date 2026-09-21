import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Search, ShoppingBasket, Truck, Wifi } from 'lucide-react';
import { getGetCatalogHighlightsQueryKey, getHealthCheckQueryKey, useGetCatalogHighlights, useHealthCheck } from '@workspace/api-client-react';
import { useCart } from '@/lib/cart';

const rupees = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export function SiteHeader() {
  const [location, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const { count } = useCart();
  const highlights = useGetCatalogHighlights({ query: { queryKey: getGetCatalogHighlightsQueryKey() } }).data;
  const isShop = location.startsWith('/shop');

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    setLocation(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--border)/.75)] bg-[hsl(var(--background)/.92)] backdrop-blur-xl">
      <div className="bg-[hsl(var(--primary))] px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[hsl(var(--primary-foreground))]">
        <span className="inline-flex items-center gap-2"><Truck className="h-3.5 w-3.5" /> {highlights?.deliveryWindow ?? 'Fresh groceries, right on time'} <span className="hidden sm:inline">· Free delivery from {rupees(highlights?.freeDeliveryThreshold ?? 699)}</span></span>
      </div>
      <div className="fc-shell flex min-h-[76px] items-center gap-5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" data-testid="link-home-logo">
          <span className="relative grid h-10 w-10 place-items-center rounded-[14px] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-[4px_4px_0_hsl(var(--foreground)/.12)] transition-transform group-hover:-rotate-6">
            <ShoppingBasket className="h-5 w-5" strokeWidth={2.4} />
            <span className="absolute -right-0.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--primary))]" />
          </span>
          <span className="text-[21px] font-black tracking-[-0.07em] text-[hsl(var(--foreground))]">fresh<span className="text-[hsl(var(--accent))]">cart</span></span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold text-[hsl(var(--muted-foreground))] lg:flex">
          <Link href="/" className={`transition-colors hover:text-[hsl(var(--foreground))] ${location === '/' ? 'text-[hsl(var(--foreground))]' : ''}`} data-testid="link-nav-home">Home</Link>
          <Link href="/shop" className={`transition-colors hover:text-[hsl(var(--foreground))] ${isShop ? 'text-[hsl(var(--foreground))]' : ''}`} data-testid="link-nav-shop">Shop all</Link>
        </nav>

        <form onSubmit={submitSearch} className="relative ml-auto hidden w-full max-w-[360px] md:block" data-testid="form-header-search">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search atta, mangoes, chai..."
            className="h-11 w-full rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-[hsl(var(--muted-foreground)/.75)] focus:border-[hsl(var(--accent))] focus:ring-4 focus:ring-[hsl(var(--accent)/.14)]"
            data-testid="input-header-search"
          />
        </form>

        <Link href="/checkout" className="group relative flex shrink-0 items-center gap-2 rounded-full bg-[hsl(var(--foreground))] px-3.5 py-2.5 text-sm font-bold text-[hsl(var(--background))] transition-transform hover:-translate-y-0.5 sm:px-4" data-testid="link-header-cart">
          <ShoppingBasket className="h-[17px] w-[17px]" />
          <span className="hidden sm:inline">{count ? `${count} ${count === 1 ? 'item' : 'items'} · ` : ''}Cart</span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[hsl(var(--accent))] px-1 text-[11px] text-[hsl(var(--accent-foreground))]" data-testid="text-cart-count">{count}</span>
        </Link>
      </div>
      <form onSubmit={submitSearch} className="fc-shell pb-3 md:hidden" data-testid="form-mobile-search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your next grocery run" className="h-11 w-full rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-11 pr-4 text-sm outline-none focus:border-[hsl(var(--accent))]" data-testid="input-mobile-search" />
        </div>
      </form>
    </header>
  );
}

export function SiteFooter() {
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });
  return (
    <footer className="mt-20 overflow-hidden bg-[hsl(var(--foreground))] text-[hsl(var(--background))]">
      <div className="fc-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><ShoppingBasket className="h-4 w-4" /></span>
            <span className="text-xl font-black tracking-[-0.07em]">fresh<span className="text-[hsl(var(--accent))]">cart</span></span>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[hsl(var(--background)/.65)]">The helpful neighborhood grocery run, made for busy Indian homes.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--background)/.15)] px-3 py-1.5 text-xs text-[hsl(var(--background)/.72)]" data-testid="status-network">
            <Wifi className={`h-3.5 w-3.5 ${health.isError ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--primary))]'}`} />
            {health.isError ? 'Delivery network checking' : 'Delivery network online'}
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[hsl(var(--accent))]">Your shortcut</p>
          <div className="grid gap-3 text-sm text-[hsl(var(--background)/.72)]">
            <Link href="/shop" className="transition-colors hover:text-[hsl(var(--background))]" data-testid="link-footer-shop">Browse the full shop</Link>
            <Link href="/checkout" className="transition-colors hover:text-[hsl(var(--background))]" data-testid="link-footer-cart">Review your cart</Link>
            <Link href="/" className="transition-colors hover:text-[hsl(var(--background))]" data-testid="link-footer-home">Back to home</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[hsl(var(--accent))]">Good to know</p>
          <p className="text-sm leading-6 text-[hsl(var(--background)/.72)]">We pick the good stuff, pack it with care, and send it to your door in the promised window.</p>
          <p className="mt-5 text-xs text-[hsl(var(--background)/.45)]">Made for the everyday Indian kitchen.</p>
        </div>
      </div>
      <div className="border-t border-[hsl(var(--background)/.12)]">
        <div className="fc-shell flex flex-col justify-between gap-2 py-5 text-xs text-[hsl(var(--background)/.45)] sm:flex-row">
          <span>© 2025 FreshCart</span><span>Fresh essentials, zero aisle wandering.</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return <div className="min-h-[100dvh]"><SiteHeader />{children}<SiteFooter /></div>;
}

export { ArrowRight };