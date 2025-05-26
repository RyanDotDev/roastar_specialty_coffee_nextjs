"use client"
import React, { useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion';
import Content from '@/lib/utils/popups/delivery/Content';
import Image from 'next/image';

const Links = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const htmlElement = document.documentElement;
      if (modalOpen) {
        htmlElement.classList.add('no-scroll');
      } else {
        htmlElement.classList.remove('no-scroll');
      }
      return () => {
        htmlElement.classList.remove('no-scroll');
      }
    }
  }, [modalOpen]);
  
  return (
    <div className='links-container'>
      <h2>EXPLORE OUR STORE</h2>
      <p>In Shop, at Home or on the Go!</p>
      <div className='link-images'>
        {/* LINK TO '/ContactUs' PAGE (location section) */}
        <div className='image-one'>
          {/* hash property is to identify id in GoogleMaps.jsx */}
          <Link 
            href={{
              pathname: '/contact',
              hash: '#location'
            }}>
            <Image
              src='/images/location_link_image.webp'
              alt='Roastar Location'
              width={300}
              height={300}
              loading='lazy'
            />
            <p>LOCATION</p>
          </Link>
        </div>

        {/* component for popup links below */}
        <div 
          className='image-two'
          onClick={() => modalOpen ? close() : open()}
        >
          <Image
            src='/images/delivery_link_image.webp'
            alt='Roastar Delivery'
            width={300}
            height={300}
            loading='lazy'
          />
          <p>DELIVERY</p>
        </div>
        
        {/* content of popup from backdrop components*/}
        <AnimatePresence>
          { modalOpen && <Content modalOpen={modalOpen} handleClose={close} />}
        </AnimatePresence>
        
        {/* LINK TO '/Shop' */}
        <div className='image-three'>
          <Link href='/shop'>
            <Image
              src='/images/roastar_products.webp'
              alt='Roastar Shop'
              width={300}
              height={300}
              loading='lazy'
            />
            <p>SHOP</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Links