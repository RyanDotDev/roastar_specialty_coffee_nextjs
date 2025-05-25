import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import gsap from 'gsap';

const Backdrop = forwardRef(({ children, onClick }, ref) => {
  const backdropRef = useRef(null);

  useImperativeHandle(ref, () => ({
    playEnter: () => {
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    },
    playExit: (onComplete) => {
      gsap.to(backdropRef.current,
        { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete }
      );
    }
  }));

  return (
    <div 
      ref={backdropRef}
      onClick={onClick}
      className='mobile-backdrop no-scroll' 
    >
      {children}
    </div>
  )
})

Backdrop.displayName = 'Backdrop';

export default Backdrop