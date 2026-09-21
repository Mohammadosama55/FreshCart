import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@workspace/api-client-react';

type CartMap = Record<string, number>;

type CartContextValue = {
  cart: CartMap;
  count: number;
  add: (productId: string) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  quantityFor: (productId: string) => number;
  linesFor: (products: Product[]) => { product: Product; quantity: number }[];
};

const CART_KEY = 'freshcart-cart-v1';
const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) as CartMap : {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartMap>(readCart);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const value = useMemo<CartContextValue>(() => {
    const update = (productId: string, delta: number) => {
      setCart((current) => {
        const next = { ...current };
        const quantity = Math.max(0, (next[productId] ?? 0) + delta);
        if (quantity === 0) delete next[productId];
        else next[productId] = quantity;
        return next;
      });
    };
    return {
      cart,
      count: Object.values(cart).reduce((total, quantity) => total + quantity, 0),
      add: (productId) => update(productId, 1),
      decrement: (productId) => update(productId, -1),
      remove: (productId) => setCart((current) => {
        const next = { ...current };
        delete next[productId];
        return next;
      }),
      clear: () => setCart({}),
      quantityFor: (productId) => cart[productId] ?? 0,
      linesFor: (products) => products
        .filter((product) => Boolean(cart[product.id]))
        .map((product) => ({ product, quantity: cart[product.id] })),
    };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}