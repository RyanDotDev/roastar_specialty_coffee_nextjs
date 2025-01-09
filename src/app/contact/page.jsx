import React from 'react'
import ContactUsContainer from './components/ContactUsContainer'
import ContactUsHeader from './components/ContactUsHeader'
import '@/styles/contact.css'

const page = () => {
  return (
    <div className='contact-us-container'>
      <ContactUsHeader />
      <ContactUsContainer />
    </div>
  )
}

export default page