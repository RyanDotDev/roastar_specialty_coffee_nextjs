import React from 'react'
import ContactUsPage from './components/ContactUsPage'
import ContactUsHeader from './components/ContactUsHeader'
import '@/styles/contact.css'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const page = async () => {
  const res = await fetch(`${baseUrl}/api/google-maps/map-key`, { cache: 'no-cache' })
  const { apiKey } = await res.json()

  return (
    <div className='contact-us-container'>
      <ContactUsHeader />
      <ContactUsPage apiKey={apiKey}/>
    </div>
  )
}

export default page