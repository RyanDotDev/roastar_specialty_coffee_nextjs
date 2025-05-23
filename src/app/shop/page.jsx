export const dynamic = 'force-dynamic';

import React from 'react';
/* import Header from './components/Header'; */
/* import Products from './components/Products'; */
import '@/styles/shop.css';
import ShopMaintenance from './components/ShopMaintenance';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const getProducts = async () => {
  const res = await fetch(`${baseUrl}/api/shopify/products`, {
    cache: 'no-cache',
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
}

export default async function Page() {
  let products = null;
  let error =  null;

  try {
    const data = await getProducts();
    products = data.products || [];
  } catch(err) {
    console.error(err);
    error = err.message || "An error occured";
  }

  return (
    <div className='shop-container'>
      <ShopMaintenance />
      {/*<Header />
      <Products 
        products={products}
        error={error}
      />*/}
    </div>
  )
}

/* This line is to get rid of that stupid "searchParams" error */
/*const searchParams = await props.searchParams; */

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