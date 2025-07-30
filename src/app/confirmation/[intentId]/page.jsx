export const dynamic = 'force-dynamic';

import React from 'react'
import Image from 'next/image';
import Stripe from 'stripe';
import '@/styles/thank-you.css';
import { CircleCheck } from 'lucide-react';
import Link from 'next/link';
import ConfirmationDetails from './components/ConfirmationDetails';
import ResetCartToken from './components/ResetCartToken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const safeParseJSON = (json) => {
  try {
    if (typeof json === 'string' && json !== 'undefined') {
      return JSON.parse(json);
    }
      return null;
  } catch {
    return null;
  }
}

export default async function ThankYouPage({ params }) {
  const { intentId } = await params;

  const intent = await stripe.paymentIntents.retrieve(intentId, {
    expand: ['charges'],
  });

  const charge = intent.latest_charge;
  const paymentMethod = charge?.payment_method_details?.type || 'card';

  // Extract metadata for each order details
  const metadata = intent.metadata || {};

  // Reconstruct cart items from split keys if present, else fallback to metadata.cart
  let cartItems = [];
  const cartKeys = Object.keys(metadata).filter(k => k.startsWith('cart_item_'));
  if (cartKeys.length) {
    cartKeys.forEach(key => {
      const item = safeParseJSON(metadata[key]);
      if (item) cartItems.push(item);
    });
  } else {
    cartItems = safeParseJSON(metadata.cart) || [];
  }

  const shipping = safeParseJSON(metadata.shipping);
  const billing = safeParseJSON(metadata.billing);

  const fullName = (billing?.name || shipping?.name || '').trim();
  const [firstName = '', ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(' ');

  // Shipping address and billing address
  let shippingAddress, billingAddress;

  shippingAddress = {
    first_name: firstName || '',
    last_name: lastName || '',
    address1: shipping?.address?.line1 || '',
    address2: shipping?.address?.line2 || '',
    city: shipping?.address?.city || '',
    province: shipping?.address?.state || '',
    country: shipping?.address?.country || '',
    zip: shipping?.address?.postal_code || '',
  }

  billingAddress = {
    first_name: firstName || '',
    last_name: lastName || '',
    address1: billing?.address?.line1 || '',
    address2: billing?.address?.line2 || '',
    city: billing?.address?.city || '',
    province: billing?.address?.state || '',
    country: billing?.address?.country || '',
    zip: billing?.address?.postal_code || '',
  }


  // Customer Order Personal details
  const email = metadata.customer_email || 'N/A';
  const fulfillmentMethod = metadata.fulfillment_method || 'delivery'
  // const shippingMethod = JSON.parse(metadata.shipping_method)
  /* const pickupAddress = pickup_address || ''; */

  // Customer Order Product Details
  const lineItems = charge?.invoice ? (
    await stripe.invoices.retrieveLineItems(charge.invoice)
  ) : [];

  const shippingCost = Number(metadata.shipping_fee) || 0;
 
  const totalCost = intent.amount_received || intent.amount || 0;
  const confirmationNumber = `${intentId.slice(-8).toUpperCase()}`;

  return (
    <div className='confirmation-container'>
      <div className='confirmation-navbar'>
        <Link href='/'>
          <Image 
            src='/logo/Logo-ROASTAR-black.webp'
            alt='Roastar Coffee Black Logo'
            width={150}
            height={50}
            style={{ width: 'auto' }}
          />
        </Link>
      </div>
      <div className='confirmation-content'>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Confirmation code: {confirmationNumber}</p> 
        <h1>
          <CircleCheck 
            size={60} 
            strokeWidth={1} 
            color={'var(--btn-green)'} 
            style={{ position: 'relative', top: '1rem', marginRight: '0.5rem' }}
          />
          Thank you for your purchase, <span>{firstName || 'Valued Customer'}!</span>
        </h1>
        <p className='confirmation-success'>Your order was successful.</p>

        <ResetCartToken />
        {/* CONFIRMATION DETAILS */}
        <ConfirmationDetails 
          email={email}
          shipping={shipping}
          billing={billing}
          fulfillmentMethod={fulfillmentMethod}
          // shippingMethod={shippingMethod}
          shippingCost={shippingCost}
          cartItems={cartItems}
          totalCost={totalCost}
        />
        {/* CONFIRMATION CODE */}
      </div>
    </div>
  )
};
