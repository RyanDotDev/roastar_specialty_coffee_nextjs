"use client"
import React, { useEffect } from 'react'

const ContactUsHeader = () => {
  useEffect(() => {
    const originalBackgroundColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'var(--main-green)';
    return () => {
      document.body.style.backgroundColor = originalBackgroundColor;
    };
  }, [])

  return (
    <div className='contact-us-header'>
      <h1>CONTACT US</h1>
    </div>
  )
}

export default ContactUsHeader