import React from 'react';
import Header from './components/Header';
import CareersPage from './components/CareersPage';
import '@/styles/careers.css';

export default async function Page() {
  return (
    <div className='careers-container'>
      <Header />
      <CareersPage />
    </div>
  );
}