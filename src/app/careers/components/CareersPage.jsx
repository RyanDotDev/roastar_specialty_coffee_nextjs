"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AppButton from './AppButton';

const CareersPage = ({ vacancy }) => {
  return (
    <div className='app-container'>
      <div className='app-content'>
        <div className='careers-image'>
          <Image 
            src='/images/imageThree.webp'
            alt='Roastar Careers Image'
            width={1000}
            height={320}
            priority
          />
        </div>
        <div className='app-text'>
          <h3>BECOME A ROASTAR!</h3>
          <p>Here at Roastar, we look after our staff just as much as our customers and always strive to
             maintain a pleasurable experience for all during their visit to our cafe.
          </p>
          <p>We do more than just train our employees to become a great barista, but we encourage a fun,
             friendly and enthusiastic workplace that we make sure you want to come back to whilst teaching
             you the ways of roastery styled coffee.
          </p>
          <div className='apply'>
            {vacancy?.status === "open" ? (
              <>
                {/* If vacancies are available */}
                <p>{vacancy?.message}</p>
                <AppButton />
              </>
            ) : (
              <p>{vacancy?.message || "No vacancies available"}</p>
            )}
            {vacancy?.error && (
              <p className='error'>Error: {vacancy.error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareersPage