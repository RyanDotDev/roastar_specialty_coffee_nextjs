import React, { useState } from 'react'
import { PaymentElement } from '@stripe/react-stripe-js';
import BillingAddressField from './BillingAddressField';

export const PaymentField = ({ fulfillment }) => {
  const [name, setName] = useState(''); // Name on card state
  const [selectedMethod, setSelectedMethod] = useState(null); // Defining payment method
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState(null);

  const handleBillingChange = (updateAddress) => {
    setBillingAddress(updateAddress);
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                onChange={() => setSameAsShipping(!sameAsShipping)}
              />
              <p style={{ fontSize: '0.8rem' }}>Shipping address is the same as billing address</p> 
            </div>

            {/* RENDERS BILLING ADDRESS IF ABOVE INPUT IS UNTICKED */}
            {!sameAsShipping && (
              <BillingAddressField onChange={handleBillingChange} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentField;
