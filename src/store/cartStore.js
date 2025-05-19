import { create } from "zustand";
import { persist } from 'zustand/middleware';

export const useCartStore = create(persist(
  (set, get) => ({
    cart: [],
    
    addToCart: (item) => {
      const existing = get().cart.find(
        (i) => i.id === item.id && i.variant === item.variant
      );
      if (existing) {
        set({
          cart: get().cart.map((i) =>
            i.id === item.id && i.variant === item.variant
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        });
      } else {
        set({ cart: [...get().cart, item] });
      }
    },

    removeFromCart: (id) => set({ 
      cart: get().cart.filter((item) => item.id !== id) 
    }),

    clearCart: () => set({ 
      cart: [] 
    }),

    updateQuantity: (id, variant, quantity) =>
      set({
        cart: get().cart.map((item) =>
          item.id === id && item.variant === variant
            ? { ...item, quantity } 
            : item
        ),
      }),
  }),
  
  {
    name: 'cart-storage',
  }
));