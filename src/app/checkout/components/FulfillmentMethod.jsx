import React, { useState } from 'react';
import { LocalShipping } from '@mui/icons-material';
import { Storefront } from '@mui/icons-material';

const FulfillmentMethod = ({ selection, setSelection }) => {
  const fulfillmentType = selection?.type;

  return (
    <div className='fulfillment-container'>
      <h2 style={{ fontWeight: '600', fontSize: '1.3rem', marginTop: '2rem'  }}>Delivery</h2>

      <div className='fulfillment-options'>
        {/* DELIVERY SELECTION */}
        <label 
          className={`fulfillment-option ${fulfillmentType === 'delivery' ? 'selected' : ''}`}
          style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
        >
          <input 
            type="radio"
            name="fulfillment"
            value="delivery"
            checked={fulfillmentType === 'delivery'}
            onChange={() => setSelection({ type: 'delivery' })}
          />

          {/* RADIO BUTTON */}
          <div 
            className={`radio-button ${fulfillmentType === 'delivery' ? 'selected' : ''}`} 
          />

          <span className='label-text'>Delivery</span>
          <LocalShipping className={`icon ${fulfillmentType === 'delivery' ? 'selected' : ''}`}/>
        </label>

        {/* PICKUP SELECTION */}
        <label 
          className={`fulfillment-option ${fulfillmentType === 'pickup' ? 'selected' : ''}`}
          style={{ borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}
        >
          <input 
            type="radio"
            name="fulfillment"
            value="pickup"
            checked={fulfillmentType === 'pickup'}
            onChange={() => setSelection({ type: 'pickup' })}
          />
        
          <div 
            className={`radio-button ${fulfillmentType === 'pickup' ? 'selected' : ''}`} 
          />
          <span className='label-text'>Pickup in shop</span>
          <Storefront className={`icon ${fulfillmentType === 'pickup' ? 'selected' : ''}`}/>
        </label>
      </div>

    </div>
  )
}

export default FulfillmentMethod;