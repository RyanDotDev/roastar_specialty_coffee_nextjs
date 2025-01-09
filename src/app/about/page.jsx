import React from 'react'
import AboutUsHeader from './components/AboutUsHeader'
import AboutUsContent from './components/AboutUsContent'
import '@/styles/about.css'

const page = () => {
  return (
    <div className='about-us-container'>
      <AboutUsHeader />
      <AboutUsContent />
    </div>
  )
}

export default page