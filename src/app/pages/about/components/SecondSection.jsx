import React from 'react'

const SecondSection = () => {
  return (
    <section className='second-section'>
      <div className='second-section-img'>
        <img
          src='/images/roastar_inside.webp'
          alt='Roastar Shop Inside'
          width={700}
          loading='lazy'
        />
      </div>
      <div className='second-section-text'>
        <h3>WHAT WE BRING</h3>
        <br/>
        <p>
          At Roastar, we serve the finest coffee that is directly served sourced from certified
          coffee farms in the highland regions Vietnam, using high quality milk and ingredients
        </p>
        <br/>
        <p>
          Our coffee beans are roasted daily so that we can offer the highest quality and taste
          to our customers, which helps us stand out compared to other coffee chains.
        </p>
        <br/>
        <p>
          Our method of business is combining our knowledge of coffee beans and roastery to educate
          visitors of our website and customers the origins of the coffee we produce as well as the cultural
          aspects of our business and brand.
        </p>
      </div>
    </section>
  )
}

export default SecondSection