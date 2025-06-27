import React from 'react';
import Image from 'next/image';

const Specialty = () => {
  return (
    <div className='specialty-container'>
      <div className='specialty-content'>
        <div className='points-title'>
          <h2>THE TASTE OF VIETNAM AT YOUR DOORSTEP!</h2>
        </div>
        <Image 
          src='/images/roastar_outside_image.webp'
          alt='Roastar Outside Image'
          height={900}
          width={900}
          loading='lazy'
        />
      </div>
    </div>
  )
}

export default Specialty