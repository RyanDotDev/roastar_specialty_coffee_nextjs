import React from 'react'
import AboutUsHeader from './components/AboutUsHeader'
import AboutUsContent from './components/AboutUsContent'
import Footer from '../../components/Footer'
import '../../App.css'
import './AboutUs.css'

const AboutUs = () => {
  return (
    <div className='about-us-container'>
      <AboutUsHeader />
      <AboutUsContent />
      <Footer />
    </div>
  )
}

export default AboutUs