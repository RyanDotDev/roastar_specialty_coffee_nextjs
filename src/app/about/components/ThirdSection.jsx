import React from 'react';
import Image from 'next/image';

const ThirdSection = () => {
  return (
    <section className='third-section'>
      <div className='third-section-text'>
        <h3>OUR GOAL</h3>
        <br/>
        <p>
          Our goal is to bring a truly Vietnamese experience to our cafe and become one 
          of the leading Vietnames coffee brands in the UK, drawing a connection between 
          Vietnam and the rest of the world. We are always committed to providing our 
          customers with the best and most unforgettable experience in hopes bringing more
          awarness to our coffee culture and to grow our business to new heights.
        </p>
        <br/>
        <Image 
          src='/icon/Logo ROASTAR-lettermark.PNG'
          alt='Roastar Lettermark'
          width={400}
          height={400}
        />
      </div>
      <div className='third-section-images'>
        <div className='about-image-one'>
          <Image
            src='/images/imageTwo.png'
            alt='Image Two'
            width={350}
            height={350}
          />
        </div>
        <div className='about-image-two'>
          <Image 
            src='/images/roastar_aboutus_image.png'
            alt='About Us Image'
            width={350}
            height={350}
          />
        </div>
      </div>
    </section>
  )
}

export default ThirdSection