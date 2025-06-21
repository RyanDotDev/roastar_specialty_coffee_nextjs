export const dynamic = 'force-dynamic';

import Header from './components/Header';
import React from 'react';
import Products from './components/Products';
import ShopMaintenance from './components/ShopMaintenance';
import '@/styles/shop.css';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

const getProducts = async () => {
  const res = await fetch(`${baseUrl}/api/new-shopify/storefront/products?nocache=${Date.now()}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
}; 

const SHOP_READY = process.env.SHOP_READY === 'true';

export default async function Page() {
  if (!SHOP_READY) {
    return (
      <div className='shop-container'>
        <ShopMaintenance />
      </div>
    );
  }

  let products = null;
  let error = null;

  try {
    const data = await getProducts();
    products = data.products || [];
  } catch (err) {
    console.error(err);
    error = err.message || "An error occurred";
  }

  return (
    <div className='shop-container'>
      <Header />
      <Products 
        products={products}
        error={error}
      />
    </div>
  );
}