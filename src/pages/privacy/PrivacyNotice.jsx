import React from 'react'
import PrivacyNoticeHeader from './components/PrivacyNoticeHeader'
import Footer from '../../components/Footer'
import './PrivacyNotice.css'


const PrivacyNotice = () => {
  return (
    <div className='privacy-notice-container'>
      <PrivacyNoticeHeader />
      <Footer />
    </div>
  )
}

export default PrivacyNotice