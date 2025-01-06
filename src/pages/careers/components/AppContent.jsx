import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import AppForm from './AppForm';

const AppContent = () => {
    const [ applicationOpen, setApplicationOpen ] = useState(false);

    const toggleApplication = useCallback(() => {
      setApplicationOpen((prev) => !prev);
    }, [])
    
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

export default AppContent