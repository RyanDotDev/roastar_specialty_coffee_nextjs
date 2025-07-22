"use client"
import React, { useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '@mui/material';

const CheckoutSummary = ({ 
  cart, 
  subtotal, 
  total, 
  shippingMethod,
  shippingThreshold,
  selectedShippingMethod,
  onShippingMethodChange,
  fulfillment,
}) => {

  let shippingLabel = '-';
  let effectivePrice = 0;

  if (selectedShippingMethod) {
    const { id, price } = selectedShippingMethod;
    const isPickup = fulfillment?.type === 'pickup';
    const isStandard = id === 'standard';
    const isFree = isPickup || (isStandard && subtotal >= shippingThreshold);

    // Calculate the effective shipping cost (0 for free standard, actual price otherwise)
    effectivePrice = isFree ? 0 : price;

    shippingLabel = isFree
      ? 'FREE'
      : `£${(price / 100).toFixed(2)}`;
  }

  // Sync this back to parent via onShippingMethodChange (if effective price changed)
  useEffect(() => {
    if (onShippingMethodChange) {
      onShippingMethodChange({
        ...selectedShippingMethod,
        price: effectivePrice,
      });
    }
  }, [selectedShippingMethod?.id, subtotal, shippingThreshold]);

  return (
    <div className='checkout-summary-content'>
      <div className='checkout-summary'>
        {cart.map((item, index) => (
          <div key={index} className='checkout-item'>
            <Badge
              badgeContent={item.quantity}
              sx={{
                "& .MuiBadge-badge": {
                  right: 6,
                  top: '1px',
                  padding: '8px',
                  borderRadius: '50%',
                  height: '14px',
                  width: '14px',
                  minWidth: '13px',
                  zIndex: 100,
                  color: 'white',
                  background: 'black',
                  fontVariantNumeric: 'tabular-nums',
                }
              }}
            >
              <Image 
                src={item.image}
                alt={item.title}
                width={70}
                height={70}
                priority
              />
            </Badge>
            <div className='checkout-text'>
              <p style={{ color: 'black', fontWeight: '700', fontSize: '0.8rem' }}>{item.title}</p>
              <p style={{ color: '#808080', fontSize: '0.7rem' }}>{item.variant}</p>
            </div>
            <p className='checkout-product-price'>£{Number(item.price).toFixed(2)}</p>
          </div>
        ))}
        <div className='checkout-subtotal'>
          <p>Subtotal</p> 
          <p>£{subtotal.toFixed(2)}</p>
        </div>
        <div className='checkout-shipping'>
          <p>Shipping</p> 
          <p>{shippingLabel}</p>
        </div>
        <div className='checkout-total'>
          <p><strong>TOTAL</strong></p> 
          <p><strong>£{(total / 100).toFixed(2)}</strong></p>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary;