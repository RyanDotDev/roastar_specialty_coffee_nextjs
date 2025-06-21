import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

import React from 'react'
import ContactUsPage from './components/ContactUsPage'
import ContactUsHeader from './components/ContactUsHeader'
import '@/styles/contact.css'

const page = async () => {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
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