import React from 'react'
import './Submit.css'
import { CircleCheckBig } from 'lucide-react'
import { Link } from 'react-router-dom'

const Submit = () => {
  return (
    <div className='submit-container'>
      <div className='submit-nav'>
        <Link reloadDocument to='/'>
          HOME
        </Link>
        <Link reloadDocument to='/Careers'>
          BACK TO CAREERS
        </Link>
      </div>
      <div className='application-sent'>
        <CircleCheckBig size={200} strokeWidth={0.7} style={{color: 'var(--btn-green)'}} />
        <p>Thank you for your application!</p>
      </div>
    </div>
  )
}

export default Submit