import React, { useState, useEffect } from 'react'

const ShippingAddressField = ({ onChange, shipping, selection, setSelection, subtotal }) => {
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await fetch('/api/shopify/admin/deliveryMethods');
        const data = await res.json();
        setMethods(data.deliveryMethods || []);
      } catch (error) {
        console.error('Error fetching delivery methods:', error);
      }
    };

    fetchMethods();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...shipping, [name]: value }
    onChange?.(updated)
  };


  const handleMethodChange = (e) => {
    const selected = methods.find(m => m.id === e.target.value);
    setSelectedMethod(selected);
    setSelection?.({ type: 'delivery', method: selected });
  }

  // Hides everything if not selected for delivery
  if (selection?.type !== 'delivery') return null

  return (
    <>
      <h3 style={{ marginTop: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>Shipping Address</h3>
      <div className='checkout-shipping-container'>
      
        {/* FIRST NAME FIELD */}
        <label className='first-name'>
          <input
            type='text'
            name='first_name'
            placeholder='First name'
            value={shipping.first_name}
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
            value={shipping.last_name}
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
            value={shipping.line1}
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
            value={shipping.line2}
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
            value={shipping.city}
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
            placeholder='Postal code'
            value={shipping.postal_code}
            onChange={handleInputChange}
            className='field'
            required
          />
        </label>

        {/* COUNTRY FIELD */}
        <label className='country'>
          <select
            name="country"
            value={shipping.country}
            onChange={handleInputChange}
            className='select-field'
            required
          >
            <option value="GB">United Kingdom</option>
          </select>
        </label>
 
        {/* SHIPPING METHOD */}
        <div className='checkout-shipping-method'>
          <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Shipping Method</h3>
          {methods.map((method, i) => {
            const isFree = Number(subtotal) >= 25 && method.price > 0;
            const shippingPrice = isFree 
              ? 'FREE' 
              : method.price > 0 
                ? `£${(method.price / 100).toFixed(2)}` 
                : 'FREE';
            return (
              <label 
                className={`shipping-method ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                key={method.id}
                style={{ 
                  borderTopLeftRadius: i === 0 ? '8px' : '0', 
                  borderTopRightRadius: i === 0 ? '8px' : '0',
                  borderBottomLeftRadius: i === 1 ? '8px' : '0', 
                  borderBottomRightRadius: i === 1 ? '8px' : '0'
                }}
              >
                <input 
                  type="radio"
                  name="method"
                  value={method.id}
                  checked={selectedMethod?.id === method.id}
                  onChange={handleMethodChange}
                  required
                />
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    {method.label} 
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#717171' }}>
                    {method.estimated_days}
                  </p>
                </div>
                <span style={{ fontWeight: '600', fontSize: '0.8rem' }}>{shippingPrice}</span>
              </label>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default ShippingAddressField;