import NavbarContainer from "./NavbarContainer";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
const getProducts = async () => {
  const res = await fetch(`http://127.0.0.1:3000/api/new-shopify/storefront/cart-slider`, { 
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch product data');
  return await res.json();
}

export default async function Navbar() {
  const cartSliderData = await getProducts();

  return (
    <NavbarContainer cartSliderData={cartSliderData} />
  )
}