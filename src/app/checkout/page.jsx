"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { nanoid } from 'nanoid';
import { appearance } from '@/lib/utils/themes/stripe/appearance';
import { ShoppingBag } from 'lucide-react';
import CheckoutSummary from './components/CheckoutSummary';
import CheckoutForm from './components/CheckoutForm';
import ZeroStockModal from '@/lib/utils/popups/checkout/zero-stock/ZeroStockModal';
import CheckoutFormSkeleton from './components/CheckoutFormSkeleton';
import '@/styles/checkout.css'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const page = () => {
  const [cart, setCart] = useState([]);
  const [cartToken, setCartToken] = useState(null);
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [returnUrl, setReturnUrl] = useState('/');

  // Loading skeleton before checkout form
  const [isMounted, setIsMounted] = useState(false);

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
  // Error modal when product is out of stock
  const [zeroStockError, setZeroStockError] = useState(false);
  const modalRef = useRef();
  const scrollContainerRef = useRef();

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

  // State for selected locations
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
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok && data.message?.includes('Only 0 left in stock')) {
            console.log('🧨 Zero stock detected on page load.');
            setZeroStockError(true);
            modalRef.current?.playEnter?.();
            return;
          }

          setClientSecret(data.clientSecret);
          setShipping(data.shippingAmount || 0);
        })
        .catch(err => {
          console.error('Failed to catch clientSecret:', err)
        });
      } catch (err) {
        console.error('Failed to parse cart from localStorage', err);
        setIsCartEmpty(true);
      }
    } else {
      setIsCartEmpty(true);
    }
  }, [])

  // Fetch methods
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

  // Calculate totals of shipping method, fulfillmentType (e.g. pickup or delivery), subtotal of products only and shipping threshold for free delivery
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

  // Loading useEffect for skeleton
  useEffect(() => {
    // Avoid hydration mismatch + wait for Stripe & elements to be available
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 200); // Adjustable

    return () => clearTimeout(timeout);
  }, []);

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
    <div ref={scrollContainerRef} className='checkout-container'>

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
      {/* IF THERE IS NOT STOCK AVAILABLE OF ITEM */}

      {/* CHECKOUT CONTENT */}
      <div className='checkout-content'>

        {/* CHECKOUT SUMMARY (right side) */}
        <div className='checkout-summary-container'>
          <CheckoutSummary 
            cart={cart}
            setCart={setCart}
            subtotal={subtotal}
            setSubtotal={setSubtotal}
            total={total}
            shippingMethod={shippingMethod}
            shippingThreshold={shippingThreshold}
            selectedShippingMethod={selectedShippingMethod}
            onShippingMethodChange={handleShippingMethodChange}
            shippingLabel={shippingLabel}
            fulfillment={fulfillment}
            scrollContainerRef={scrollContainerRef}
          />
        </div>

        {/* CHECKOUT FORM/PAYMENT (left side) */}
        <div className='checkout-form-container'>

          {zeroStockError ? (
             <ZeroStockModal ref={modalRef} handleClose={() => setZeroStockError(false)} />
            ) : clientSecret ? (
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
          ) : (
            <CheckoutFormSkeleton />
          )}
        </div>
      </div>
    </div>
  )
}

export default page;