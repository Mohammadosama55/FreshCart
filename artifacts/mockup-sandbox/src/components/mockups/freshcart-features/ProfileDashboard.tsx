import { useState } from "react";
import { Check, ChevronRight, Clock3, Home, MapPin, PackageCheck, Pencil, Plus, RotateCcw, ShieldCheck, Star, BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FreshCartShell } from "./_shared/AppShell";
import { addresses, formatINR, orders } from "./_shared/data";

export function ProfileDashboard() {
  const [defaultAddress, setDefaultAddress] = useState("home");
  const [reordered, setReordered] = useState<string | null>(null);
  return (
    <FreshCartShell active="Account" title="Your pantry, your way." subtitle="Manage your addresses, revisit favourites, and keep the weekly shop moving.">
      <main className="mx-auto grid max-w-[1180px] gap-5 px-4 pb-2 pt-6 sm:px-7 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-5">
          <Card className="freshcart-shadow overflow-hidden rounded-[24px] border-[#eadfce] bg-[#1f7358] text-[#fffaf1]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f2c477] text-lg font-bold text-[#1f7358]">AR</div>
                  <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#bde0c9]">Good evening</p><h2 className="freshcart-display mt-1 text-2xl font-bold">Ananya Rao</h2><p className="mt-1 text-sm text-[#d8eee0]">Member since October 2022</p></div>
                </div>
                <button className="rounded-full border border-[#ffffff40] p-2 text-[#d8eee0] hover:bg-[#ffffff14]" aria-label="Edit profile"><Pencil size={15} /></button>
              </div>
              <div className="mt-7 grid grid-cols-3 divide-x divide-[#ffffff2b]">
                <div><p className="text-2xl font-semibold">24</p><p className="mt-1 text-[11px] text-[#bde0c9]">orders placed</p></div>
                <div className="pl-4"><p className="text-2xl font-semibold">₹2,840</p><p className="mt-1 text-[11px] text-[#bde0c9]">saved with deals</p></div>
                <div className="pl-4"><p className="text-2xl font-semibold">4.9</p><p className="mt-1 text-[11px] text-[#bde0c9]">shopper rating</p></div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[22px] border-[#eadfce] bg-[#fffdf8]">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">Saved addresses</h2><p className="mt-1 text-xs text-[#6d7c73]">Choose where today's basket should land.</p></div><Button variant="outline" size="sm" className="rounded-full border-[#d7c8b5] text-[#1f7358]"><Plus size={14} className="mr-1" /> Add new</Button></div>
              <div className="space-y-3">
                {addresses.map((address) => {
                  const selected = address.id === defaultAddress;
                  return <button key={address.id} onClick={() => setDefaultAddress(address.id)} className={`w-full rounded-2xl border p-4 text-left transition ${selected ? "border-[#e9a13b] bg-[#fff6e5] shadow-[0_0_0_2px_#f9dfaf]" : "border-[#eadfce] bg-[#fffdf8] hover:border-[#b9cfbd]"}`} aria-pressed={selected}>
                    <div className="flex items-start gap-3"><div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-[#e9a13b] text-[#fffaf1]" : "bg-[#edf3ec] text-[#1f7358]"}`}>{address.id === "home" ? <Home size={15} /> : <BriefcaseBusiness size={15} />}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="font-semibold">{address.label}</span>{selected && <span className="rounded-full bg-[#e9a13b] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#fffaf1]">Default</span>}</div><p className="mt-1 text-xs leading-5 text-[#687970]">{address.recipient}<br />{address.lines}</p><p className="mt-2 text-[11px] text-[#9a8167]">{address.note}</p></div><div className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-[#e9a13b] bg-[#e9a13b] text-white" : "border-[#cfc4b5]"}`}>{selected && <Check size={13} strokeWidth={3} />}</div></div>
                  </button>;
                })}
              </div>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-[#6d7c73]"><ShieldCheck size={14} className="text-[#1f7358]" /> Your address is only shared with the delivery partner for this order.</div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-5">
          <Card className="rounded-[22px] border-[#eadfce] bg-[#fffdf8]">
            <CardContent className="p-5">
              <div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold">Order history</h2><p className="mt-1 text-xs text-[#6d7c73]">A little memory lane for your pantry.</p></div><button className="flex items-center gap-1 text-xs font-semibold text-[#1f7358]">View all <ChevronRight size={14} /></button></div>
              <div className="space-y-2">
                {orders.map((order, index) => <div key={order.id} className="flex items-center gap-3 rounded-2xl border border-[#eee5d8] p-3.5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${index === 0 ? "bg-[#e4f0e7] text-[#1f7358]" : "bg-[#f8eedf] text-[#bd8753]"}`}><PackageCheck size={18} /></div>
                  <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-sm font-semibold">{order.id}</p><span className="rounded-full bg-[#e4f0e7] px-2 py-0.5 text-[10px] font-semibold text-[#1f7358]">{order.status}</span></div><p className="mt-1 truncate text-xs text-[#77847c]">{order.date} · {order.items} · {formatINR(order.total)}</p></div>
                  <Button onClick={() => setReordered(order.id)} variant="outline" size="sm" className={`shrink-0 rounded-full text-xs ${reordered === order.id ? "border-[#b9cfbd] bg-[#e4f0e7] text-[#1f7358]" : "border-[#d7c8b5] text-[#1f7358]"}`}>{reordered === order.id ? <><Check size={13} className="mr-1" /> Added</> : <><RotateCcw size={13} className="mr-1" /> Reorder</>}</Button>
                </div>)}
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="rounded-[22px] border-[#eadfce] bg-[#fff6e5]"><CardContent className="p-5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e9a13b] text-white"><Clock3 size={17} /></div><p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#96754d]">Next delivery</p><p className="mt-1 font-semibold text-[#203b31]">Saturday, 25 May</p><p className="mt-1 text-xs text-[#7a7467]">7:00 – 9:00 am</p></CardContent></Card>
            <Card className="rounded-[22px] border-[#eadfce] bg-[#edf3ec]"><CardContent className="p-5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f7358] text-white"><Star size={17} /></div><p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#5f7768]">FreshCart credits</p><p className="mt-1 font-semibold text-[#203b31]">₹120 available</p><p className="mt-1 text-xs text-[#657c70]">Expires 30 June 2024</p></CardContent></Card>
          </div>
          <div className="rounded-2xl border border-dashed border-[#d7c8b5] p-4 text-xs text-[#6d7c73]"><div className="flex items-center gap-2 font-semibold text-[#1f7358]"><MapPin size={14} /> Default delivery: {addresses.find((a) => a.id === defaultAddress)?.label}</div><p className="mt-1 pl-5 leading-5">{addresses.find((a) => a.id === defaultAddress)?.lines}</p></div>
        </div>
      </main>
    </FreshCartShell>
  );
}