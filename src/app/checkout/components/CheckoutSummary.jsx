import React from 'react';
import Image from 'next/image';
import { Badge } from '@mui/material';

const CheckoutSummary = ({ cart, subtotal, shipping, total, fulfillment }) => {
  const finalTotal = Math.max(0, fulfillment?.type === 'pickup' ? total - shipping : total);

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
              <p style={{ color: 'black', fontWeight: 'bold', fontSize: '0.8rem' }}><strong>{item.title}</strong></p>
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
          <p>{fulfillment?.type === 'pickup' ? 'FREE' : (shipping > 0 ? `£${(shipping / 100).toFixed(2)}` : 'FREE')}</p>
        </div>
        <div className='checkout-total'>
          <p><strong>TOTAL</strong></p> 
          <p><strong>£{(finalTotal / 100).toFixed(2)}</strong></p>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary;