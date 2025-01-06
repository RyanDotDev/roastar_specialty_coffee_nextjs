import React from 'react'
import { Link , useLocation } from 'next/link';
import { motion } from "framer-motion";
import Backdrop from './Backdrop'

const navigation = [ 
    {_id:101, title: 'HOME', href: '/'},
    {_id:102, title: 'ABOUT US', href: '/AboutUs'},
    {_id:103, title: 'SHOP', href: '/Shop'},
    {_id:104, title: 'MENU', href: '/Menu'},
    {_id:105, title: 'CONTACT US', href: '/ContactUs'},
    {_id:106, title: 'CAREERS', href: '/Careers'},
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

  const active = useLocation().pathname;
  
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
                reloadDocument
                to={item?.href} 
                key={item._id} 
              >
                <li className={`${active === item?.href ? 'nav-list-green active' : 'nav-list-green'}`}> 
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