export const dynamic = 'force-dynamic';

import React from 'react'
import ContactUsPage from './components/ContactUsPage'
import ContactUsHeader from './components/ContactUsHeader'
import '@/styles/contact.css'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://roastarcoffee.co.uk';

const page = async () => {
  const googleMapsRes = await fetch(`${baseUrl}/api/google-maps/map-key`, { cache: 'no-cache' })
  const { apiKey } = await googleMapsRes.json();

  return (
    <div className='contact-us-container'>
      <ContactUsHeader />
      <ContactUsPage apiKey={apiKey} />
    </div>
  )
}

export default page