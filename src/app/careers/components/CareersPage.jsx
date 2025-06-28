import React from 'react';
import Image from 'next/image';
import Vacancy from './Vacancy';

const CareersPage = () => {
  return (
    <div className='app-container'>
      <div className='app-content'>
        <div className='careers-image'>
          <Image 
            src='/images/imageThree.webp'
            alt='Roastar Careers Image'
            width={320}
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
          {/* Vacancy logic happens here */}   
          <Vacancy />
        </div>
      </div>
    </div>
  );
}

export default CareersPage;