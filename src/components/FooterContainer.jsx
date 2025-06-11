"use client"
import React from 'react'
import InstagramIcon  from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import Link from 'next/link'
import { Copyright } from 'lucide-react'
import { usePathname } from 'next/navigation';
import Image from 'next/image';


const FooterContainer = () => {
  const pathname = usePathname();

  if (pathname === '/shop') return null;

  return (
    <footer className='footer-container'>
      <div className='footer-left-section'>
        <div className='footer-address'>
          <Image
            src='/logo/Logo-ROASTAR-white.webp'
            alt='Roastar Footer Image'
            height={80}
            width={180}
            loading='lazy'
          />
          <ul className='address'>
            <li>8 EAST ST</li>
            <li>BROMLEY</li>
            <li>BR1 1QX</li>
          </ul>
          <div className='opening-times'>
            <p>MONDAY - FRIDAY | 7:45am - 5pm</p>
            <p>SATURDAY | 8am - 5:30pm</p>
            <p>SUNDAY | 9am - 5pm</p>
          </div>
        </div>
        <div className='socials'>
          <p>
            <Link href='https://www.instagram.com/roastar.coffee/'>
              <InstagramIcon
                className='insta'
                style={{ fontSize: '2rem' }}
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
      </div>
      <div className='footer-right-section'>
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
          <div className={`footer-links`}>
            <a  
              href={'/privacy_policy/roastar_coffee_privacy_policy.pdf'} 
              target='_blank'
              rel='noopener noreferrer'
            >
              PRIVACY POLICY
            </a>
          </div>
          <div className='copyright'>
            <Copyright 
              size={12}
              style={{
                position: 'relative',
                top: '1.5px',
                marginRight: '0.2rem'
              }}
            />
              Copyright 2025. Roastar Coffee. All Rights Reserved
          </div>
          <div className='payment-icons'>
            <Image 
              className='shopify-logo' 
              src='/icon/shopify_icon.svg' 
              alt="Shopify Logo" 
              height="55" 
              width="55" 
              loading='lazy'
            />
            <Image 
              className='visa-logo' 
              src='/icon/visa_icon.svg' 
              alt="Visa Logo" 
              height="60" 
              width="60" 
              loading='lazy'
            />
            <Image 
              className='mastercard-logo' 
              src='/icon/mastercard_icon.svg' 
              alt="Mastercard Logo" 
              height="50" 
              width="50" 
              loading='lazy'
            />
            <Image 
              className='paypal-logo' 
              src='/icon/paypal-brands.svg' 
              alt="PayPal Logo" 
              height="40" 
              width="40" 
              loading='lazy'
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterContainer