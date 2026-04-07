'use client';

import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, CartState, CartAction } from '@/types/cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.productId !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map(i =>
          i.productId === action.payload.productId
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const parsed = JSON.parse(saved) as CartState;
      parsed.items.forEach((item) => dispatch({ type: 'ADD_ITEM', payload: item }));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('cart', JSON.stringify(state));
  }, [state, mounted]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
        removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
        updateQuantity: (id, qty) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: id, quantity: qty } }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
