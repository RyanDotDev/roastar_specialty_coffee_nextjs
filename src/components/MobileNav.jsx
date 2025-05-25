import React, { useState, useEffect, useRef } from 'react';
import { Sling as Hamburger } from 'hamburger-react';
import { usePathname } from 'next/navigation';
import MobileMenu from '@/utils/popups/mobilemenu/MobileMenu';

const MobileNav = () => {
    const [colourOnScroll, setColourOnScroll] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef(null);

    const open = () => {
      if (menuRef.current) {
        menuRef.current.killExit?.(); // kill closing animation if running
      }
      setIsClosing(false);
      setMenuOpen(true);
      document.documentElement.classList.add('no-scroll');

      setTimeout(() => {
        menuRef.current?.playEnter?.();
      }, 0);
    }

    const close = () => {
      if (menuRef.current) {
        setIsAnimating(true)
        setIsClosing(true);            // Start closing animation
        setMenuOpen(false);            // Toggle hamburger immediately off
        document.documentElement.classList.remove('no-scroll');

        menuRef.current.playExit(() => {
          setIsClosing(false);
          setIsAnimating(false);         // After animation, finally unmount menu
        });
      } else {
        setMenuOpen(false);
        document.documentElement.classList.remove('no-scroll');
        setIsAnimating(false);
      }
    }

    const toggleMenu = () => {
      if (isAnimating) return;
      if (menuOpen) {
        close();
      } else {
        open();
      }
    };

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
      if (menuOpen) {
        document.documentElement.classList.add('no-scroll');
      }
    }, [menuOpen])

  return (
    <>
      <div className='nav-list-mobile hamburger'>
        <Hamburger
          onClick={toggleMenu} 
          toggled={menuOpen}
          toggle={menuOpen ? close : open}
          size={24}
          duration={0.5}
          color={menuOpen ? '#000' : (colourOnScroll ? '#000' : '#fff')}
          className='hamburger-menu'
        />
      </div>
      {(menuOpen || isClosing) && (
        <MobileMenu ref={menuRef} handleClose={close} />
      )}
    </>
  )
}

export default MobileNav