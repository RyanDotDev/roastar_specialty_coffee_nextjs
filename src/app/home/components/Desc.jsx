import React from 'react'
import Link  from 'next/link'
import Image from 'next/image'

const Desc = () => {
  return (
      <div className='desc-container'>
        <div className='desc-content'>
          <div className='desc-text'>
            <h2>VIETNAMESE STYLE COFFEE</h2>
            <p>
              Discover and learn about our coffee and what makes it so great by visiting our
              'About Us' page. Learn about what makes our coffee so great and stands out.
              <br></br><br></br>
            </p>
            <p className='about-us-link'>
              <Link href='/about'>
                CLICK FOR MORE
              </Link>
            </p>
          </div>
          <Image 
            src='/images/roastar_desc_ad.webp'
            alt='Iced Latte Image'
            height={500}
            width={700}
            loading='lazy'
          />
        </div>
      </div>
  )
}

export default Desc