import React from 'react'
import ContactUsContainer from './components/ContactUsContainer'
import ContactUsHeader from './components/ContactUsHeader'
import Footer from '../../components/Footer'
import '../../App.css'
import './ContactUs.css'

const ContactUs = () => {
  return (
    <div className='contact-us-container'>
      <ContactUsHeader />
      <ContactUsContainer />
      <Footer />
    </div>
  )
}

export default ContactUs