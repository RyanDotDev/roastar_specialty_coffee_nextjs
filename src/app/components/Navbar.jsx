import React, { useState, useEffect } from 'react'
import { Badge } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import Cart from './Cart.jsx'
import Logo from './Logo.jsx'
import MobileNav from './MobileNav.jsx'
import { useSelector } from 'react-redux'

// Array that features all nav-links required. Will return in .map component
const navigation = [ 
  { _id:101, title: 'HOME', href: '/' },
  { _id:102, title: 'ABOUT US', href: '/about' },
  { _id:103, title: 'SHOP', href: '/shop' },
  { _id:104, title: 'MENU', href: '/menu' },
  { _id:105, title: 'CONTACT US', href: '/contact' },
];

const Navbar = () => {
  // cart management
  const cart = useSelector((state) => state.cart)

  const { pathname } = usePathname();
  const [colourOnScroll, setColourOnScroll] = useState(false); // changes the state of colour upon scrolling
  const [cartOpen, setCartOpen] = useState(false) // Opens and closes cart

  const close = () => setCartOpen(false);
  const open = () => setCartOpen(true)

  // colourOnScroll logic
  const changeColourOnScroll = () => {
    const scrollThresholds = {
      '/': 650,
      '/about': 1,
      '/shop': 1,
      '/menu': 0,
      '/contact': 1,
      '/careers': 180,
      '/privacy': 1,
      '/product/:handle': 1,
    };

    const threshold = scrollThresholds[pathname] || 0;
    setColourOnScroll(threshold)
  }

  useEffect(() => {
    close();    
      
    changeColourOnScroll(); // Invoke on scroll mount
    window.addEventListener('scroll', changeColourOnScroll);

    return () => {
      window.removeEventListener('scroll', changeColourOnScroll)
    }
  }, [pathname])
    
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
                  className={`${pathname === item?.href && colourOnScroll ? 'active-green' : 'active-beige'}`}
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
              color="secondary"
              sx={{
                "& .MuiBadge-badge": {
                  right: 12,
                  top: '1px',
                  padding: '0 4px',
                  height: '14px',
                  minWidth: '13px',
                  zIndex: 100,
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
              {cartOpen && <Cart cart={cart} handleClose={close}/>}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
