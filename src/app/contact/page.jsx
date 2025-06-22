export const dynamic = 'force-dynamic';

import React from 'react'
import ContactUsPage from './components/ContactUsPage'
import ContactUsHeader from './components/ContactUsHeader'
import { googleMapsData } from '@/pages/api/google-maps/map-key';
import '@/styles/contact.css'

const page = async () => {
  const { apiKey } = await googleMapsData();

  return (
    <div className='contact-us-container'>
      <ContactUsHeader />
      <ContactUsPage apiKey={apiKey} />
    </div>
  )
}

export default page