import React from 'react';
import Image from 'next/image';

const ShopMaintenance = () => {
  return (
    <div className='shop-maintenance-container'>
      <h1>SHOP IS COMING SOON</h1>
      <Image 
        src='/images/roastar_shop_ad.webp'
        alt='Roastar Shop Ad'
        height={700}
        width={1000}
        style={{ height: '1200px', width: '100vw' }}
      />
    </div>
  )
}

export default ShopMaintenance