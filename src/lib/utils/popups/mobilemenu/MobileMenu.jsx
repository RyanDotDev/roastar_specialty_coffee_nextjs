import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Backdrop from './Backdrop';
import Image from 'next/image';
import gsap from 'gsap';

const navigation = [ 
    { _id:101, title: 'HOME', href: '/' },
    { _id:102, title: 'ABOUT US', href: '/about' },
    { _id:103, title: 'SHOP', href: '/shop' },
    { _id:104, title: 'MENU', href: '/menu' },
    { _id:105, title: 'CONTACT US', href: '/contact' },
    { _id:106, title: 'CAREERS', href: '/careers' },
  ];

const MobileMenu = forwardRef((props, ref) => {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const backdropRef = useRef(null);
  const timeline = useRef(null);

  const refreshPage = (href) => {
    window.location.assign(href);
  }

  useImperativeHandle(ref, () => ({
    playEnter: () => {
      backdropRef.current?.playEnter?.();

      timeline.current = gsap.timeline();
      timeline.current.fromTo(containerRef.current,
        { y: '100vh', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }
      );
    },
    playExit: (onComplete) => {
      backdropRef.current?.playExit(() => {
        gsap.to(containerRef.current, {
          y: '100%',
          opacity: 0,
          duration: 0.65,
          ease: 'power3.inOut',
          onComplete: () => {
            backdropRef.current?.playExit(onComplete);
          }
        });
      });
    },
    killExit: () => {
      gsap.killTweensOf(containerRef.current);
      gsap.set(containerRef.current, { clearProps: 'all' });
      backdropRef.current?.killExit?.();
    }
  }));
  
  return (
    <Backdrop ref={backdropRef} onClick={() => ref?.current?.playExit(() => props.handleClose?.())}>
      <Link 
        href='/'
        onClick={() => refreshPage('/')}
      >
        <div className='roastar-logo-mobile-daytime'>
          <Image 
            src='/logo/Logo-ROASTAR-black.webp'
            alt='Roastar Logo Mobile Daytime'
            height={50}
            width={150}
            loading='lazy'
          />
        </div>
        <div className='roastar-logo-mobile-nighttime'>
          <Image 
            src='/logo/Logo-ROASTAR-white.webp'
            alt='Roastar Logo Mobile Daytime'
            height={50}
            width={150}
            loading='lazy'
          />
        </div>
      </Link>
      <div
        ref={containerRef}
        className='mobile-nav'
        onClick={(e) => e.stopPropagation()}  
      >
        <ul className='mobile-nav-list'>
          {
            navigation.map((item) => (
              <Link 
                href={item?.href} 
                key={item._id} 
                onClick={() => refreshPage(item?.href)}
                className={`${item?.href === pathname && 'active'}`}
              >
                <li className={`${item?.href === pathname ? 'nav-list-black active' : 'nav-list-black'}`}> 
                  {item?.title}
                </li>
              </Link>
            ))
          }
        </ul>
      </div>
    </Backdrop>
  )
})

export default MobileMenu