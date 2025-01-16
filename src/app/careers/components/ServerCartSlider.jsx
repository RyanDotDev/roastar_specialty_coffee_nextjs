import React from 'react';
import CartSlider from '@/components/CartSlider';

const ServerCartSlider = async () => {
  const response = await fetch('api/shopify/cart-slider');
  const data = await response.json();

  return <CartSlider initialProducts={data.products || []} />
}

export default ServerCartSlider