export const dynamic = 'force-dynamic';

import React from 'react';
import xss from 'xss';
import Product from './components/Product';
import { fetchProduct } from '@/lib/api/shopify/storefront/[handle]';
import { fetchRelatedProducts } from '@/lib/api/shopify/storefront/related-products';
import '@/styles/product.css';

const getProduct = async (handle) => {
  return await fetchProduct(handle);
};

const getRelatedProducts = async () => {
  return await fetchRelatedProducts();
};

export default async function Page({ params }) {
  const { handle } = await params;

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
        relatedProducts={relatedProducts}
        html={sanitisedDescription}
      />
    </div>
  );
}