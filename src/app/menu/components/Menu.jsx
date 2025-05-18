"use client"
import React, { useEffect } from 'react';
import Image from 'next/image';

const Menu = () => {
  useEffect(() => {
    const originalBackgroundColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'var(--main-green)';
    return () => {
      document.body.style.backgroundColor = originalBackgroundColor;
    };
  }, []);

  return (
    <div className='menu'>
      <div className='menu-header'>
        
      </div>
      <div className='menu-page'>
        <div className='menu-image-container'>
          <Image
            src="/images/coffee_menu.webp"
            alt='Coffee Menu'
            height={800}
            width={600}
            style={{ height: 'auto', width: 'auto' }}
          />
          <Image
            src="/images/food_menu.webp"
            alt='Food Menu'
            height={800}
            width={600}
            style={{ height: 'auto', width: 'auto' }}
           />
        </div>
        <p>For allergens, please contact a member of staff.</p>
      </div>
    </div>
  )
}

export default Menu