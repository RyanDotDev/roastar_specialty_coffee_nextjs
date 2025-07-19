"use client"
import { useEffect } from 'react';
import { nanoid } from 'nanoid';

export default function ResetCartToken() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      localStorage.removeItem('cart');
      localStorage.removeItem('cart-token');

      const newToken = nanoid(40);
      localStorage.setItem('cart-token', newToken)

      console.log('Cart reset, New cart-token:', newToken)
    }
  }, [])

  return null
};
