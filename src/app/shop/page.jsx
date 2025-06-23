export const dynamic = 'force-dynamic';

import Header from './components/Header';
import React from 'react';
import Products from './components/Products';
import ShopMaintenance from './components/ShopMaintenance';
import { fetchProducts } from '@/lib/api/shopify/storefront/products';
import '@/styles/shop.css';

const getProducts = async () => {
  const products = await fetchProducts();
  return { products };
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
    error = err.message || "Sorry, an error occurred!";
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