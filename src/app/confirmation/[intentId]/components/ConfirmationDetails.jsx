import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@mui/material';

const ConfirmationDetails = ({ 
  email,
  shipping,
  billing,
  fulfillmentMethod,
  shippingMethod,
  paymentMethod,
  pickupAddress,
  lineItems,
  shippingCost,
  totalCost,
}) => {
  return (
    <div className='confirmation-details-container'>
      <div className='confirmation-details'>
        {/* PRODUCT LIST */}
        <div>
          <div className='confirmation-product-container'>
            {lineItems.map(item => {
              const product = item.price.product;
              const imageUrl = product.images?.[0];
              return (
                <div className='confirmation-product-details' key={item.id}>
                  {/* CONFIRMED PRODUCT IMAGE */}
                  <div className='confirmation-image'>
                    <Badge
                      badgeContent={item.quantity}
                      sx={{
                        "& .MuiBadge-badge": {
                          right: 12,
                          top: '1px',
                          padding: '10px',
                          borderRadius: '50%',
                          height: '14px',
                          width: '14px',
                          minWidth: '13px',
                          zIndex: 100,
                          color: 'white',
                          background: 'var(--btn-green)',
                          fontVariantNumeric: 'tabular-nums',
                        }
                      }}
                    >
                      {imageUrl && 
                        <Image 
                          src={imageUrl} 
                          alt={item.description} 
                          width={80} 
                          height={80} 
                        />
                      }
                    </Badge>
                    {/* PRODUCT DETAILS */}
                    <div className='confirmation-text'>
                      {/* PRODUCT NAME */}
                      <p style={{ color: 'black', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {item.description}
                      </p>
                      {/* PRODUCT VARIANT */}
                      <p style={{ color: '#808080', fontSize: '0.7rem' }}>
                        {item.price.product.description.slice(0, -4).toUpperCase()}
                      </p>
                    </div>
                    <p className='confirmation-product-price'>{`£${(item.price.unit_amount / 100).toFixed(2)}`}</p>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* CONFIRMATION SUMMARY */}
          <div className='confirmation-summary'>
            <div className='confirmation-subtotal'>
              <p>Subtotal</p>
              <p>
                £{(
                  lineItems.reduce(
                    (sum, item) => sum + item.price.unit_amount * item.quantity,
                    0
                  ) / 100
                ).toFixed(2)}
              </p>
            </div>
            <div className='confirmation-shipping'>
              <p>Shipping</p>
              <p>{`£${(shippingCost / 100).toFixed(2)}`}</p>
            </div>
            <div className='confirmation-total'>
              <p><strong>TOTAL</strong> </p>
              <p className='total-cost'><strong>{`£${(totalCost / 100).toFixed(2)}`}</strong></p>
            </div>
          </div>
          <div className='confirmation-links'>
            <Link href='/shop'>
              <button className='continue-shopping'>CONTINUE SHOPPING</button>
            </Link>
              <p className='contact-us'>Need Help? <Link href='/contact'><span >Contact Us</span></Link></p>
          </div>
        </div>

        {/* CONFIRMATION ORDER DETAILS */}
        <div className='confirmation-card'>
          <div className='confirmation-card-details'>
            <h2>Order Details</h2>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
            <p><strong>Fulfillment Method:</strong> {fulfillmentMethod === 'pickup' ? 'Pickup' : 'Delivery'}</p>
            <br />
            {fulfillmentMethod === 'pickup' ? (
              <p><strong>Pickup Address:</strong> {pickupAddress || ''}</p>
            ) : (
              <>
                <h3>Shipping Address:</h3>
                {!shipping ? (
                  <p>Shipping details unavailable</p>
                ) : (
                  <>
                    <p>{shipping?.name}</p>
                    <p>{shipping?.line1}</p>
                    {shipping?.line2 && <p>{shipping?.line2}</p>}
                    <p>{shipping?.city} {shipping?.postal_code}</p>
                    <p><strong>Shipping Method:</strong> {shippingMethod}</p>
                  </>
                )}
              </>
            )}
            <br />
            <h3>Billing Address:</h3>
            {!billing ? (
              <p>Billing details unavailable</p>
            ) : (
              <>
                <p>{billing?.line1}</p>
                {billing?.line2 && <p>{billing?.line2}</p>}
                <p>{billing?.city}, {billing?.postal_code}</p>
                <p>{billing?.country}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>     
  )
}

export default ConfirmationDetails