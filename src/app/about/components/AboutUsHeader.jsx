import React from 'react';
import Image from 'next/image';

const AboutHeader = () => {
  return (
    <div className='about-us-header'>
      <h1>OUR STORY</h1>
      {/* HEADER BACKGROUND */}
      <Image
        src="/images/roastar_aboutus_two.webp"
        alt='Roastar Origin Image' 
        height={400}
        width={400}
        priority
      />
    </div>
  )
}

export default AboutHeader