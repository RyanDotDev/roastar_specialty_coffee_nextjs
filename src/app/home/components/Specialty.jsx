import React from 'react';
import Image from 'next/image';

const Specialty = () => {
  return (
    <div className='specialty-container'>
      <div className='specialty-content'>
        <Image 
          src='/slides/slider-five.webp'
          alt='Roastar Outside Image'
          height={900}
          width={900}
        />
      </div>
    </div>
  )
}

export default Specialty