import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";
import Backdrop from './Backdrop'

const navigation = [ 
    { _id:101, title: 'HOME', href: '/' },
    { _id:102, title: 'ABOUT US', href: '/about' },
    { _id:103, title: 'SHOP', href: '/shop' },
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
        duration: 0.5,
        type: "spring",
        damping: 30,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

const MobileMenu = ({ handleClose }) => {
  const { pathname } = usePathname();
  
  return (
    <Backdrop onClick={handleClose}>
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
              >
                <li className={`${pathname === item?.href ? 'nav-list-green active' : 'nav-list-green'}`}> 
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