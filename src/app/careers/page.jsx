import React from 'react'
import Header from './components/Header'
import Application from './components/Application'
import '@/styles/careers.css'

const page = () => {
  return (
    <div className='careers-container'>
      <Header />
      <Application />
    </div>
  )
}

export default page