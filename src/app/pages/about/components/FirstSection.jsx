import React from 'react'

const FirstSection = () => {
  return (
    <section className='first-section'>
      <div className='text-container-one'>
        <h3>ORIGIN</h3>
        <br/>
        <p>
          Roastar Coffee was founded in 2019 where
          we have been trading online with specially imported Vietnamese coffee which 
          we sell as B2B and B2C, bringing awarness to Vietnamese-grown coffee. 
        </p>
        <br/>
        <p>
          Coffee has deep roots in Vietnamese culture and plays an intrinsic role
          in Vietnamese history and society for over a hundred years and to this very
          day, Vietnamese coffee has become a global juggernaut.
        </p>
        <br/>
        <p>
          How, do you ask? French missionaries brought the first seedlings to the country
          over 160 years ago. Because of this, coffee has had a significant impact in 
          Vietnamese culture and has made drinking coffee an experience that is rich in 
          history, culture and heritage, making coffee drinking and café culture overall
          a staple in Vietnam.
        </p>
        <br/>
        <p>
          From Ho Minh City to Da Nang and Hanoi, the aroma of freshley brewed coffee can
          be found in any modern café and hole-in-a-wall shop all over. In Vietnam, coffee
          drinking is seen as an opportunity to pause and rest but also to escape from the
          heat and also from extreme rainfall. It's no secret that Coffee culture is a beacon
          that keeps Vietnam buzzing like it does today.
        </p>
      </div>
      {/* TOP SECTION IMAGES */}
      <div className='first-section-images'>
        <div className='about-image-one'>
          <img 
            src='/images/roastar_origin_two.webp'
            alt='roastar origin two'
            width={400}
            loading='eager'
          />
        </div>
        <div className='about-image-two'>
          <img 
            src='/images/roastar_origin_one.webp'
            alt='roastar origin one'
            width={400}
            height={400}
            loading='lazy'
          />
        </div>
      </div>
    </section>
  )
}

export default FirstSection