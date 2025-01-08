"use client"
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme/theme.js';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/state.js'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './globals.css';

const store = configureStore({
  reducer: { cart: cartReducer },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <header><Navbar /></header>
            <main>{children}</main>
            <footo><Footer /></footo>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}