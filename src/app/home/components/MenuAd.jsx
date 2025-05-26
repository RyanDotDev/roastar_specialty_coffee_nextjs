import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const MenuAd = () => {
  return (
    <div className="menu-container">
      <Image
        src="/images/roastar_menu_image.webp"
        alt='Roastar Menu'
        height={1000}
        width={1440}
        loading='lazy'
      />
      <div className='menu-content'> 
        <div className='menu-text'>
          <h3>OUR MENU</h3>
          <p>
            From our range of whole grain Vietnamese coffee beans to our homemade Bánh Mi sandwiches and baked goods, Our menu
            contains a wide variety of delicious foods, coffee and other beverages guaranteed to satisfy your tastebuds.
            <br></br><br></br>
          </p>
          <div className='menu-link'>
            <Link href='/menu'>
              <button>VIEW MENU</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuAd