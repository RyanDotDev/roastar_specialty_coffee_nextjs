import React from 'react'
import FirstSection from './FirstSection'
import SecondSection from './SecondSection'
import ThirdSection from './ThirdSection'

const AboutUsContent = () => {
  return (
    <div className='about-us-background'>
      <div className='about-us-content'>
        {/* FIRST SECTION */}
        <FirstSection />
        {/* SECOND SECTION */}
        <SecondSection />
        {/* THIRD SECTION */}
        <ThirdSection />
      </div>
    </div>
  )
}

export default AboutUsContent