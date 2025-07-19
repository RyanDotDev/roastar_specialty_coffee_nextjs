import React, { useState } from 'react'

const BillingAddressField = ({ onChange }) => {
  const [address, setAddress] = useState({
    first_name: '',
    last_name: '',
    line1: '',
    line2: '',
    city: '',
    postal_code: '',
    country: ''
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...address, [name]: value }
    setAddress(updated);
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
          value={address.first_name}
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
          value={address.last_name}
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
          value={address.line1}
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
          value={address.line2}
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
          value={address.city}
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
          value={address.postal_code}
          onChange={handleInputChange}
          className='field'
          required
        />
      </label>

      {/* COUNTRY FIELD */}
      <label className='country'>
        <select
          name="country"
          value={address.country}
          onChange={handleInputChange}
          className='select-field'
          required
        >
          <option>United Kingdom</option>
        </select>
      </label>

    </div>
  )
}

export default BillingAddressField;