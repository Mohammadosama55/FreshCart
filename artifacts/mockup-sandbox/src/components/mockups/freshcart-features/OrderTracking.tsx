import { useState } from "react";
import { Check, ChevronRight, Clock3, Headphones, MapPin, Package, Phone, Route, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FreshCartShell } from "./_shared/AppShell";
import { addresses, formatINR } from "./_shared/data";

const stages = [
  { label: "Order placed", time: "10:42 am", icon: ShoppingBag, note: "We received your basket" },
  { label: "Packing", time: "10:48 am", icon: Package, note: "Your shopper is selecting the freshest picks" },
  { label: "Out for delivery", time: "11:12 am", icon: Truck, note: "Ravi is on the way to you" },
  { label: "Delivered", time: "Expected 11:35 am", icon: Check, note: "Handed over at your doorstep" },
];

export function OrderTracking() {
  const [activeStage, setActiveStage] = useState(2);
  const [notified, setNotified] = useState(false);
  return <FreshCartShell active="Orders" title="Your basket is on its way." subtitle="Order #FC-49120 · Placed today at 10:42 am">
    <main className="mx-auto max-w-[1180px] px-4 pb-5 pt-6 sm:px-7">
      <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-5">
          <Card className="freshcart-shadow overflow-hidden rounded-[24px] border-[#eadfce] bg-[#fffdf8]">
            <div className="border-b border-[#eee5d8] bg-[#edf3ec] px-5 py-4 sm:px-6"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#578167]">Arriving today</p><h2 className="mt-1 text-lg font-semibold text-[#1f7358]">11:25 – 11:45 am</h2></div><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f7358] text-[#fffaf1]"><Truck size={22} /></div></div></div>
            <CardContent className="p-5 sm:p-6"><div className="relative">
              <div className="absolute left-[17px] top-5 h-[calc(100%-40px)] w-0.5 bg-[#e4daca]" /><div className="absolute left-[17px] top-5 h-[calc(66%-20px)] w-0.5 bg-[#1f7358] transition-all" />
              <div className="space-y-7">{stages.map((stage, index) => { const Icon = stage.icon; const done = index < activeStage; const current = index === activeStage; return <button key={stage.label} onClick={() => setActiveStage(index)} className="relative flex w-full items-start gap-4 text-left"><div className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-4 border-[#fffdf8] transition ${done || current ? "bg-[#1f7358] text-white" : "bg-[#e9dfd0] text-[#9d9e91]"}`}>{done ? <Check size={15} strokeWidth={3} /> : <Icon size={15} />}</div><div className="min-w-0 flex-1 pt-1"><div className="flex items-center justify-between gap-2"><p className={`text-sm font-semibold ${current ? "text-[#1f7358]" : done ? "text-[#203b31]" : "text-[#8d968e]"}`}>{stage.label}{current && <span className="ml-2 rounded-full bg-[#fff1cf] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#9b6d34]">Live</span>}</p><span className={`text-[11px] ${current ? "font-bold text-[#d96f54]" : "text-[#9c9d92]"}`}>{stage.time}</span></div><p className={`mt-1 text-xs ${current ? "text-[#687970]" : "text-[#9b9f95]"}`}>{current ? stage.note : index < activeStage ? "Completed" : "We'll update you here"}</p></div></button>; })}</div>
            </div><div className="mt-7 flex items-center gap-3 rounded-2xl border border-dashed border-[#d7c8b5] bg-[#fffaf1] p-3.5"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5e4c8] text-[#c2773e]"><Route size={15} /></div><div className="flex-1"><p className="text-xs font-semibold">Tap a stage to preview the handoff</p><p className="mt-0.5 text-[11px] text-[#829087]">Your delivery updates appear here in real time.</p></div></div></CardContent>
          </Card>
          <Card className="rounded-[22px] border-[#eadfce] bg-[#fffdf8]"><CardContent className="p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#a68a6a]">Your delivery partner</p><div className="mt-2 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2c477] text-sm font-bold text-[#7b5735]">RS</div><div><p className="font-semibold">Ravi Shetty</p><p className="text-xs text-[#6d7c73]">FreshCart shopper · 4.9 rating</p></div></div></div><Button variant="outline" size="sm" className="rounded-full border-[#d7c8b5] text-[#1f7358]"><Phone size={14} className="mr-1.5" /> Call</Button></div><div className="mt-5 flex items-start gap-3 border-t border-[#eee5d8] pt-4"><MapPin size={16} className="mt-0.5 shrink-0 text-[#d96f54]" /><div><p className="text-xs font-semibold">Delivering to {addresses[0].label}</p><p className="mt-1 text-xs leading-5 text-[#77847c]">{addresses[0].lines}</p></div><button className="ml-auto text-xs font-semibold text-[#1f7358]">Change</button></div></CardContent></Card>
        </div>
        <div className="space-y-5">
          <Card className="rounded-[22px] border-[#eadfce] bg-[#fffdf8]"><CardContent className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Order summary</h2><span className="rounded-full bg-[#e5f0e7] px-2.5 py-1 text-[10px] font-bold text-[#1f7358]">8 items</span></div><div className="mt-4 space-y-3 text-sm"><div className="flex justify-between text-[#6d7c73]"><span>Basket subtotal</span><span>{formatINR(728)}</span></div><div className="flex justify-between text-[#6d7c73]"><span>FreshCart delivery</span><span className="text-[#1f7358]">Free</span></div><div className="flex justify-between text-[#6d7c73]"><span>Member savings</span><span className="text-[#d96f54]">− ₹64</span></div><div className="border-t border-[#eee5d8] pt-3"><div className="flex justify-between font-bold"><span>Total paid</span><span className="text-[#1f7358]">{formatINR(664)}</span></div></div></div><button className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#f8f0e4] px-3 py-3 text-xs font-semibold"><span>View 8 items</span><ChevronRight size={15} className="text-[#1f7358]" /></button></CardContent></Card>
          <div className="rounded-[22px] bg-[#1f7358] p-5 text-[#fffaf1]"><div className="flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffffff1c]"><Headphones size={17} /></div><div><p className="font-semibold">Need a hand?</p><p className="mt-1 text-xs leading-5 text-[#cfe7d6]">Our support team is one tap away, even after delivery.</p><Button onClick={() => setNotified(true)} variant="outline" className="mt-4 rounded-full border-[#ffffff45] bg-transparent text-xs text-[#fffaf1] hover:bg-[#ffffff14]">{notified ? <><Check size={14} className="mr-1" /> We'll call you shortly</> : "Contact support"}</Button></div></div></div>
          <div className="rounded-[22px] border border-[#eadfce] bg-[#f8eedf] p-5"><div className="flex items-center gap-2 text-[#a26e39]"><Clock3 size={16} /><span className="text-xs font-bold uppercase tracking-wider">Live updates</span></div><p className="mt-2 text-sm leading-5 text-[#687970]">We will send a notification when Ravi is two minutes away. Keep your phone close.</p><button onClick={() => setNotified(!notified)} className="mt-3 text-xs font-semibold text-[#1f7358]">{notified ? "Notifications on" : "Turn on delivery notifications"} <ChevronRight className="inline" size={13} /></button></div>
        </div>
      </div>
    </main>
  </FreshCartShell>;
}