import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import MobileMenu from '../../lib/utils/popups/mobilemenu/MobileMenu';
import { AnimatePresence } from 'framer-motion';

const MobileNav = () => {
    const [colourOnScroll, setColourOnScroll] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = usePathname();

    // arrow functions for opening and closing menu
    const close = () => setMenuOpen(false);
    const open = () => setMenuOpen(true);

    // Function for changing colour upon scroll depending on page
    const changeColourOnScroll = () => {
      const scrollThresholds = {
        '/': 650,
        '/about': 1,
        '/shop': 1,
        '/menu': 0,
        '/contact': 0,
        '/careers': 180,
        '/privacy': 1,
        '/product/:handle': 1,
      }

      const threshold = scrollThresholds[pathname] || 0;
      setColourOnScroll(threshold)
    };

    useEffect(() => {
      // Called to open and close hamburger menu
      close();

      // call event listener and return the removal of event
      changeColourOnScroll();
      window.addEventListener('scroll', changeColourOnScroll);

      return () => {
        window.removeEventListener('scroll', changeColourOnScroll);
      }
      // for useEffect to activate everytime the pathname changes
    },[pathname]);

  return (
    <>
      <button
        className={`nav-list-mobile ${colourOnScroll ? 'nav-list-mobile-white nav-list-mobile-black' : 'nav-list-mobile-white'}`}
        onClick={() => (menuOpen ? close() : open())} 
      >
        <input name='menu' type='checkbox' />
          <span></span>
          <span></span>
          <span></span>
      </button>
      
      <AnimatePresence>
        {menuOpen && <MobileMenu menuOpen={menuOpen} handleClose={close}/>}
      </AnimatePresence>
    </>
  )
}

export default MobileNav