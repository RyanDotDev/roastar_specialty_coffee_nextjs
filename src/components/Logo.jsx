import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Logo = () => {
  const [logoOnScroll, setLogoOnScroll] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const changeLogoOnScroll = () => {
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

      let threshold
      if (pathname.startsWith('/product/')) {
        threshold = 1
      } else {
        threshold = scrollThresholds[pathname] || 0;
      }
      setLogoOnScroll(window.scrollY >= threshold)
    }
    changeLogoOnScroll();
    window.addEventListener('scroll', changeLogoOnScroll);

    return () => {
      window.removeEventListener('scroll', changeLogoOnScroll)
    }
  }, [pathname])
  
  return (
    <>
      <div className="logo">
        <Link href='/'>
          {/* LOGO HOVER EFFECT (DAYTIME) */}
          <Image
            src={logoOnScroll ? "/logo/Logo Roastar-green.webp" : "/logo/Logo ROASTAR-beige.webp"}
            alt="Roastar Logo Hover"
            className='roastar-logo-hover'
            height={50}
            width={150}
            priority
          />
          {/* DAYTIME LOGO */}
          <Image 
            src="/logo/Logo ROASTAR-white.webp"
            alt="Roastar Logo Daytime"
            className={`roastar-logo-daytime ${logoOnScroll ? 'logo-active' : ''}`}
            height={50}
            width={150} 
            priority
          />
          {/* NIGHTTIME LOGO / prefers-colors-scheme: dark */}
          <Image
            src="/logo/Logo ROASTAR-white.webp"
            alt="Roastar Logo Nighttime"
            className={`roastar-logo-nighttime ${logoOnScroll ? 'logo-active' : ''}`}
            height={50}
            width={150}  
            priority
          />
        </Link>
      </div>
    </>
  )
}

export default Logo