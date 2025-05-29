import React from 'react';
import Image from 'next/image';

const FeaturedShop = () => {
  return (
    <div className='fs-container'>
      <div className='fs-content'>
        <div className='fs-text'>
          <h3>CHECK OUT OUR STORE</h3>
          <p>Check out our store to find our finest Vietnamese coffee beans you can purchase for yourself.</p>
          <h4>COMING SOON</h4>
        </div>
        <div className='fs-image'>
          <Image 
            src='/images/roastar_products.webp'
            alt="Roastar Product Ad Image"
            height={600}
            width={700}
            loading='lazy'
          />
        </div>
      </div>
    </div>
  )
}

export default FeaturedShop