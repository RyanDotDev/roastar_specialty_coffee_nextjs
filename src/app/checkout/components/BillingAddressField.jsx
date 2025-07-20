import React, { useState } from 'react'

const BillingAddressField = ({ onChange, billingData }) => {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...billingData, [name]: value }
    onChange?.(updated)
  }

  return (
    <div className='checkout-billing-container'>

       {/* FIRST NAME FIELD */}
      <label className='first-name'>
        <input
          type='text'
          name='first_name'
          placeholder='First name'
          value={billingData?.first_name ?? ''}
          onChange={handleInputChange}
          className='field'
          required
        />
      </label>

      {/* LAST NAME FIELD */}
      <label className='last-name'>
        <input
          type='text'
          name='last_name'
          placeholder='Last name'
          value={billingData?.last_name ?? ''}
          onChange={handleInputChange}
          className='field'
          required
        />
      </label>

      {/* ADDRESS LINE 1 FIELD */}
      <label className='line-1'>
        <input
          type='text'
          name='line1'
          placeholder='Address Line 1'
          value={billingData?.line1 ?? ''}
          onChange={handleInputChange}
          className='field'
          required
        />
      </label>

      {/* ADDRESS LINE 2 FIELD */}
      <label className='line-1'>
        <input
          type='text'
          name='line2'
          placeholder='Address Line 2 (optional)'
          value={billingData?.line2 ?? ''}
          onChange={handleInputChange}
          className='field'
        />
      </label>

      {/* CITY FIELD */}
      <label className='city'>
        <input
          type='text'
          name='city'
          placeholder='City'
          value={billingData?.city ?? ''}
          onChange={handleInputChange}
          className='field'
          required
        />
      </label>

      {/* POSTAL CODE FIELD */}
      <label className='postal-code'>
        <input
          type='text'
          name='postal_code'
          placeholder='Post code'
          value={billingData?.postal_code ?? ''}
          onChange={handleInputChange}
          className='field'
          required
        />
      </label>

      {/* COUNTRY FIELD */}
      <label className='country'>
        <select
          name="country"
          value={billingData?.country ?? ''}
          onChange={handleInputChange}
          className='select-field'
          required
        >
          <option value='' disabled hidden>Select a country</option>
          <option value='United Kingdom'>United Kingdom</option>
        </select>
      </label>

    </div>
  )
}

export default BillingAddressField;