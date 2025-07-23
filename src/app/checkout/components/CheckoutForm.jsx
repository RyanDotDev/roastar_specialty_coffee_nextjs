import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import FulfillmentMethod from './FulfillmentMethod';
import ShippingAddressField from './ShippingAddressField';
import PickupAddressField from './PickupAddressField';
import ContactField from './ContactField';
import PaymentField from './PaymentField';

const CheckoutForm = ({ 
  cart, 
  cartToken, 
  fulfillment, 
  setFulfillment, 
  subtotal, 
  shippingCost,
  shippingMethod,
  shippingThreshold,
  selectedShippingMethod,
  onShippingMethodChange,
  locations,
  pickupLocation,
  setPickupLocation,
  pickupLocationId,
  setPickupLocationId
}) => {

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [email, setEmail] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  // Shipping Address Field
  const [shippingAddress, setShippingAddress] = useState({
    first_name: '',
    last_name: '',
    line1: '',
    line2: '',
    city: '',
    postal_code: '',
    country: 'United Kingdom'
  });
  
  const [billingAddressForPickup, setBillingAddressForPickup] = useState({
    first_name: '',
    last_name: '',
    line1: '',
    line2: '',
    city: '',
    postal_code: '',
    country: ''
  })

  const [billingAddressForDelivery, setBillingAddressForDelivery] = useState({
    first_name: '',
    last_name: '',
    line1: '',
    line2: '',
    city: '',
    postal_code: '',
    country: ''
  })
  
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message);
      setLoading(false);
      return;
    }

    const shipping = {
      name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
      address: {
        line1: shippingAddress.line1,
        line2: shippingAddress.line2,
        city: shippingAddress.city,
        postal_code: shippingAddress.postal_code,
        country: shippingAddress.country,
      }
    }

     const billingData = fulfillment.type === 'pickup'
       ? billingAddressForPickup
       : (sameAsShipping ? shippingAddress : billingAddressForDelivery);

     const billing = {
      name: `${billingData.first_name} ${billingData.last_name}`,
      address: {
        line1: billingData.line1,
        line2: billingData.line2,
        city: billingData.city,
        postal_code: billingData.postal_code,
        country: billingData.country,
      }
    }

    try {
      const response = await fetch('/api/shopify/checkout/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart,
          cartToken,
          fulfillmentMethod: fulfillment.type,
          shippingMethod: selectedShippingMethod,
          shippingThreshold,
          shippingCost,
          shipping,
          pickupLocationId,
          pickupLocation,
          billing,
          nameOnCard,
          subtotal,
          email,
        }),
      });

      const data = await response.json();
      const clientSecret = data.clientSecret;

      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation/redirect/`,
          payment_method_data: {
            billing_details: {
              name: billing.name,
              email,
              address: billing.address,
            },
          },      
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        router.push(`/confirmation/${result.paymentIntent}`)
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      {/* CHECKOUT CONTACT INFORMATION FIELD */}
      <ContactField 
        email={email}
        setEmail={setEmail}
      />

      {/* CHECKOUT DELIVERY TOGGLE BETWEEN DELIVERY/PICKUP */}
      <FulfillmentMethod 
        selection={fulfillment}
        setSelection={setFulfillment}
      />

      {/* CHECKOUT DELIVERY OPTION */}
      {fulfillment?.type === 'delivery' && (
        <div>
          <label>
            <ShippingAddressField 
              onChange={setShippingAddress}
              shipping={shippingAddress}
              selection={fulfillment}
              setSelection={setFulfillment}
              subtotal={subtotal}
              shippingCost={shippingCost}
              shippingMethod={shippingMethod}
              shippingThreshold={shippingThreshold}
              selectedShippingMethod={selectedShippingMethod}
              onShippingMethodChange={onShippingMethodChange}
            />
          </label>
        </div>
      )}
      {/* CHECKOUT PICKUP OPTION */}
      {fulfillment?.type === 'pickup' && (
        <div>
          <label>
            <PickupAddressField
              selection={fulfillment}
              onBillingChange={setBillingAddressForPickup}
              pickupBilling={billingAddressForPickup}
              locations={locations}
              pickupLocation={pickupLocation}
              setPickupLocatio={setPickupLocation}
              pickupLocationId={pickupLocationId}
              setPickupLocationId={setPickupLocationId}
            />
          </label>
        </div>
      )}

      {/* PAYMENT FIELD */}
      <PaymentField 
        fulfillment={fulfillment}
        sameAsBilling={billingAddressForDelivery}
        setSameAsBilling={setBillingAddressForDelivery}
        sameAsShipping={sameAsShipping}
        setSameAsShipping={setSameAsShipping}
        nameOnCard={nameOnCard}
        setNameOnCard={setNameOnCard}
      />
      
      <button className='checkout-button' type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing…' : 'Pay'}
      </button>

      {message && <div className="message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;