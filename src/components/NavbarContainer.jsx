"use client"
import React, { useState, useEffect } from 'react';
import { Badge } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Cart from './Cart.jsx';
import Logo from './Logo.jsx';
import MobileNav from './MobileNav.jsx';
import { useCartStore } from '../store/cartStore.js';

const navigation = [ 
  { _id:101, title: 'HOME', href: '/' },
  { _id:102, title: 'ABOUT US', href: '/about' },
  { _id:103, title: 'SHOP', href: '/shop' },
  { _id:104, title: 'MENU', href: '/menu' },
  { _id:105, title: 'CONTACT US', href: '/contact' },
];

const NavbarContainer = ({ sliderProducts }) => {
  const cart = useCartStore((state) => state.cart)
  const pathname = usePathname();
  const [colourOnScroll, setColourOnScroll] = useState(false); // changes the state of colour upon scrolling
  const [cartOpen, setCartOpen] = useState(false) // Opens and closes cart

  const close = () => setCartOpen(false);
  const open = () => setCartOpen(true)

  useEffect(() => {
    close();   
    const changeColourOnScroll = () => {
      const scrollThresholds = {
        '/': 650,
        '/about': 1,
        '/shop': 1,
        '/menu': 0,
        '/contact': 1,
        '/careers': 1,
        '/privacy': 1,
        '/coming-soon': 700,
      };

      let threshold;
      if (pathname.startsWith('/product/')) {
        threshold = 1;
      } else if (pathname.startsWith('/thank-you/')) {
        threshold = 180;
      } else {
        threshold = scrollThresholds[pathname] || 0;
      }
      setColourOnScroll(window.scrollY >= threshold);
    };
    
    changeColourOnScroll();
    window.addEventListener('scroll', changeColourOnScroll);

    return () => {
      window.removeEventListener('scroll', changeColourOnScroll);
    }
  }, [pathname])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const htmlElement = document.documentElement;
      if (cartOpen) {
        htmlElement.classList.add('no-scroll');
      } else {
        htmlElement.classList.remove('no-scroll');
      }

      return () => {
        htmlElement.classList.remove('no-scroll')
      }
    };
  }, [cartOpen]);

  if (pathname.startsWith('/thank-you/')) return null; 

  return (
    <div className={`${colourOnScroll ? 'navbar navbarbg' : 'navbar'}`}>
      <div className="nav-container">
        <Logo />
        {/* ON MOBILE/TABLET ONLY */}
        <MobileNav />
        <div className='item-container'>
          <ul className={`nav-list ${colourOnScroll ? 'nav-list-white nav-list-black' : 'nav-list-white'}`}>
            {
              navigation.map((item) => (
                <Link 
                  href={item?.href} 
                  key={item._id}
                  className={`${item?.href === pathname && colourOnScroll ? 'active-green' : 'active-beige'}`}
                >
                  <li className={`mobile ${
                    pathname === item?.href 
                      ? colourOnScroll
                        ? 'nav-list-black active-beige active-green' 
                        : 'nav-list-black active-beige'
                      : 'nav-list-black'
                    }`}
                  > 
                    {item?.title}
                    <span className={`${pathname === item?.href && colourOnScroll ? 'active-green' : 'active-beige'}`}/>
                  </li>
                </Link>
              ))
            }
          </ul>
          <div className='cart'>
            <Badge
              badgeContent={cart.length}
              invisible={cart.length === 0}
              className='cart-badge'
              color='secondary'
              sx={{
                "& .MuiBadge-badge": {
                  right: 12,
                  top: '1px',
                  padding: '0 4px',
                  height: '14px',
                  minWidth: '13px',
                  zIndex: 100,
                  background: 'crimson',
                  fontVariantNumeric: 'tabular-nums',
                }
              }}
            >
              <button 
                className={`cart-btn ${colourOnScroll ? 'cart-white cart-black' : 'cart-white'}` }
                onClick={() => cartOpen ? close() : open()}
              >
                <ShoppingCart
                  style={{
                    position: 'absolute', 
                    left: '6px', 
                    top: '7px'
                  }}
                />
              </button>
            </Badge>
            <AnimatePresence>
              {cartOpen && <Cart cart={cart} handleClose={close} sliderProducts={sliderProducts} />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavbarContainer
