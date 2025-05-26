import React from 'react'
import Header from './components/Header'
import CareersPage from './components/CareersPage'
import '@/styles/careers.css'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const getVacancy = async () => {
  const res = await fetch(`${baseUrl}/api/firebase/vacancies?jobId=1`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch vacancy')
  
  return res.json();
}

const page = async () => {
  let vacancyData = null;
  

  try {
    vacancyData = await getVacancy();

    vacancyData = {
      ...vacancyData,
      status: vacancyData.isOpen ? 'open' : 'closed',
      message: vacancyData.isOpen
        ? 'Interested? Pass us your CV into our shop and we will contact you.'
        : 'No Vacancies Available.',
    };
  } catch (err) {
    vacancyData = {
      status: 'closed',
      message: 'No vacancies available',
      error: err.message
    };
  }

  return (
    <div className='careers-container'>
      <Header />
      <CareersPage vacancy={vacancyData} />
    </div>
  )
}

export default page