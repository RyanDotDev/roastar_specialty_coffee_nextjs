import React from 'react';
import Image from 'next/image';

const Poster = () => {
  return (
    <div>
      <Image 
        src='/images/roastar_outside_image.webp'
        alt='Roastar Outside Image'
        height={900}
        width={900}
        loading='lazy'
      />
    </div>
  )
}

export default Poster