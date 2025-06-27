import React from 'react';
import Image from 'next/image';

const Menu = () => {
  /* useEffect(() => {
    const originalBackgroundColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'var(--main-green)';
    return () => {
      document.body.style.backgroundColor = originalBackgroundColor;
    };
  }, []); */

  return (
    <div className='menu'>
      <div className='menu-header'>
        
      </div>
      <div className='menu-page'>
        <div className='menu-image-container'>
          <Image
            src="/menu/roastar_iced_drinks_final_page.webp"
            alt='Roastar Iced Drinks Menu'
            height={500}
            width={600}
            style={{ height: 'auto' }}
            priority
           />
          <Image
            src="/menu/roastar_matcha_menu.webp"
            alt='Roastar Matcha Drinks Menu'
            height={800}
            width={600}
            priority
            style={{ height: 'auto' }}
           />
           <Image
            src="/menu/roastar_iced_drinks_menu.webp"
            alt='Roastar Iced Drinks Menu'
            height={800}
            width={600}
            loading='lazy'
            style={{ height: 'auto' }}
           />
           <Image
            src="/menu/roastar_fruity_iced_drinks.webp"
            alt='Roastar Fruity Iced Drinks Menu'
            height={800}
            width={600}
            loading='lazy'
            style={{ height: 'auto' }}
           />
           <Image
            src="/menu/roastar_main_menu.webp"
            alt='Roastar Main Menu'
            height={800}
            width={600}
            loading='lazy'
            style={{ height: 'auto' }}
          />
        </div>
        <p>For allergens, please contact a member of staff.</p>
      </div>
    </div>
  )
}

export default Menu