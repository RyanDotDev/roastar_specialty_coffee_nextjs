"use client"
import React, { useEffect } from 'react';
import Image from 'next/image';

const Menu = () => {
  useEffect(() => {
    document.body.style.backgroundColor = 'var(--main-green)';
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [])
  return (
    <div className='menu'>
      <div className='menu-header'>
        <h1>MENU</h1>
      </div>
      <div className='menu-page'>
        <p>Check out our tasty menu.</p>
        <Image
          src="/images/small_bites.webp"
          alt='small bites'
          height={800}
          width={600}
       />
      </div>
    </div>
  )
}

export default Menu