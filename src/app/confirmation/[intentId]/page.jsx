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

export default async function ThankYouPage({ params }) {
  const { intentId } = await params;

  const intent = await stripe.paymentIntents.retrieve(intentId, {
    expand: ['latest_charge', 'charges.data.balance_transaction'],
  });

  const charge = intent.latest_charge;
  const paymentMethod = charge?.payment_method_details?.type || 'card';

  const {
    first_name,
    last_name,
    customer_email,
    fulfillment_method,
    shipping_method,
    pickup_address,
    billing_address,
    shipping_address,
  } = intent.metadata || {};

  // Customer Order Personal details
  const firstName = first_name || 'Valued Customer';
  const lastName = last_name || 'Valued Customer';
  const email = customer_email || 'N/A';
  const fulfillmentMethod = fulfillment_method || 'delivery'
  const shippingMethod = shipping_method || 'Standard';
  const pickupAddress = pickup_address || '';
  const billing = billing_address ? JSON.parse(billing_address) : null;
  const shipping = shipping_address ? JSON.parse(shipping_address) : null;

  // Customer Order Product Details
  const lineItems = charge?.invoice ? (
    await stripe.invoices.retrieveLineItems(charge.invoice)
  ) : [];

  const shippingCost = charge?.shipping?.amount || 0;
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
          Thank you for your purchase, <span>{firstName}!</span>
        </h1>
        <p className='confirmation-success'>Your order was successful.</p>

        <ResetCartToken />
        {/* CONFIRMATION DETAILS */}
        <ConfirmationDetails 
          email={email}
          shipping={shipping}
          billing={billing}
          fulfillmentMethod={fulfillmentMethod}
          shippingMethod={shippingMethod}
          paymentMethod={paymentMethod}
          pickupAddress={pickupAddress}
          lineItems={lineItems?.data || []}
          shippingCost={shippingCost}
          totalCost={totalCost}
        />
        {/* CONFIRMATION CODE */}
      </div>
    </div>
  )
};
