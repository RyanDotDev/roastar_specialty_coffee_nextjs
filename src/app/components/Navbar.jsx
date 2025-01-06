import React, { useState, useEffect } from 'react'
import { Badge } from '@mui/material'
import { Link } from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import Cart from './Cart.jsx'
import Logo from './Logo.jsx'
import MobileNav from './MobileNav.jsx'
import { useSelector } from 'react-redux'

// Array that features all nav-links required. Will return in .map component
const navigation = [ 
  {_id:101, title: 'HOME', href: '/'},
  {_id:102, title: 'ABOUT US', href: '/AboutUs'},
  {_id:103, title: 'SHOP', href: '/Shop'},
  {_id:104, title: 'MENU', href: '/Menu'},
  {_id:105, title: 'CONTACT US', href: '/ContactUs'},
];

const Navbar = () => {
    const { pathname } = useLocation();
    const active = useLocation().pathname; // returns current location and url
    const [colour, setColour] = useState(false); // changes the state of colour upon scrolling
    const [cartOpen, setCartOpen] = useState(false) // Opens and closes cart

    // cart management
    const cart = useSelector((state) => state.cart)

    const close = () => setCartOpen(false);
    const open = () => setCartOpen(true)

    useEffect(() => {
      close();

      const changeColour = () => {
        const isHome = matchPath("/", pathname)
        const isAboutUs = matchPath("/AboutUs", pathname)
        const isShop = matchPath("/Shop", pathname)
        const isMenu = matchPath("/Menu", pathname)
        const isContactUs = matchPath("/ContactUs", pathname)
        const isCareers = matchPath("/Careers", pathname)
        const isPrivacyNotice = matchPath("/PrivacyNotice", pathname)
        const isProductPage = matchPath("/product/:handle", pathname)

          if (isHome && window.scrollY >= 650) {
            setColour(true)
        } else if (isAboutUs && window.scrollY >= 1) {
            setColour(true)
        } else if (isShop && window.scrollY >= 1) {
            setColour(true)
        } else if (isContactUs && window.scrollY >= 1) {
            setColour(true)
        } else if (isMenu && window.scrollY >= 0) {
            setColour(true)
        } else if (isCareers && window.scrollY >= 180) {
            setColour(true)
        } else if (isPrivacyNotice && window.scrollY >= 1) {
            setColour(true)
        } else if (isProductPage && window.scrollY >= 1) {
            setColour(true)
        } else {
            setColour(false)
        }
      }; 
      
      // invoke once to check in case page is already scrolled down when rendering
      changeColour();
      window.addEventListener('scroll', changeColour);

      return () => {
        window.removeEventListener('scroll', changeColour)
      }
    }, [pathname])
    
  return (
    <div className={`${colour ? 'navbar navbarbg' : 'navbar'}`}>
      <div className="nav-container">
        <Logo />
        <MobileNav />
        <div className='item-container'>
          <ul className={`nav-list ${colour ? 'nav-list-white nav-list-black' : 'nav-list-white'}`}>
            {
              navigation.map((item) => (
                <Link 
                  reloadDocument
                  to={item?.href} 
                  key={item._id}
                  className={({ isActive }) => 
                    `${isActive && colour ? 'active-green' : 'active-beige'}`
                  }
                >
                  <li className={`mobile ${
                    active === item?.href 
                      ? colour 
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
                className={`cart-btn ${colour ? 'cart-white cart-black' : 'cart-white'}` }
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
