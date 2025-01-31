import React from 'react';
import Image from 'next/image';

const AboutHeader = () => {
  return (
    <div className='about-us-header'>
      <Image
        src='/images/roastar_aboutus_two.webp'
        loading='eager'
        alt='Roastar About Us'
        width={1440}
        height={400}
        priority
      />
      <h1>OUR STORY</h1>
    </div>
  )
}

export default AboutHeader