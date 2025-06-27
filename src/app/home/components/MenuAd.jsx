import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { coffees } from '@/lib/helpers/coffees';

const MenuAd = () => {
  return (
    <div className="menu-container">
      <div className='menu-content'> 
        <div className='menu-text'>
          <h2>MUST-TRY DRINKS</h2>
          <h3>Try our summer drinks selection.</h3>
          <Link href='/menu'>CLICK HERE FOR FULL MENU</Link>
        </div>
        <div className='menu-images'>
          {coffees.map((item) => (
            <div key={item?.id}>
              <Image 
                src={item?.image}
                alt={item?.title}
                width={300}
                height={300}
              />
              <h5>{item?.title}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MenuAd