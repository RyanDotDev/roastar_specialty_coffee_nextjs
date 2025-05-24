import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";
import Backdrop from './Backdrop';
import Image from 'next/image';

const navigation = [ 
    { _id:101, title: 'HOME', href: '/' },
    { _id:102, title: 'ABOUT US', href: '/about' },
    { _id:103, title: 'SHOP', href: '/coming-soon' },
    { _id:104, title: 'MENU', href: '/menu' },
    { _id:105, title: 'CONTACT US', href: '/contact' },
    { _id:106, title: 'CAREERS', href: '/careers' },
  ];

const dropIn = {
    hidden: {
      y: "100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.01,
        type: "spring",
        damping: 30,
        stiffness: 250,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };


const MobileMenu = ({ handleClose }) => {
  const pathname = usePathname();

  const refreshPage = (href) => {
    window.location.assign(href);
  }
  
  return (
    <Backdrop onClick={handleClose}>
      <Link 
        href='/'
        onClick={() => refreshPage('/')}
      >
        <div className='roastar-logo-mobile-daytime'>
          <Image 
            src='/logo/Logo-ROASTAR-black.webp'
            alt='Roastar Logo Mobile Daytime'
            height={50}
            width={150}
            priority
          />
        </div>
        <div className='roastar-logo-mobile-nighttime'>
          <Image 
            src='/logo/Logo-ROASTAR-white.webp'
            alt='Roastar Logo Mobile Daytime'
            height={50}
            width={150}
            priority
          />
        </div>
      </Link>
      <motion.div
        onClick={(e) => e.stopPropagation()}  
        variants={dropIn}
        className='mobile-nav'
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ul className='mobile-nav-list'>
          {
            navigation.map((item) => (
              <Link 
                href={item?.href} 
                key={item._id} 
                onClick={() => refreshPage(item?.href)}
                className={`${item?.href === pathname && 'active'}`}
              >
                <li className={`${item?.href === pathname ? 'nav-list-black active' : 'nav-list-black'}`}> 
                  {item?.title}
                </li>
              </Link>
            ))
          }
        </ul>
      </motion.div>
    </Backdrop>
  )
}

export default MobileMenu