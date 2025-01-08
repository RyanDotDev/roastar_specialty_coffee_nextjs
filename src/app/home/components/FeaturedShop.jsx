import React from 'react'

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
          <img 
            src='/images/roastar_products.webp'
            width={700}
          />
        </div>
      </div>
    </div>
  )
}

export default FeaturedShop