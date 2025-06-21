export const dynamic = 'force-dynamic';

import React from 'react';
import xss from 'xss';
import Product from './components/Product';
import '@/styles/product.css';

const baseUrl = 'https://roastarcoffee.co.uk' || 'http://localhost:3000';

if (!baseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SITE_URL environment variable');
}

const getProduct = async (handle) => {
  const res = await fetch(`${baseUrl}/api/new-shopify/storefront/${handle}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

const getRelatedProducts = async () => {
  const res = await fetch(`${baseUrl}/api/new-shopify/storefront/related-products`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch related products');
  return res.json();
};

export default async function Page({ params }) {
  const { handle } = params;

  let product = null;
  let relatedProducts = null;
  let error = null;

  try {
    product = await getProduct(handle);
    relatedProducts = await getRelatedProducts();
  } catch (err) {
    console.error(err);
    error = err.message || 'An error occurred';
  }

  if (error) return <div className='product-page-background pnf-container'><p>{error}</p></div>; 
  if (!handle) return <div className="product-page-background pnf-container"><p>Invalid product handle.</p></div>;
  if (!product) return <div className='product-page-background pnf-container'>Product Not Found</div>;

  const sanitisedDescription = xss(
    product.descriptionHtml?.replace(/<meta[^>]*>/g, '') || ''
  );

  return (
    <div>
      <Product
        product={product}
        relatedProducts={relatedProducts.products}
        html={sanitisedDescription}
      />
    </div>
  );
}