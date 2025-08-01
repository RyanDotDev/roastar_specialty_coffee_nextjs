import React, { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import Link from 'next/link';
import Backdrop from './Backdrop';
import gsap from 'gsap';

const ZeroStockModal = forwardRef(({ handleClose }, ref) => {
  const backdropRef = useRef(null);
  const containerRef = useRef(null);
  const timeline = useRef(null)

  useImperativeHandle(ref, () => ({
    playEnter: () => {
      console.log('▶️ Playing modal enter animation');
      backdropRef.current?.playEnter?.();

      timeline.current = gsap.timeline();
      timeline.current.fromTo(containerRef.current,
        { y: 0, opacity: 0 },
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

  useEffect(() => {
    console.log('✅ ZeroStockModal mounted');
  }, []);

  return (
    <Backdrop ref={backdropRef}>
      <div 
        className='zero-stock-modal-container'
        ref={containerRef}
      >
        <div className='zero-stock-modal-content'>
          <p>Sorry, one of your items is no longer available.</p>
          <Link href='/shop'>
            <button>
              BACK TO SHOP
            </button>
          </Link>
        </div>
      </div>
    </Backdrop>
  )
})

ZeroStockModal.displayName = 'ZeroStockModal';

export default ZeroStockModal