import React from 'react'
import Link from 'next/link';
import { motion } from "framer-motion";
import Backdrop from './Backdrop'
import Image from 'next/image';
import { X } from 'lucide-react';

const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

const Content = ({ handleClose }) => {
  return (
    <Backdrop>
      <button 
        className='close' 
        onClick={handleClose}
      >
        <X size={34} strokeWidth={1.3}/>
      </button>
      <motion.div 
        onClick={(e) => e.stopPropagation()}
        className='delivery'
        variants={dropIn}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        <div className='delivery-text'>
          <h2>WE DELIVER TOO!</h2>
          <h3>Choose a delivery</h3>
        </div>
        <div className='delivery-link'>
          <div className='deliveroo'>
            <Link href='https://deliveroo.co.uk/menu/london/bromley/roastar-speciality-coffee-8-east-street'>
              <Image
                src='/icon/deliveroo_icon.svg'
                alt='Deliveroo Icon'
                width={250}
                height={250}
                loading='lazy'
              />
            </Link>
          </div>       
          <div className='uber-eats'>
            <Link href='https://www.ubereats.com/gb/store/roastar-speciality-coffee/0oJZk_Y8WdGYpXWoQ1Qe_Q'>
              <Image
                src='/icon/uber_eats_icon.svg'
                alt='Deliveroo Icon'
                width={250}
                height={250}
                loading='lazy'
              />
            </Link>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  )
}

export default Content