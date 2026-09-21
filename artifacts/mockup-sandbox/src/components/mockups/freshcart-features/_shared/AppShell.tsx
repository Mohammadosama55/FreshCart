import { ChevronDown, MapPin, Search, ShoppingBasket, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import "../_group.css";

type ShellProps = {
  children: ReactNode;
  cartCount?: number;
  active?: "Shop" | "Orders" | "Account";
  title?: string;
  subtitle?: string;
};

export function FreshCartShell({ children, cartCount = 3, active = "Shop", title, subtitle }: ShellProps) {
  return (
    <div className="freshcart-ui">
      <div className="border-b border-[#eadfce] bg-[#f8eedf] px-4 py-2 text-center text-[11px] font-semibold tracking-[.14em] text-[#5b6e62]">
        FREE DELIVERY ON ORDERS ABOVE ₹499 <span className="mx-2 text-[#d96f54]">/</span> TODAY, BEFORE 7:30 PM
      </div>
      <header className="sticky top-0 z-20 border-b border-[#eadfce]/90 bg-[#fffaf1]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] items-center gap-5 px-4 py-4 sm:px-7">
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#1f7358] text-[#fffaf1] shadow-[4px_4px_0_#e9a13b]">
              <ShoppingBasket size={21} strokeWidth={2.1} />
            </div>
            <div className="leading-none">
              <div className="freshcart-display text-[23px] font-bold text-[#1f7358]">FreshCart</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[.18em] text-[#c2773e]">Good food, close by</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[#eadfce] bg-[#fffdf8] px-3 py-2 text-xs sm:flex">
            <MapPin size={14} className="text-[#d96f54]" />
            <span className="max-w-[136px] truncate font-semibold">HSR Layout, Bengaluru</span>
            <ChevronDown size={13} className="text-[#6d7c73]" />
          </div>
          <div className="hidden min-w-0 flex-1 sm:block">
            <div className="flex items-center gap-2 rounded-full border border-[#eadfce] bg-[#fffdf8] px-4 py-2.5 text-sm text-[#8a968d]">
              <Search size={16} />
              <span>Search for atta, apples, masala...</span>
              <span className="ml-auto rounded-md bg-[#f3ebdf] px-2 py-0.5 text-[10px] font-bold text-[#9b8871]">⌘ K</span>
            </div>
          </div>
          <nav className="ml-auto flex items-center gap-1 text-sm font-semibold">
            {(["Shop", "Orders", "Account"] as const).map((item) => (
              <button key={item} className={`hidden rounded-full px-3 py-2 transition sm:block ${active === item ? "bg-[#e6f0e8] text-[#1f7358]" : "text-[#708078] hover:bg-[#f3ebdf]"}`}>
                {item}
              </button>
            ))}
            <button aria-label="Account" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5e4c8] text-[#7c5735]">
              <UserRound size={17} />
            </button>
            <button aria-label={`Cart with ${cartCount} items`} className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#1f7358] text-[#fffaf1]">
              <ShoppingBasket size={17} />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#fffaf1] bg-[#d96f54] px-1 text-[9px] font-bold">{cartCount}</span>
            </button>
          </nav>
        </div>
        <div className="mx-auto flex max-w-[1180px] items-center gap-2 px-4 pb-3 sm:hidden">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[#eadfce] bg-[#fffdf8] px-3 py-2 text-sm text-[#8a968d]">
            <Search size={15} /><span className="truncate">Search groceries...</span>
          </div>
          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#eadfce] bg-[#fffdf8] text-[#d96f54]" aria-label="Choose delivery location"><MapPin size={16} /></button>
        </div>
      </header>
      {title && (
        <div className="mx-auto max-w-[1180px] px-4 pb-2 pt-7 sm:px-7">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#d96f54]">FreshCart / {active}</p>
          <h1 className="freshcart-display mt-2 text-3xl font-bold text-[#203b31] sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-[#6d7c73]">{subtitle}</p>}
        </div>
      )}
      {children}
      <footer className="mt-10 border-t border-[#eadfce] bg-[#f8eedf]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-4 py-6 text-xs text-[#6d7c73] sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <span className="font-semibold text-[#1f7358]">FreshCart · Bengaluru's neighborhood pantry</span>
          <span>Support 080 4682 2200 · 7am–11pm every day</span>
        </div>
      </footer>
    </div>
  );
}

export function Stars({ value, size = 13 }: { value: number; size?: number }) {
  return <span className="inline-flex items-center gap-0.5 text-[#e9a13b]" aria-label={`${value} out of 5 stars`}>{Array.from({ length: 5 }, (_, i) => <span key={i} style={{ fontSize: size }} className={i < Math.round(value) ? "opacity-100" : "opacity-25"}>★</span>)}</span>;
}