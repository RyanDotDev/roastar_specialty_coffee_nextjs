/* This maybe used in the future

"use client"
import React, { useState } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '@/store/cartStore';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const billingDetails = {
      name: e.target.name.value,
      email: e.target.email.value,
      address: {
        line1: e.target.billing_line1.value,
        city: e.target.billing_city.value,
        postal_code: e.target.billing_postal.value,
        country: e.target.billing_country.value,
      },
    };

    const shippingDetails = {
      name: e.target.shipping_name.value,
      address: {
        line1: e.target.shipping_line1.value,
        city: e.target.shipping_city.value,
        postal_code: e.target.shipping_postal.value,
        country: e.target.shipping_country.value,
      },
    };

    const cartPayload = cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      title: item.title,
      variant: item.variant,
      stripe_price_id: item.stripe_price_id,
    }));

    try {
      const res = await fetch('/api/shopify/checkout/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          cart: cartPayload,
          shipping: shippingDetails,
          billing: billingDetails,
        }),
      });

      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
        shipping: shippingDetails,
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSuccessData({ billingDetails, shippingDetails });
        clearCart();
      }
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
    }

    setLoading(false);
  };

  if (successData) {
    return (
      <div>
        <h2>✅ Payment Successful</h2>
        <h3>Shipping Address</h3>
        <p>{successData.shippingDetails.name}</p>
        <p>{successData.shippingDetails.address.line1}</p>
        <p>{successData.shippingDetails.address.city}, {successData.shippingDetails.address.postal_code}</p>
        <p>{successData.shippingDetails.address.country}</p>

        <h3>Billing Info</h3>
        <p>{successData.billingDetails.name}</p>
        <p>{successData.billingDetails.email}</p>
        <p>{successData.billingDetails.address.line1}</p>
        <p>{successData.billingDetails.address.city}, {successData.billingDetails.address.postal_code}</p>
        <p>{successData.billingDetails.address.country}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>🧾 Checkout</h2>

      <h3>Billing Info</h3>
      <input name="name" placeholder="Full Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="billing_line1" placeholder="Address" required />
      <input name="billing_city" placeholder="City" required />
      <input name="billing_postal" placeholder="Postcode" required />
      <input name="billing_country" placeholder="Country (e.g. GB)" required />

      <h3>Shipping Info</h3>
      <input name="shipping_name" placeholder="Recipient Name" required />
      <input name="shipping_line1" placeholder="Address" required />
      <input name="shipping_city" placeholder="City" required />
      <input name="shipping_postal" placeholder="Postcode" required />
      <input name="shipping_country" placeholder="Country (e.g. GB)" required />

      <h3>Card Info</h3>
      <CardElement options={{ hidePostalCode: true }} />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
} */