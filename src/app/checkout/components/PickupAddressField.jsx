import React, { useState, useEffect } from 'react'
import BillingAddressField from './BillingAddressField';

const PickupAddressField = ({ 
  selection, 
  onBillingChange, 
  pickupBilling,
  locations,
  pickupLocation,
  setPickupLocation,
  pickupLocationId,
  setPickupLocationId,
}) => {
  useEffect(() => {
    if (!locations || !pickupLocationId) return;
    const selected = locations.find(
      loc => String(loc.id) === String(pickupLocationId)
    );
    if (selected) {
      if (!pickupLocation || selected.id !== pickupLocation.id) {
        setPickupLocation?.(selected);
      }
    }
  }, [pickupLocationId, locations]);
  
  if (selection?.type !== 'pickup') return null;

  return (
    <div className='checkout-pickup-container'>
      <h3 style={{ marginTop: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>Pick a shop location</h3>
      <label className='checkout-pickup' htmlFor='pickup_location_id' >
        <select 
          className='select-field' 
          name='pickup_location_id' 
          id='pickup_locations_id' 
          value={pickupLocationId || ''}
          onChange={e => setPickupLocationId(e.target.value)}
          required
        >
          <option value='' disabled>Select a location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}, {location.address1}, {location.city}, {location.zip}
            </option>
          ))}
        </select>
      </label>

      {/* BILLING ADDRESS */}
      <h3 style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Billing Address</h3>
      <BillingAddressField 
        onChange={onBillingChange} 
        billingData={pickupBilling}
      />
    </div>
  )
}

export default PickupAddressField;