import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { clearCart, removeFromCart, updateQuantity } from '@//store/state';
import { motion } from 'framer-motion';
import Backdrop from '@/utils/popups/cart/Backdrop';
import { Minus, Plus, X } from 'lucide-react';
import DeleteIcon from '@mui/icons-material/Delete';
import { cartAnimate } from '@/lib/utils/popups/cart/animation';
import CartSlider from './CartSlider';
import Image from 'next/image';

const Cart = ({ handleClose }) => {
  const cart = useSelector((state) => state.cart);
  console.log("Cart state from Redux:", cart);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  console.log("Cart state after adding:", JSON.stringify(cart, null, 2));

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const lineItems = cart.map((item) => ({
        merchandiseId: item.id,
        quantity: item.quantity,
      }));
      console.log("Line items sent to Shopify:", lineItems);
      const response = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineItems }), // Send lineItems in the request body
      })

      if (!response) {
        throw new Error("Failed to create checkout");
      }

      const { checkoutUrl } = await response.json();
      if (checkoutUrl) {
        console.log(" Redirecting to checkout URL:", checkoutUrl);
        window.location.href = checkoutUrl;
      } else {
        alert("Failed to create checkout. Please try again.")
      }
    } catch(error) {
      console.error("Checkout error:", error);
      alert("Error creating checkout. Please try again later")
    } finally {
      setLoading(false)
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  }

  const handleClearCart = () => {
    dispatch(clearCart());
  }

  const handleQuantityChange = (id, type) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      const newQuantity = type === 'increment' ? item.quantity + 1 : Math.max(item.quantity - 1, 1);
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    }
  }

  const subtotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);
    
  return (
    <>
      {/* BACKDROP AND CART DISPLAY/ANIMATION */}
      <Backdrop> 
        <motion.div 
          onClick={(e) => e.stopPropagation()}
          className='cart-card'
          variants={cartAnimate}
          initial='hidden'
          animate='visible'
          exit='exit'
        >
          {/* CART CONTAINER */}
          <div className='cart-background'>
            <div className='cart-head'>
              <button 
                className='cart-close-btn' 
                onClick={handleClose}
              >
                <X size={30} strokeWidth={1.5}/>
              </button>
              <h3 className='cart-header'>SHOPPING CART {`(${cart.length})`}</h3>
            </div>
            {/* CART CONTENT (EMPTY) */}
            <div className='cart-content'>
              {cart.length === 0 ? (
                <div className='cart-is-empty'>
                  <p className=''>YOUR CART IS EMPTY</p>
                  <Link href='/shop'><button className='continue'>CONTINUE SHOPPING</button></Link>
                  <CartSlider />
                </div>
              ) : (
                <>
                  <div className='cart-container'>
                    {cart.map((item) => (
                      <div className='cart-item-container' key={item.id}>
                        <div className='cart-image'>
                          <Link href={`/product/${item.handle}`}>
                            <Image src={item.image} alt={item.title} width={100} height={90} loading='lazy'/>
                          </Link>
                        </div>
                        <div className='cart-title'>
                          <Link href={`/product/${item.handle}`} style={{ textDecoration: 'none', color: 'black' }}>
                            <h5 className='cart-title'>{item.title}</h5>
                          </Link>
                        </div>
                        <h5 className='cart-price'>£{(item.quantity * item.price).toFixed(2)}</h5>
                        <div className='cart-quantity-and-variant'>
                          <div className='cart-quantity-handle'>
                            <button onClick={() => handleQuantityChange(item.id, 'decrement')} className='cart-button-minus'>
                              <Minus size={10}/>
                            </button>
                             <p className='cart-quantity'>{item.quantity}</p>
                            <button onClick={() => handleQuantityChange(item.id, 'increment')} className='cart-button-plus'>
                              <Plus size={10}/>
                            </button>
                            </div>
                          <h5 className='cart-variant'>{item.variant.toUpperCase()}</h5>
                        </div>
                        <button className='cart-delete' onClick={() => handleRemove(item.id)}><DeleteIcon /></button>
                      </div>
                    ))}
                    {/* BOTTOM SECTION OF CART */}
                    <button className='clear' onClick={handleClearCart}>CLEAR CART</button>
                  </div>
                  <div className='cart-bottom-section'>
                    <p className='tax-and-shipping'>Tax and shipping is calculated at checkout</p>
                    <p className='cart-subtotal'>SUBTOTAL<span>£{subtotal.toFixed(2)} GBP</span></p>
                    {/* CHECKOUT BUTTON */}
                    <button 
                      onClick={handleCheckout}
                      className='checkout'
                    >
                      {loading ? 'CHECKOUT' : 'Processing...'}
                    </button>
                    {/* CONTINUE SHOPPING BUTTON */}
                    <Link href='/shop'>
                      <button className='continue'>
                        CONTINUE SHOPPING
                      </button>
                    </Link>
                  </div>
                </>
              )} 
            </div>
          </div>
        </motion.div>
      </Backdrop>
    </>
  )
}

export default Cart