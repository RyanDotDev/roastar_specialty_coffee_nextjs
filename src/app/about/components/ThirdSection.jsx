import React from 'react'

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
        <img 
          src='/icon/Logo ROASTAR-lettermark.PNG'
          alt='Roastar Lettermark'
          width={500}
          loading='lazy'
        />
      </div>
      <div className='third-section-images'>
        <div className='about-image-one'>
          <img 
            src='/images/imageTwo.png'
            width={400}
            loading='lazy'
          />
        </div>
        <div className='about-image-two'>
          <img 
            src='/images/roastar_aboutus_image.png'
            width={400}
            height={400}
            loading='lazy'
          />
        </div>
      </div>
    </section>
  )
}

export default ThirdSection