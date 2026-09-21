import { useMemo, useState } from "react";
import { Check, ChevronDown, Filter, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { FreshCartShell, Stars } from "./_shared/AppShell";
import { formatINR, products } from "./_shared/data";

export function ShopFilters() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All groceries");
  const [range, setRange] = useState([0, 450]);
  const [rating, setRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);
  const [cart, setCart] = useState<string[]>([]);
  const categories = ["All groceries", "Fresh produce", "Staples", "Dairy & eggs"];
  const filtered = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) && (category === "All groceries" || p.category === category) && p.price >= range[0] && p.price <= range[1] && p.rating >= rating && (!availableOnly || p.available)), [query, category, range, rating, availableOnly]);
  return <FreshCartShell active="Shop" title="Good groceries, no guesswork." subtitle="Find the everyday essentials and small luxuries your household reaches for.">
    <main className="mx-auto max-w-[1180px] px-4 pb-3 pt-6 sm:px-7">
      <div className="flex flex-col gap-4 rounded-[22px] border border-[#eadfce] bg-[#f8eedf] p-4 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b988f]" size={17} /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tomatoes, atta, paneer..." className="fc-input h-11 rounded-xl border-[#decfbd] bg-[#fffdf8] pl-10 text-sm" aria-label="Search products" />{query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b988f]" aria-label="Clear search"><X size={15} /></button>}</div>
        <div className="flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-[#687970]">{filtered.length} products nearby</span><Button onClick={() => setFilterOpen(!filterOpen)} variant="outline" className="rounded-full border-[#d7c8b5] bg-[#fffdf8] text-[#1f7358] md:hidden"><SlidersHorizontal size={15} className="mr-2" /> Filters</Button></div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className={`${filterOpen ? "block" : "hidden"} rounded-[22px] border border-[#eadfce] bg-[#fffdf8] p-5 md:block`}>
          <div className="flex items-center justify-between"><h2 className="font-semibold">Filter by</h2><button onClick={() => { setCategory("All groceries"); setRange([0, 450]); setRating(0); setAvailableOnly(false); }} className="text-[11px] font-semibold text-[#d96f54]">Reset</button></div>
          <div className="mt-6 space-y-5">
            <div><Label className="text-xs font-bold uppercase tracking-wider text-[#829087]">Category</Label><div className="mt-3 space-y-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${category === item ? "bg-[#e5f0e7] font-semibold text-[#1f7358]" : "text-[#687970] hover:bg-[#f8f0e4]"}`}><span>{item}</span>{category === item && <Check size={14} />}</button>)}</div></div>
            <div className="border-t border-[#eee5d8] pt-5"><div className="flex items-center justify-between"><Label className="text-xs font-bold uppercase tracking-wider text-[#829087]">Price range</Label><span className="text-xs font-semibold text-[#1f7358]">{formatINR(range[0])} – {formatINR(range[1])}</span></div><Slider value={range} onValueChange={setRange} max={450} step={10} className="mt-5" /><div className="mt-2 flex justify-between text-[10px] text-[#9b9f93]"><span>₹0</span><span>₹450+</span></div></div>
            <div className="border-t border-[#eee5d8] pt-5"><Label className="text-xs font-bold uppercase tracking-wider text-[#829087]">Customer rating</Label><div className="mt-3 space-y-2">{[4, 3, 0].map((value) => <button key={value} onClick={() => setRating(value)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs ${rating === value ? "bg-[#fff3dc] font-semibold" : "text-[#687970]"}`}><span className="flex items-center gap-0.5 text-[#e9a13b]"><Star size={12} fill="currentColor" /><span>{value === 0 ? "All ratings" : `${value}.0 & up`}</span></span>{rating === value && <Check className="ml-auto text-[#d96f54]" size={13} />}</button>)}</div></div>
            <div className="flex items-center justify-between border-t border-[#eee5d8] pt-5"><div><Label htmlFor="stock" className="text-sm font-semibold">In stock only</Label><p className="mt-1 text-[11px] text-[#89948b]">Skip today's sold-outs</p></div><Switch id="stock" checked={availableOnly} onCheckedChange={setAvailableOnly} /></div>
          </div>
        </aside>
        <section>
          <div className="mb-4 flex items-center justify-between"><p className="text-sm text-[#6d7c73]">{query ? <>Showing results for <strong className="text-[#203b31]">“{query}”</strong></> : "Popular around HSR Layout"}</p><button className="flex items-center gap-1 text-xs font-semibold text-[#687970]">Sort: Recommended <ChevronDown size={14} /></button></div>
          {filtered.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <div key={product.id} className="freshcart-shadow group rounded-[20px] border border-[#eadfce] bg-[#fffdf8] p-3 transition hover:-translate-y-1">
            <div className="relative overflow-hidden rounded-[15px] bg-[#f4ecdf]"><img src={product.image} alt={product.name} className="h-36 w-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-105" /><Badge className={`absolute left-2 top-2 border-0 text-[9px] ${product.available ? "bg-[#fff4da] text-[#93652f]" : "bg-[#f5ddd6] text-[#a45846]"}`}>{product.available ? product.badge : "Back tomorrow"}</Badge></div>
            <div className="px-1 pb-1 pt-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#a68a6a]">{product.category}</p><h3 className="mt-1 min-h-[40px] text-sm font-semibold leading-5">{product.name}</h3><div className="mt-2 flex items-center gap-1"><Stars value={product.rating} size={11} /><span className="text-[10px] text-[#8b968d]">{product.rating} ({product.reviews})</span></div><div className="mt-3 flex items-center justify-between"><div><span className="text-base font-bold">{formatINR(product.price)}</span><span className="ml-1 text-[11px] text-[#8b968d]">/ {product.unit}</span></div><Button disabled={!product.available} onClick={() => setCart([...cart, product.id])} size="sm" className={`h-8 rounded-full px-3 text-xs ${cart.includes(product.id) ? "bg-[#e5f0e7] text-[#1f7358] hover:bg-[#e5f0e7]" : "bg-[#1f7358] text-[#fffaf1] hover:bg-[#185540]"}`}>{cart.includes(product.id) ? "Added" : product.available ? "Add" : "Notify me"}</Button></div></div>
          </div>)}</div> : <div className="rounded-[22px] border border-dashed border-[#d7c8b5] bg-[#fffdf8] px-6 py-16 text-center"><Filter className="mx-auto text-[#d6c5b0]" size={26} /><h3 className="mt-4 font-semibold">Nothing in this aisle yet</h3><p className="mt-1 text-sm text-[#77847c]">Try widening your price range or clearing a filter.</p><Button onClick={() => { setQuery(""); setCategory("All groceries"); setRange([0,450]); setRating(0); setAvailableOnly(false); }} variant="outline" className="mt-5 rounded-full border-[#d7c8b5]">Clear all filters</Button></div>}
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#d8e7d9] bg-[#edf5ee] px-4 py-3 text-xs text-[#577062]"><Check size={15} className="text-[#1f7358]" /> Every order is picked by a local shopper, not pulled from a warehouse.</div>
        </section>
      </div>
    </main>
  </FreshCartShell>;
}