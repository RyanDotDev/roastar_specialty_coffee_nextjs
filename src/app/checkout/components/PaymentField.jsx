import React, { useState } from 'react'
import { PaymentElement } from '@stripe/react-stripe-js';
import BillingAddressField from './BillingAddressField';

export const PaymentField = ({ 
  fulfillment, 
  sameAsBilling, 
  setSameAsBilling,
  sameAsShipping,
  setSameAsShipping,
  nameOnCard,
  setNameOnCard
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null); // Defining payment method

  const handleBillingChange = (updateAddress) => {
    setSameAsBilling(prev => ({
      ...prev,
      ...updateAddress
    }))
  };

  const toggleSameAsShipping = () => {
    setSameAsShipping(prev => !prev); // This will reflect upstream in metadata
  };

  return (
    <div className='checkout-payment-container'>
      {/* CARD PAYMENT */}
      <h2 style={{ fontWeight: '600', fontSize: '1.3rem', marginTop: '2rem' }}>Payment</h2>
      <div className='payment-container'>
        <PaymentElement
          onChange={(event) => {
            setSelectedMethod(event.value?.type || null);
          }}
        />
        {selectedMethod === 'card' && (
          <label>
            <input
              type="text"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              placeholder='Name on card'
              className='name-on-card-field'
              required
            />
          </label>
        )}

        {/* BILLING ADDRESS FIELD (Only renders on delivery option) */}
        {fulfillment?.type === 'delivery' && (
          <>
            <div className='shipping-same-as-billing'>
              <input 
                type="checkbox"
                checked={sameAsShipping}
                onChange={toggleSameAsShipping}
              />
              <p style={{ fontSize: '0.8rem' }}>Shipping address is the same as billing address</p> 
            </div>

            {/* RENDERS BILLING ADDRESS IF ABOVE INPUT IS UNTICKED */}
            {!sameAsShipping && (
              <BillingAddressField 
                onChange={handleBillingChange} 
                billingData={sameAsBilling}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentField;
