import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';
import Content from '../../../assets/popups/delivery/Content';

const Links = () => {
  const [ modalOpen, setModalOpen ] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);
  
  return (
    <div className='links-container'>
      <h2>EXPLORE OUR STORE</h2>
      <p>In Shop, at Home or on the Go!</p>
      <div className='link-images'>
        {/* LINK TO '/ContactUs' PAGE (location section) */}
        <div className='image-one'>
          {/* hash property is to identify id in GoogleMaps.jsx */}
          <Link 
            reloadDocument 
            to={{
              pathname: '/ContactUs',
              hash: '#location'
            }}>
            <img
              src='/images/location_link_image.webp'
              width={300}
              height={300}
            />
            <p>LOCATION</p>
          </Link>
        </div>

        {/* component for popup links below */}
        <div 
          className='image-two'
          onClick={() => modalOpen ? close() : open()}
        >
          <img
            src='/images/delivery_link_image.webp'
            width={300}
            height={300}
          />
          <p>DELIVERY</p>
        </div>
        
        {/* content of popup from backdrop components*/}
        <AnimatePresence>
          { modalOpen && <Content modalOpen={modalOpen} handleClose={close} />}
        </AnimatePresence>
        
        {/* LINK TO '/Shop' */}
        <div className='image-three'>
          <Link reloadDocument to='/Shop'>
            <img
              src='/images/roastar_products.webp'
              width={300}
              height={300}
            />
            <p>SHOP</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Links