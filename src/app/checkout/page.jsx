"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { nanoid } from 'nanoid';
import { appearance } from '@/lib/utils/themes/stripe/appearance';
import Link from 'next/link';
import CheckoutForm from './components/CheckoutForm';
import { ShoppingBag } from 'lucide-react';
import '@/styles/checkout.css'
import CheckoutSummary from './components/CheckoutSummary';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const page = () => {
  const [cart, setCart] = useState([]);
  const [cartToken, setCartToken] = useState(null);
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [returnUrl, setReturnUrl] = useState('/');

  // price/cost states
  const [subtotal, setSubtotal] = useState(0); // total of products ONLY
  const [shipping, setShipping] = useState(0); // Shipping cost/fee
  const [total, setTotal] = useState(0); // total price
  const [fulfillment, setFulfillment] = useState({ type: 'delivery' }); // State for selecting delivery or pickup

  // States for shipping methods
  const [shippingMethod, setShippingMethod] = useState([]);
  const [shippingThreshold, setShippingThreshold] = useState(0); // threshold for free shipping
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);

  // States for pickup
  const [locations, setLocations] = useState([]);
  const [pickupLocationId, setPickupLocationId] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);

  // To fetch locations as an array
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/shopify/admin/locations');
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error('Failed to fetch locations:', err.message);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const selected = locations.find(loc => String(loc.id) === String(pickupLocationId));
    setPickupLocation(selected || null);
  }, [pickupLocationId, locations]);

  // Main cart logic useEffect
  useEffect(() => {
    const stored = localStorage.getItem('cart-storage');
    // Returns to original url
    const previous = localStorage.getItem('previous-url');
    if (previous) setReturnUrl(previous)

    // Stored cart data
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const cartData = parsed.state.cart || [];

        setCart(cartData);
        setIsCartEmpty(false);

        if (cartData.length === 0) {
          setIsCartEmpty(true);
          return
        }

        const total = cartData.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );
        setSubtotal(parseFloat(total.toFixed(2)));

        let cartToken = localStorage.removeItem('cart-token');

        if (!cartToken) {
          cartToken = nanoid(40);
          localStorage.setItem('cart-token', cartToken);
        }
        setCartToken(cartToken)

        const url = new URL(window.location.href);
        url.searchParams.set('cart-token', cartToken);
        window.history.replaceState({}, '', url);

        console.log('🛒 Received cart token:', cartToken);
        
        fetch('/api/shopify/checkout/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            cart: cartData, 
            cartToken,
            fulfillmentMethod: 'shipping',
          }),
        })
          .then(res => res.json())
          .then(data => {
            setClientSecret(data.clientSecret);
            setShipping(data.shippingAmount || 0);
          })
          .catch(err => {
            console.error('Failed to catch clientSecret:', err)
          })
      } catch (err) {
        console.error('Failed to parse cart from localStorage', err);
        setIsCartEmpty(true);
      }
    } else {
      setIsCartEmpty(true);
    }
  }, [])

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await fetch('/api/shopify/admin/deliveryMethods');
        const data = await response.json();
        setShippingMethod(data.shippingMethods || []);
        setShippingThreshold(data.shippingThreshold);

        if (data.shippingMethods?.length > 0) {
          setSelectedShippingMethod(data.shippingMethods[0])
        }
      } catch (error) {
        console.error('Error fetching delivery methods:', error)
      }
    };

    fetchMethods();
  }, []);

  const calculateTotals = (method, fulfillmentType, subtotal, shippingThreshold) => {
    if (!method) return { shippingCost: 0, totalPrice: subtotal };

    const isPickup = fulfillmentType === 'pickup';
    const isStandard = method.id === 'standard';
    const isFree = isPickup || (isStandard && subtotal >= shippingThreshold);

    const shippingCost = isFree ? 0 : method.price || 0;
    const totalPrice = Math.round(subtotal * 100) + shippingCost;

    return { shippingCost, totalPrice }
  }

  useEffect(() => {
    if (!selectedShippingMethod) return;

    const { shippingCost, totalPrice } = calculateTotals(
      selectedShippingMethod,
      fulfillment?.type,
      subtotal,
      shippingThreshold
    );

    setShipping(shippingCost);
    setTotal(totalPrice);
  }, [selectedShippingMethod, fulfillment?.type, subtotal, shippingThreshold])

  const shippingLabel = 
    fulfillment?.type === 'pickup'
      ? 'FREE'
      : shipping > 0
      ? `£${(shipping / 100).toFixed(2)}`
      : 'FREE'

  const handleShippingMethodChange = (method) => {
    setSelectedShippingMethod(method)
  }

  // Displays if user tries to access page without any items in the cart
  if (isCartEmpty) {
    return (
      <div className='empty-cart-message'>
        <h2>Your cart is empty</h2>
        <p>
          Please add items to your cart before checkout, or return to the {" "}
          <Link href='/shop' className='checkout-cart-empty-link'>
            Shop
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className='checkout-container'>

      {/* CHECKOUT NAVBAR */}
      <div className='checkout-navbar'>
        <Link href={returnUrl}>
          <Image 
            src='/logo/Logo-ROASTAR-black.webp'
            alt='Roastar Coffee Logo Black'
            width={150}
            height={50}
            style={{ width: 'auto' }}
            priority
          />
        </Link>
        <Link href='/shop'>
          <ShoppingBag style={{ marginTop: '0.5rem' }} color={'black'}/>
        </Link>
      </div>

      {/* CHECKOUT CONTENT */}
      <div className='checkout-content'>

        {/* CHECKOUT SUMMARY (right side) */}
        <div className='checkout-summary-container'>
          <CheckoutSummary 
            cart={cart}
            subtotal={subtotal}
            total={total}
            shippingMethod={shippingMethod}
            shippingThreshold={shippingThreshold}
            selectedShippingMethod={selectedShippingMethod}
            onShippingMethodChange={handleShippingMethodChange}
            shippingLabel={shippingLabel}
            fulfillment={fulfillment}
          />
        </div>

        {/* CHECKOUT FORM/PAYMENT (left side) */}
        <div className='checkout-form-container'>
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
              <CheckoutForm 
                clientSecret={clientSecret}
                fulfillment={fulfillment}
                setFulfillment={setFulfillment}
                subtotal={subtotal}
                shippingCost={shipping}
                cart={cart}
                cartToken={cartToken}
                shippingMethod={shippingMethod}
                shippingThreshold={shippingThreshold}
                selectedShippingMethod={selectedShippingMethod}
                onShippingMethodChange={handleShippingMethodChange}
                locations={locations}
                pickupLocationId={pickupLocationId}
                setPickupLocationId={setPickupLocationId}
                pickupLocation={pickupLocation}
                setPickupLocation={setPickupLocation}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}

export default page;