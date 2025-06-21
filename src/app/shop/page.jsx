export const dynamic = 'force-dynamic';

import React from 'react';
// import Header from './components/Header';
// import Products from './components/Products';
import ShopMaintenance from './components/ShopMaintenance';
import '@/styles/shop.css';

// const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

/* const getProducts = async () => {
  const res = await fetch(`${baseUrl}/api/new-shopify/storefront/products?nocache=${Date.now()}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
}; */

export default async function Page() {
 /* let products = null;
  let error = null;

  try {
    const data = await getProducts();
    products = data.products || [];
  } catch (err) {
    console.error(err);
    error = err.message || "An error occurred";
  }*/

  return (
    <div className='shop-container'>
      <ShopMaintenance />
      {/*<Header />
      <Products 
        products={products}
        error={error}
      /> */}
    </div>
  );
}