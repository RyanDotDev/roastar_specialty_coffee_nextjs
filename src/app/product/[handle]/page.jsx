import React from 'react';
import xss from 'xss';
import ProductPage from './components/ProductPage';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

const getProduct = async (handle) => {
  const res = await fetch(`${baseUrl}/api/shopify/${handle}`, {
    cache: 'no-cache',
  });
  if (!res.ok) throw new Error('Failed to fetch product');

  return res.json();
};

const getRelatedProducts = async () => {
  const res = await fetch(`${baseUrl}/api/shopify/related-products`, {
    cache: 'no-cache',
  });
  if (!res.ok) throw new Error('Failed to fetch related products');

  return res.json();
}

export default async function Page({ params }) {
  const { handle } = await params;
  
  let product = null;
  let relatedProducts = null;
  let error = null;

  try {
    product = await getProduct(handle);
    relatedProducts = await getRelatedProducts();
  } catch(err) {
    console.error(err);
    error = err.message || 'An error occured';
  }

  const sanitisedDescription = xss(product.descriptionHtml);

  /* if (loading) return <div className='pnf-container'/>; */
  if (error) return <div className='pnf-container'><p>{error}</p></div>; 
  if (!handle) return <div className="pnf-container"><p>Invalid product handle.</p></div>;
  if (!product) return <div className='pnf-container'/>

  return (
    <div>
      <ProductPage 
        product={product}
        relatedProducts={relatedProducts.products}
        html={sanitisedDescription}
      />
    </div>
  )
}