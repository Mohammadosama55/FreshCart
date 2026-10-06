import { Apple, Bean, Coffee, Cookie, Drumstick, Leaf, Milk, Package, Wheat, type LucideIcon } from 'lucide-react';
import { Link } from 'wouter';
import type { Category } from '@workspace/api-client-react';

const iconMap: Record<string, LucideIcon> = { fruits: Apple, vegetables: Leaf, dairy: Milk, staples: Wheat, snacks: Cookie, beverages: Coffee, meat: Drumstick, pantry: Package, pulses: Bean };

export function CategoryStrip({ categories, heading = 'Shop by what you need' }: { categories: Category[]; heading?: string }) {
  return (
    <section className="fc-shell py-12 md:py-16" data-testid="section-categories">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--accent))]">Start here</p><h2 className="fc-display text-3xl font-bold text-[hsl(var(--foreground))] sm:text-4xl">{heading}</h2></div>
        <Link href="/shop" className="hidden items-center gap-1 text-sm font-bold text-[hsl(var(--primary))] sm:flex" data-testid="link-view-all-categories">View all <span aria-hidden="true">→</span></Link>
      </div>
      <div className="fc-scrollbar flex gap-3 overflow-x-auto pb-2">
        {categories.map((category, index) => {
          const Icon = iconMap[category.id.toLowerCase()] ?? [Apple, Leaf, Milk, Wheat, Cookie][index % 5];
          return <Link href={`/shop?category=${encodeURIComponent(category.id)}`} key={category.id} className="group flex min-w-[126px] flex-1 flex-col items-center rounded-[20px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-4 text-center transition-all hover:-translate-y-1 hover:border-[hsl(var(--accent)/.55)] hover:shadow-[0_10px_22px_-16px_hsl(var(--foreground)/.35)]" data-testid={`link-category-${category.id}`}>
            <span className={`mb-3 grid h-14 w-14 place-items-center rounded-[18px] ${index % 3 === 0 ? 'bg-[hsl(var(--secondary))]' : index % 3 === 1 ? 'bg-[hsl(var(--accent)/.18)]' : 'bg-[hsl(var(--primary)/.12)]'} text-[hsl(var(--primary))] transition-transform group-hover:rotate-6`}><Icon className="h-6 w-6" strokeWidth={1.8} /></span>
            <span className="text-sm font-bold text-[hsl(var(--foreground))]">{category.name}</span>
            <span className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">{category.count} essentials</span>
          </Link>;
        })}
      </div>
    </section>
  );
}