import { useMemo, useState, type FormEvent } from 'react';
import { ArrowDownUp, Search, SlidersHorizontal, X } from 'lucide-react';
import { getListCategoriesQueryKey, getListProductsQueryKey, useListCategories, useListProducts } from '@workspace/api-client-react';
import { CategoryStrip } from '@/components/category-strip';
import { ProductCard, ProductSkeleton } from '@/components/product-card';
import { useLocation } from 'wouter';

export default function Shop() {
  const [location, setLocation] = useLocation();
  const params = useMemo(() => {
    const query = new URLSearchParams(location.split('?')[1] ?? '');
    return { search: query.get('search') ?? '', category: query.get('category') ?? '' };
  }, [location]);
  const [search, setSearch] = useState(params.search);
  const [sort, setSort] = useState<'featured' | 'low' | 'high'>('featured');
  const categories = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const products = useListProducts({ search: params.search || undefined, category: params.category || undefined }, { query: { queryKey: getListProductsQueryKey({ search: params.search || undefined, category: params.category || undefined }) } });
  const sortedProducts = useMemo(() => {
    const items = [...(products.data ?? [])];
    if (sort === 'low') return items.sort((a, b) => a.price - b.price);
    if (sort === 'high') return items.sort((a, b) => b.price - a.price);
    return items.sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [products.data, sort]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocation(`/shop${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''}`);
  };
  const clearFilters = () => { setSearch(''); setLocation('/shop'); };

  return (
    <main className="fc-shell py-8 md:py-12">
      <section className="rounded-[28px] bg-[hsl(var(--secondary))] px-6 py-9 sm:px-10 md:py-12">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.17em] text-[hsl(var(--accent))]">The full shelf</p>
        <h1 className="fc-display text-4xl font-bold sm:text-6xl" data-testid="heading-shop">Everything your kitchen calls for.</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">From first chai to last-minute dinner, find the everyday essentials without the supermarket wander.</p>
      </section>
      <div className="mt-8 grid gap-8 lg:grid-cols-[210px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[hsl(var(--muted-foreground))]">Browse shelves</p>
            <div className="space-y-1">
              <button onClick={() => setLocation('/shop')} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-bold ${!params.category ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'hover:bg-[hsl(var(--secondary))]'}`} data-testid="button-filter-all">All groceries <span>{products.data?.length ?? '—'}</span></button>
              {(categories.data ?? []).map((category) => <button key={category.id} onClick={() => setLocation(`/shop?category=${encodeURIComponent(category.id)}`)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-bold ${params.category === category.id ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'hover:bg-[hsl(var(--secondary))]'}`} data-testid={`button-filter-${category.id}`}>{category.name}<span>{category.count}</span></button>)}
            </div>
          </div>
        </aside>
        <div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <form onSubmit={submitSearch} className="relative flex-1" data-testid="form-shop-search">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the shelf..." className="h-12 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-11 pr-4 text-sm font-medium outline-none focus:border-[hsl(var(--accent))] focus:ring-4 focus:ring-[hsl(var(--accent)/.12)]" data-testid="input-shop-search" />
            </form>
            <label className="relative flex h-12 items-center gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 text-sm font-bold"><ArrowDownUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" /><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="appearance-none bg-transparent pr-5 outline-none" data-testid="select-sort"><option value="featured">Picked first</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
          </div>
          {(params.search || params.category) && <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-sm text-[hsl(var(--muted-foreground))]">Showing {params.search ? `“${params.search}”` : 'shelf'}{params.category ? ` in ${params.category}` : ''}</span><button onClick={clearFilters} className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--secondary))] px-3 py-1 text-xs font-bold" data-testid="button-clear-filters">Clear <X className="h-3 w-3" /></button></div>}
          <div className="mt-7 flex items-center justify-between"><p className="text-sm font-bold text-[hsl(var(--muted-foreground))]" data-testid="text-result-count">{products.isLoading ? 'Finding your groceries…' : `${sortedProducts.length} essentials to choose from`}</p><span className="inline-flex items-center gap-1 text-xs font-bold text-[hsl(var(--muted-foreground))] lg:hidden"><SlidersHorizontal className="h-3.5 w-3.5" /> Use search to narrow</span></div>
          {products.isError ? <div className="mt-5 rounded-[20px] border border-[hsl(var(--accent)/.35)] bg-[hsl(var(--accent)/.1)] p-8 text-center" data-testid="error-shop"><p className="font-bold">The shelf took a quick break.</p><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Please try your search again in a moment.</p><button onClick={() => products.refetch()} className="mt-4 rounded-full bg-[hsl(var(--primary))] px-4 py-2 text-sm font-bold text-[hsl(var(--primary-foreground))]" data-testid="button-retry-shop">Try again</button></div> : products.isLoading ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <ProductSkeleton key={item} />)}</div> : sortedProducts.length > 0 ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{sortedProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="mt-5 rounded-[22px] border border-dashed border-[hsl(var(--border))] p-12 text-center" data-testid="empty-shop"><p className="text-lg font-bold">Nothing on this shelf yet.</p><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Try a broader search or clear the filters.</p><button onClick={clearFilters} className="mt-5 rounded-full bg-[hsl(var(--primary))] px-5 py-2.5 text-sm font-bold text-[hsl(var(--primary-foreground))]" data-testid="button-empty-clear">Show everything</button></div>}
        </div>
      </div>
      {categories.data && categories.data.length > 0 && <div className="mt-3 lg:hidden"><CategoryStrip categories={categories.data} heading="Jump to a shelf" /></div>}
    </main>
  );
}