"use client"
import React from 'react'
import InstagramIcon  from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import Link from 'next/link'
import { Copyright } from 'lucide-react'
import { usePathname } from 'next/navigation';
import Image from 'next/image';


const Footer = () => {
  const pathname  = usePathname();

  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='footer-address'>
          <Image
            src='/logo/Logo ROASTAR-white.webp'
            alt='Roastar Footer Image'
            height={80}
            width={180}
          />
          <ul className='address'>
            <li>8 EAST ST</li>
            <li>BROMLEY</li>
            <li>BR1 1QX</li>
          </ul>
          <div className='phone-no'>
            <p>020 4559 2984</p>
          </div>
        </div>
        <div className='socials'>
          <p>
            <Link href='https://www.instagram.com/roastar.coffee/'>
              <InstagramIcon
                className='insta'
                style={{fontSize: '2rem'}}
              />
           </Link>
          </p>
          <p>
            <Link href='https://www.facebook.com/roastarcoffeeuk'>
              <FacebookIcon
                className='facebook'
                style={{
                  fontSize: '2.2rem',
                  position: 'relative',
                  top: '-0.05em'
                }}
            />
            </Link>
          </p>
        </div>
        <div className='footer-nav'>
          <div className={`footer-links ${'/about' === pathname && 'active-footer'}`}>
            <Link 
              href='/about'
            >
              ABOUT US
            </Link>
          </div>
          <div className={`footer-links ${'/contact' === pathname && 'active-footer'}`}>
            <Link 
              href='/contact'
            >
              CONTACT US
            </Link>
          </div>
          <div className={`footer-links ${'/careers' === pathname && 'active-footer'}`}>
            <Link  
              href={'/careers'} 
            >
              CAREERS
            </Link>
          </div>
          <div className={`footer-links ${'/shop' === pathname && 'active-footer'}`}>
            <Link 
              href={'/shop'} 
            >
              SHOP
            </Link>
          </div>
          <div className={`footer-links ${'/privacy' === pathname && 'active-footer'}`}>
            <Link  
              href={'/privacy'} 
            >
              PRIVACY NOTICE
            </Link>
          </div>
          <div style={{textAlign: 'center'}}>
            <span 
              style={{
                color: 'white', 
                position: 'relative',
                left: '5px',
                fontSize: '12px'
              }}>
              <Copyright 
                size={12}
                style={{
                  position: 'relative',
                  top: '1.5px',
                  left: '-5px'
                }}
              />
                Copyright 2025. Roastar Coffee. All Rights Reserved
            </span>
          </div>
          <div className='payment-icons'>
            <img src='/icon/payment_visa_icon.svg' alt="Visa" width="60" />
            <img src='/icon/payment_mastercard_icon.svg' alt="Visa" width="60" />
            <img src='/icon/payment_paypal_icon.svg' alt="Visa" width="60" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
