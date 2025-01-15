import React from 'react'
import PrivacyNoticeHeader from './components/PrivacyNoticeHeader'
import PrivacyNotice from './components/PrivacyNotice'
import '@/styles/privacy.css'

const page = () => {
  return (
    <div>
      <PrivacyNoticeHeader />
      <PrivacyNotice />
    </div>
  )
}

export default page