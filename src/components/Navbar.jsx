import NavbarContainer from "./NavbarC";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

const getProducts = async () => {
  const res = await fetch(`${baseUrl}/api/shopify/cart-slider`, { 
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