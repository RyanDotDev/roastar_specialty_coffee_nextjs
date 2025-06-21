export const dynamic = 'force-dynamic';

import React from 'react';
import xss from 'xss';
import Product from './components/Product';
import { headers } from 'next/headers';
import '@/styles/product.css';

const getBaseUrl = () => {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  return `${protocol}://${host}`;
};

const getProduct = async (handle) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/new-shopify/storefront/${handle}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

const getRelatedProducts = async () => {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

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