import React from 'react'
import ContactForm from './ContactForm'
import GoogleMaps from './GoogleMaps'

const ContactUsPage = ({ apiKey, recaptchaSiteKey }) => {
  return (
    <div className="cu-container">
      <p>Have any enquiries? Please fill in form below. We would love to get in contact with you.</p>
      <ContactForm />
      <GoogleMaps apiKey={apiKey} />
    </div>
  )
}

export default ContactUsPage