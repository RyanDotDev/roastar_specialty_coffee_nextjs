import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import gsap from 'gsap';

const Backdrop = forwardRef(({ children }, ref) => {
  const backdropRef = useRef(null);

  useImperativeHandle(ref, () => ({
    playEnter: () => {
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    },
    playExit: (onComplete) => {
      gsap.to(backdropRef.current,
        { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete }
      );
    },
    killExit: () => {
      gsap.killTweensOf(backdropRef.current);
      gsap.set(backdropRef.current, { clearProps: 'all' });
    }
  }));

  return (
    <div 
      ref={backdropRef}
      className='mobile-backdrop no-scroll' 
    >
      {children}
    </div>
  )
})

Backdrop.displayName = 'Backdrop';

export default Backdrop