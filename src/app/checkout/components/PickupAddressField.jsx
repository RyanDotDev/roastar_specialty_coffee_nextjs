import React, { useState, useEffect } from 'react'
import BillingAddressField from './BillingAddressField';

const PickupAddressField = ({ selection, onBillingChange }) => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/shopify/admin/locations');
        if (!res.ok) throw new Error('Failed to fetch locations');
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error('Failed to fetch Shopify store locations:', err.message)
        setError('Could not load store pickup locations', err.message);
      }
    }

    fetchLocations();
  }, [])
  
  if (selection?.type !== 'pickup') return null;

  return (
    <div className='checkout-pickup-container'>
      {error 
        ? <p>{error}</p> 
        : <h3 style={{ marginTop: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>Pick a shop location</h3>
      }
      <label className='checkout-pickup' htmlFor='pickup_location_id' >
        <select className='select-field' name='pickup_location_id' id='pickup_locations_id' required>
          <option value='' disabled>Select a location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}, {location.address1}, {location.city}
            </option>
          ))}
        </select>
      </label>

      {/* BILLING ADDRESS */}
      <h3 style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Billing Address</h3>
      <BillingAddressField onChange={onBillingChange} />
    </div>
  )
}

export default PickupAddressField;