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