import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation';
import MobileMenu from '@/utils/popups/mobilemenu/MobileMenu';

const MobileNav = () => {
    const [colourOnScroll, setColourOnScroll] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef(null);

    const open = () => setMenuOpen(true);
    const close = () => {
      if (menuRef.current) {
        menuRef.current.playExit(() => setMenuOpen(false))
      } else {
        setMenuOpen(false);
      }
    }

    useEffect(() => {
      close();
      const changeColourOnScroll = () => {
        const scrollThresholds = {
          '/': 650,
          '/about': 1,
          '/shop': 1,
          '/menu': 1,
          '/contact': 1,
          '/careers': 1,
          '/privacy': 1,
          '/product/:handle': 1,
          '/coming-soon': 700,
        };

        let threshold
          if (pathname.startsWith('/product/')) {
            threshold = 1;
          } else {
            threshold = scrollThresholds[pathname] || 0;
          }
        setColourOnScroll(window.scrollY >= threshold);
      }
      changeColourOnScroll();
      window.addEventListener('scroll', changeColourOnScroll);

      return () => {
        window.removeEventListener('scroll', changeColourOnScroll);
      }
      // for useEffect to activate everytime the pathname changes
    },[pathname]);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const htmlElement = document.documentElement
        if (menuOpen) {
          htmlElement.classList.add('no-scroll')
        } else {
          htmlElement.classList.remove('no-scroll')
        }
        return () => {
          htmlElement.classList.remove('no-scroll')
        }
      }
    }, [menuOpen])

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

      {menuOpen && <MobileMenu ref={menuRef} handleClose={close} />}
    </>
  )
}

export default MobileNav