export const dynamic = 'force-dynamic';

import NavbarContainer from "./NavbarContainer";
import { fetchCartSliderProducts } from "@/lib/api/shopify/storefront/cart-slider";

const getCartSliderData = async () => {
  return await fetchCartSliderProducts();
}

export default async function Navbar() {
  let sliderProducts = null
  let error = null

  try {
    const data = await getCartSliderData();
    sliderProducts = data || [];
  } catch (err) {
    console.error(err);
    error = err.message || "An error occurred";
  }

  return (
    <NavbarContainer 
      sliderProducts={sliderProducts} 
      error={error}
    />
  )
}

/* const getProducts = async () => {
  const res = await fetch(`http://127.0.0.1:3000/api/new-shopify/storefront/cart-slider`, { 
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch product data');
  return await res.json();
} */