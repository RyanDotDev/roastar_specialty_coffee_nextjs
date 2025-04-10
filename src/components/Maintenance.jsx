import React from 'react';
import Image from 'next/image';

/* This component is only for when maintanence is needed */
const ComingSoon = () => {
  return (
    <div className='maintenance-container'>
      <div className='maintenance-content'>
        <Image 
          src='/icon/Logo_ROASTAR_lettermark.PNG'
          alt='Roastar Lettermark'
          width={400}
          height={100}
          style={{ height: 'auto', width: 'auto' }}
        />
        <p>CURRENTLY UNDER MAINTENANCE. <br></br>COMING SOON</p>
      </div>
    </div>
  )
}

export default ComingSoon