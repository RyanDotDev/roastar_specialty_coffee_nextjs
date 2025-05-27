import React from 'react';
import Image from 'next/image';

const ThirdSection = () => {
  return (
    <section className='third-section'>
      <div className='third-section-text'>
        <h3>OUR GOAL</h3>
        <br/>
        <p>
          Our goal is to bring a truly Vietnamese experience to our café and become one 
          of the leading Vietnamese coffee brands in the UK, drawing a connection between 
          Vietnam and the rest of the world. We are always committed to providing our 
          customers with the best and most unforgettable experience in hopes bringing more
          awarness to our coffee culture and to grow our business to new heights.
        </p>
        <br/>
        <Image 
          src='/icon/Logo_ROASTAR_lettermark.PNG'
          alt='Roastar Lettermark'
          width={400}
          height={400}
          className='roastar-lettermark'
          loading='lazy'
        />
      </div>
      <div className='third-section-images'>
        <div className='about-image-one'>
          <Image
            src='/images/roastar_latte_photo.webp'
            alt='Image Two'
            width={350}
            height={350}
            style={{ objectFit: 'cover', transform: 'rotate(270deg)' }}
            className='latte-img'
            loading='lazy'
          />
        </div>
        <div className='about-image-two'>
          <Image 
            src='/images/roastar_aboutus_image.png'
            alt='About Us Image'
            width={350}
            height={350}
            style={{ objectFit: 'cover'}}
            loading='lazy'
          />
        </div>
      </div>
    </section>
  )
}

export default ThirdSection