// Code below will help access and update global state and store from anywhere in the application
import { createSlice } from '@reduxjs/toolkit';

// Retrieve the initial state from localStorage, or use an empty array if none exists
export const loadCartFromLocalStorage = () => {
  if (typeof window !== "undefined" && localStorage) {
    console.log("LocalStorage available, loading cart...");
    const savedCart = localStorage.getItem("cart");
    console.log("Loaded from localStorage:", savedCart);
    return savedCart ? JSON.parse(savedCart) : [];
  }
  console.log("LocalStorage not available, returning empty cart...");
  return []; // Default empty cart if not in browser
};

export const saveCartToLocalStorage = (cart) => {
  console.log("Saving to localStorage:", [...cart]); // Debug the saved data
  if (typeof window !== "undefined" && localStorage) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

// This function is for changing items to equal what is being passed into when there is setItems
export const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromLocalStorage(),
  reducers: {
    addToCart: (state, action) => {
      console.log("Adding to cart:", action.payload);
      const existingItem = state.find(
        (item) => item.id === action.payload.id && item.variant === action.payload.variant
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.push({
          ...action.payload, // Ensures everything is pushed to cart, including handle
        });
      }
      console.log("Cart state after adding:", [...state]);
      saveCartToLocalStorage(state); // Saves updated cart to localStorage
    },

    removeFromCart: (state, action) => {
      console.log("Removed from cart:", action.payload)
      const updatedCart = state.filter((item) => item.id !== action.payload);
      console.log("Updated cart after removal:", [...updatedCart])
      saveCartToLocalStorage(updatedCart); // Save updated cart to localStorage
      return updatedCart;
    },
    
    clearCart: () => {
      console.log("cart cleared!")
      saveCartToLocalStorage([]); // Clears cart in localStorage
      return [];
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      saveCartToLocalStorage(state);
    }
  },
});

if (typeof window !== "undefined") {
  console.log("Running in the browser!");
} else {
  console.log("Running in a server-like environment.");
}

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;