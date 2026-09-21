import { ArrowRight, Check, Clock3, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { getGetCatalogHighlightsQueryKey, getListCategoriesQueryKey, getListProductsQueryKey, useGetCatalogHighlights, useListCategories, useListProducts } from '@workspace/api-client-react';
import { CategoryStrip } from '@/components/category-strip';
import { ProductCard, ProductSkeleton, formatRupees } from '@/components/product-card';

export default function Home() {
  const highlights = useGetCatalogHighlights({ query: { queryKey: getGetCatalogHighlightsQueryKey() } });
  const categories = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const products = useListProducts({ featured: true }, { query: { queryKey: getListProductsQueryKey({ featured: true }) } });
  const info = highlights.data;

  return (
    <main>
      <section className="fc-shell relative overflow-hidden py-8 md:py-12 lg:py-16">
        <div className="relative grid overflow-hidden rounded-[30px] bg-[hsl(var(--primary))] shadow-[0_24px_50px_-24px_hsl(var(--primary))] lg:grid-cols-[1.08fr_.92fr]">
          <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="fc-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary-foreground)/.2)] bg-[hsl(var(--primary-foreground)/.1)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[hsl(var(--primary-foreground)/.86)]">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--accent))]" /> Your local shortcut to good food
            </div>
            <h1 className="fc-display fc-reveal fc-reveal-delay-1 max-w-[580px] text-5xl font-bold leading-[.95] text-[hsl(var(--primary-foreground))] sm:text-7xl lg:text-[84px]">Good food.<br /><span className="text-[hsl(var(--accent))]">Sorted fast.</span></h1>
            <p className="fc-reveal fc-reveal-delay-2 mt-6 max-w-[450px] text-base leading-7 text-[hsl(var(--primary-foreground)/.74)] sm:text-lg">{info?.subheadline ?? 'Fresh staples, familiar favourites and the little things your kitchen reaches for — delivered without the supermarket detour.'}</p>
            <div className="fc-reveal fc-reveal-delay-3 mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-5 py-3.5 text-sm font-black text-[hsl(var(--accent-foreground))] shadow-[4px_4px_0_hsl(var(--foreground)/.18)] transition-transform hover:-translate-y-0.5" data-testid="link-hero-shop">Start your run <ArrowRight className="h-4 w-4" /></Link>
              <a href="#how-it-works" className="inline-flex items-center rounded-full border border-[hsl(var(--primary-foreground)/.24)] px-5 py-3.5 text-sm font-bold text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--primary-foreground)/.1)]" data-testid="link-hero-how-it-works">How it works</a>
            </div>
          </div>
          <div className="relative min-h-[310px] overflow-hidden bg-[hsl(var(--accent))] lg:min-h-full">
            <div className="absolute -right-14 -top-20 h-72 w-72 rounded-full border-[42px] border-[hsl(var(--primary))] opacity-20" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full border-[42px] border-[hsl(var(--primary))] opacity-20" />
            <div className="absolute right-[15%] top-[17%] h-5 w-5 rounded-full bg-[hsl(var(--background))] opacity-60" />
            <div className="absolute left-[17%] top-[27%] h-3 w-3 rounded-full bg-[hsl(var(--background))] opacity-50" />
            <div className="absolute left-1/2 top-1/2 w-[245px] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-[26px] border-2 border-[hsl(var(--foreground)/.12)] bg-[hsl(var(--background))] p-5 shadow-[14px_18px_0_hsl(var(--foreground)/.15)] sm:w-[285px]">
              <div className="mb-5 flex items-start justify-between border-b border-dashed border-[hsl(var(--foreground)/.2)] pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">FreshCart run</p><p className="mt-1 text-sm font-black">For your kitchen</p></div><span className="rounded-full bg-[hsl(var(--primary))] px-2 py-1 text-[9px] font-bold uppercase text-[hsl(var(--primary-foreground))]">Today</span></div>
              <div className="space-y-3 text-xs font-bold"><div className="flex justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--accent))]" />Daily atta</span><span>1 kg</span></div><div className="flex justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--primary))]" />Alphonso mangoes</span><span>4 pcs</span></div><div className="flex justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#c9d76e]" />Masala chai</span><span>250 g</span></div></div>
              <div className="mt-5 flex items-center justify-between border-t border-dashed border-[hsl(var(--foreground)/.2)] pt-4"><span className="text-[10px] font-bold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">On its way</span><span className="text-sm font-black text-[hsl(var(--primary))]">{info?.deliveryWindow ?? '30–45 min'}</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.48)] py-3">
        <div className="fc-marquee flex w-max gap-10 whitespace-nowrap text-[11px] font-bold uppercase tracking-[.2em] text-[hsl(var(--primary))]"><span>Farm-picked produce</span><span>•</span><span>Reliable essentials</span><span>•</span><span>Neighbourhood prices</span><span>•</span><span>Farm-picked produce</span><span>•</span><span>Reliable essentials</span><span>•</span><span>Neighbourhood prices</span><span>•</span></div>
      </div>

      {categories.data && categories.data.length > 0 ? <CategoryStrip categories={categories.data} /> : categories.isLoading ? <div className="fc-shell py-14"><div className="h-8 w-56 animate-pulse rounded-full bg-[hsl(var(--muted))]" /></div> : null}

      <section className="fc-shell pb-12 md:pb-20" data-testid="section-featured">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--accent))]">Picked for the week</p><h2 className="fc-display text-3xl font-bold text-[hsl(var(--foreground))] sm:text-4xl">The good stuff, first.</h2></div>
          <Link href="/shop" className="hidden items-center gap-1 text-sm font-bold text-[hsl(var(--primary))] sm:flex" data-testid="link-featured-shop">See the full shelf <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {products.isError ? <div className="rounded-[20px] border border-[hsl(var(--accent)/.3)] bg-[hsl(var(--accent)/.1)] p-6 text-sm font-medium text-[hsl(var(--foreground))]" data-testid="error-featured">Could not load this week’s picks. Try the full shop instead.</div> : products.isLoading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <ProductSkeleton key={item} />)}</div> : products.data && products.data.length > 0 ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{products.data.slice(0, 8).map((product) => <ProductCard product={product} key={product.id} />)}</div> : <div className="rounded-[20px] border border-dashed border-[hsl(var(--border))] p-10 text-center text-sm text-[hsl(var(--muted-foreground))]" data-testid="empty-featured">Your weekly picks are being refreshed. Browse the full shop to find your staples.</div>}
        <Link href="/shop" className="mt-5 flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--border))] py-3 text-sm font-bold text-[hsl(var(--primary))] sm:hidden" data-testid="link-mobile-featured-shop">See the full shelf <ArrowRight className="h-4 w-4" /></Link>
      </section>

      <section id="how-it-works" className="bg-[hsl(var(--secondary)/.55)] py-14 md:py-20">
        <div className="fc-shell">
          <div className="mb-8 max-w-xl"><p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--accent))]">The FreshCart rhythm</p><h2 className="fc-display text-3xl font-bold text-[hsl(var(--foreground))] sm:text-5xl">A better grocery run is three clicks away.</h2></div>
          <div className="grid gap-3 md:grid-cols-3">
            {[{ icon: MapPin, title: 'Tell us your staples', text: 'Search by the things your home actually runs out of. No aisle maze required.' }, { icon: Check, title: 'Build your basket', text: 'Add, adjust, and keep your everyday list ready for the next run.' }, { icon: Clock3, title: 'We bring the good stuff', text: `Your order arrives ${info?.deliveryWindow ?? 'in a neat, dependable window'}.` }].map(({ icon: Icon, title, text }, index) => <div key={title} className="relative rounded-[22px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"><span className="mb-7 grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><Icon className="h-5 w-5" /></span><span className="absolute right-6 top-6 text-4xl font-black text-[hsl(var(--muted))]">0{index + 1}</span><h3 className="text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="fc-shell py-14 md:py-20" data-testid="section-promise">
        <div className="grid items-center gap-8 md:grid-cols-[.8fr_1.2fr]">
          <div className="relative min-h-[220px] overflow-hidden rounded-[26px] bg-[hsl(var(--accent))] p-7">
            <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[hsl(var(--primary)/.22)]" /><div className="absolute -bottom-20 left-4 h-48 w-48 rounded-full border-[28px] border-[hsl(var(--background)/.26)]" />
            <ShieldCheck className="relative h-9 w-9 text-[hsl(var(--foreground))]" /><p className="relative mt-12 max-w-[210px] text-xl font-black leading-tight text-[hsl(var(--foreground))]">The little things are our big thing.</p>
          </div>
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--accent))]">Why neighbours come back</p><h2 className="fc-display text-3xl font-bold sm:text-5xl">Your kitchen has a memory. So do we.</h2><p className="mt-5 max-w-xl text-base leading-7 text-[hsl(var(--muted-foreground))]">FreshCart is built around repeat runs, not endless browsing. Familiar brands, fresh picks, and a basket that feels easy from the first tap.</p><div className="mt-7 flex flex-wrap gap-2 text-sm font-bold"><span className="rounded-full bg-[hsl(var(--secondary))] px-3 py-2">Freshness checked</span><span className="rounded-full bg-[hsl(var(--secondary))] px-3 py-2">Honest prices</span><span className="rounded-full bg-[hsl(var(--secondary))] px-3 py-2">Easy repeat runs</span></div></div>
        </div>
      </section>
    </main>
  );
}