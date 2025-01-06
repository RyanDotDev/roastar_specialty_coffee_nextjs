import React from 'react'
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import Backdrop from './Backdrop'
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
        <X size={40} strokeWidth={1.1}/>
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
          <h3>Choose a Delivery</h3>
        </div>
        <div className='delivery-link'>
          <div className='deliveroo'>
            <Link reloadDocument to='https://deliveroo.co.uk/menu/london/bromley/roastar-speciality-coffee-8-east-street'>
              <img
                src='../../../icon/deliveroo_icon.png'
                width={250}
              />
            </Link>
          </div>
          
          <Link reloadDocument to='https://www.ubereats.com/gb/store/roastar-speciality-coffee/0oJZk_Y8WdGYpXWoQ1Qe_Q'>
            <div className='uber-eats'>
              <img
                src='../../../icon/uber_eats_icon.png'
                width={200}
              />
            </div>
          </Link>
        </div>
      </motion.div>
    </Backdrop>
  )
}

export default Content