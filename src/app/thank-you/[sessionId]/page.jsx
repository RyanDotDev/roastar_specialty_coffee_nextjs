export const dynamic = 'force-dynamic';

import React from 'react'
import Image from 'next/image';
import Stripe from 'stripe';
import '@/styles/thank-you.css';
import { CircleCheck } from 'lucide-react';
import Link from 'next/link';
import ConfirmationDetails from './components/ConfirmationDetails';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function ThankYouPage({ params }) {
  const { sessionId } = await params;

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['shipping', 'line_items.data.price.product', 'customer'],
  });

  // Customer Order Personal details
  const customerName = session.customer_details?.name || 'Valued Customer';
  const email = session.customer_details?.email || 'N/A';
  const shipping = session.shipping.address;
  const billing = session.customer_details?.address;
  const fulfillmentMethod = session.metadata?.fulfillment_method || 'delivery';
  const shippingMethod = session.shipping_options?.[0]?.shipping_rate || 'Standard';
  const paymentMethod = session.payment_method_types?.[0] || 'Card';
  const pickupAddress = session.metadata?.pickup_address;

  // Customer Order Product Details
  const lineItems = session.line_items?.data || [];
  const shippingCost = session.total_details?.amount_shipping || 0;
  const totalCost = session.amount_total || 0;
  const confirmationNumber = `${session.id.slice(-12).toUpperCase()}`;

  return (
    <div className='confirmation-container'>
      <div className='confirmation-navbar'>
        <Link href='/'>
          <Image 
            src='/logo/Logo-ROASTAR-green.webp'
            alt='Roastar Coffee Green Logo'
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
          Thank you for your purchase, <span>{customerName}!</span>
        </h1>
        <p className='confirmation-success'>Your order was successful.</p>

        {/* CONFIRMATION DETAILS */}
        <ConfirmationDetails 
          email={email}
          shipping={shipping}
          billing={billing}
          fulfillmentMethod={fulfillmentMethod}
          shippingMethod={shippingMethod}
          paymentMethod={paymentMethod}
          pickupAddress={pickupAddress}
          lineItems={lineItems}
          shippingCost={shippingCost}
          totalCost={totalCost}
        />
        {/* CONFIRMATION CODE */}
      </div>
    </div>
  )
};
