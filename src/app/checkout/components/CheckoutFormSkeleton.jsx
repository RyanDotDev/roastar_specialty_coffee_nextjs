import React from 'react';

const CheckoutFormSkeleton = () => {
  return (
    <div className='checkout-form-skeleton'>
      <div className='skeleton-input'/>
      <div className='skeleton-fulfillment'>
        <div className='skeleton-input'/>
        <div className='skeleton-input'/>
      </div>
      <div className='skeleton-grid'>
        <div className='skeleton-input skeleton-line-1'/>
        <div className='skeleton-input skeleton-line-2'/>
        <div className='skeleton-input skeleton-line-3'/>
        <div className='skeleton-input skeleton-line-4'/>
        <div className='skeleton-input skeleton-line-5'/>
        <div className='skeleton-input skeleton-line-6'/>
        <div className='skeleton-input skeleton-line-7'/>
      </div>
      <div className='skeleton-input'/>
      <div className='skeleton-input'/>
      <div className='skeleton-payment'/>
      <div className='skeleton-button'/>
    </div>
  )
}

export default CheckoutFormSkeleton