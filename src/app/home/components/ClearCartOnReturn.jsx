"use client";
import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function ClearCartOnReturn() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const cleared = sessionStorage.getItem("cart-cleared");

    if (!cleared) {
      clearCart();
      sessionStorage.setItem("cart-cleared", "true");
    }
  }, []);

  return null;
}