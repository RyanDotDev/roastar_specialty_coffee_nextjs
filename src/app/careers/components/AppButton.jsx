"use client"
import React, { useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import AppForm from './AppForm';

const AppButton = () => {
    const [applicationOpen, setApplicationOpen] = React.useState(false);
    const toggleApplication = useCallback(() => {
      setApplicationOpen((prev) => !prev);
    }, [])

    useEffect(() => {
      if (typeof window !== "undefined") {
        const htmlElement = document.documentElement
        if (applicationOpen) {
          htmlElement.classList.add('no-scroll')
        } else {
          htmlElement.classList.remove('no-scroll')
        }
        return () => {
          htmlElement.classList.remove('no-scroll')
        }
      }
    }, [applicationOpen])
    
  return (
    <>
      <button 
        className='apply-btn'
        onClick={toggleApplication}
      >
        APPLY HERE
      </button>
       
      <AnimatePresence>
        {applicationOpen && <AppForm applicationOpen={applicationOpen} handleClose={toggleApplication}/>}
      </AnimatePresence>
    </>
  )
}

export default AppButton