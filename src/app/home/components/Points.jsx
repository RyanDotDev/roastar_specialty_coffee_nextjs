import React from 'react';
import Image from 'next/image';

const Points = () => {
  return (
    <div className='points-container'>
      <div className='points-title'>
        <h2>THE TASTE OF VIETNAM AT YOUR DOORSTEP!</h2>
      </div>
      <div className='points-banner'>
        <Image 
          src='/images/roastar_coffee_image.png'
          alt='Roastar Coffee Image'
          width={800}
          height={800}
          style={{ height: 'auto', width: 'auto' }}
          loading='lazy'
        />
      </div>
    </div>
  )
}

export default Points