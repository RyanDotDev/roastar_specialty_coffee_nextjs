import React from 'react';
import Header from './components/Header';
import CareersPage from './components/CareersPage';
import '@/styles/careers.css';

const page = () => (
  <div className='careers-container'>
    <Header />
    <CareersPage />
  </div>
);

export default page;