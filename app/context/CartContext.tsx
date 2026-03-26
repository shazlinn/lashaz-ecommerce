// app/context/CartContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Unified Initial Load: Database or LocalStorage
  useEffect(() => {
    const loadCart = async () => {
      // Priority 1: Fetch from DB if logged in
      if (session) {
        try {
          const res = await fetch('/api/cart/get');
          if (res.ok) {
            const dbCart = await res.json();
            setCart(dbCart);
            setIsLoaded(true);
            return; // Exit early if DB cart is found
          }
        } catch (err) {
          console.error("Failed to fetch DB cart", err);
        }
      }

      // Priority 2: Fallback to LocalStorage for guests
      const localData = localStorage.getItem('lashaz_cart');
      if (localData) {
        try {
          setCart(JSON.parse(localData));
        } catch (e) {
          console.error("Failed to parse local cart", e);
        }
      } else {
        setCart([]); // Ensure empty state if nothing found
      }
      setIsLoaded(true);
    };

    loadCart();
  }, [session]); // Re-runs correctly on login/logout

  // 2. Sync Guest Cart to LocalStorage
  useEffect(() => {
    if (isLoaded && !session) {
      localStorage.setItem('lashaz_cart', JSON.stringify(cart));
    }
  }, [cart, session, isLoaded]);

  // 3. Sync Guest items to DB on Login
  useEffect(() => {
    const syncCart = async () => {
      const localData = localStorage.getItem('lashaz_cart');
      if (session && localData && cart.length > 0) {
        try {
          const res = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ localItems: cart }),
          });
          
          if (res.ok) {
            localStorage.removeItem('lashaz_cart');
            // After sync, re-fetch the merged cart from the DB
            const refreshRes = await fetch('/api/cart/get');
            if (refreshRes.ok) {
              const updatedCart = await refreshRes.json();
              setCart(updatedCart);
            }
          }
        } catch (err) {
          console.error("Cart sync failed", err);
        }
      }
    };
    if (isLoaded) syncCart();
  }, [session, isLoaded]);

  // ... (addToCart, removeFromCart, updateQuantity remain the same)
  const addToCart = async (product: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    if (session) {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.productId, quantity: 1 }),
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    if (session) {
      await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return; 
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
    if (session) {
      await fetch('/api/cart/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);