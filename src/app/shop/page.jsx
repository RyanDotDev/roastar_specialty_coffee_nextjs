import React from 'react';
import ShopMaintenance from './components/ShopMaintenance';
import { headers } from 'next/headers';
import '@/styles/shop.css';

const getBaseUrl = () => {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  return `${protocol}://${host}`;
};

const getProducts = async () => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/new-shopify/storefront/products?nocache=${Date.now()}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
};

export default async function Page() {
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
      <ShopMaintenance />
      {/* <Header />
      <Products 
        products={products}
        error={error}
      /> */}
    </div>
  );
}
/* This line is to get rid of that stupid "searchParams" error */
/* const searchParams = await props.searchParams; */

/*
/shop
|  |
|  /components
|    |-Header.jsx
|    |-Loader.jsx
|    |-ProductPreview.jsx
|    |-Products.jsx
|-page.jsx     
*/