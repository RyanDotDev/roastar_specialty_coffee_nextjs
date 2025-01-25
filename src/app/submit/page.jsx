import React from 'react'
import { CircleCheckBig } from 'lucide-react'
import Link from 'next/link'
import '@/styles/submit.css'

const page = () => {
  return (
    <div className='submit-container'>
      <div className='submit-nav'>
        <Link href='/'>
          HOME
        </Link>
        <Link href='/careers'>
          BACK TO CAREERS
        </Link>
      </div>
      <div className='application-sent'>
        <CircleCheckBig size={200} strokeWidth={0.7} style={{ color: 'var(--btn-green)' }} />
        <p>Thank you for your application!</p>
        <p>You should hear from us soon.</p>
      </div>
    </div>
  )
}

export default page