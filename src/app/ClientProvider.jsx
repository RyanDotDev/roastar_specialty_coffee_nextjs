"use client"
import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme/theme.js';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { setInitialCartState, loadCartFromLocalStorage } from '@/store/state.js';
import Navbar from '@/components/Navbar.jsx';
import Footer from '@/components/Footer.jsx';
import Maintenance from '@/components/Maintenance.jsx';
import './globals.css';

const store = configureStore({
  reducer: { cart: cartReducer },
});

export default function ClientProvider({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load the cart from localStorage on the client side
      const initialCart = loadCartFromLocalStorage();
      store.dispatch(setInitialCartState(initialCart));
    }
  }, []); // Runs once after mounting
  
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <header><Navbar /></header>
        <Maintenance />
        <main>{children}</main>
        <footer><Footer /></footer>
      </ThemeProvider>
    </Provider>
  )
}