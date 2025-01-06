import React, { useState, useEffect } from 'react'

const Banner = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner">
      {/* SLIDE ONE */}
      <div
        className={`slide ${activeSlide === 0 ? '' : ''}`}
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          opacity: activeSlide === 0 ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      >
        {/* SLIDER ONE IMAGE */}
        <img 
          className='slider-one-image'
          style={{ position: 'absolute', zIndex: 2 }} 
          src='/logo/Logo ROASTAR-white.webp'
          loading='eager'
        />
        {/* SLIDER ONE TEXT*/}
        <h2 className='slider-one-text' style={{ position: 'absolute', zIndex: 2 }}>Welcome to our shop!</h2>
        {/* SLIDER ONE BACKGROUND */}
        <div style={{ zIndex: 1 }}>
          <img
            className='slider-one'
            src='/slides/slider-one.webp'
            alt='slider_one'
            height={720}
            width={1440}
            loading='eager'
            style={{ width: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
      {/* SLIDE TWO */}
      <div
        className={`slide ${activeSlide === 1 ? '' : ''}`}
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          opacity: activeSlide === 1 ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      >
        {/* SLIDE TWO TEXT */}
        <h1 className='slider-two-header' style={{ position: 'absolute', zIndex: 2 }}>COCONUT COFFEE</h1>
        <h2 className='slider-two-text' style={{ position: 'absolute', zIndex: 2 }}>
          Try our coconut coffee! One of our most beloved.
        </h2>
        {/* SLIDE TWO BACKGROUND */}
        <div style={{ zIndex: 1 }}>
          <img
            className='slider-two'
            src='/slides/slider-two.webp'
            alt='slider_two'
            height={720}
            width={1440}
            loading='lazy'
            style={{ width: '100%', objectFit: 'cover', }}
          />
        </div>
      </div>
      {/* SLIDE THREE */}
      <div
        className={`slide ${activeSlide === 2 ? '' : ''}`}
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          opacity: activeSlide === 2 ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      >
        {/* SLIDE TWO TEXT */}
        <h1 className='slider-three-header' style={{ position: 'absolute', zIndex: 2 }}>ENJOY OUR SERVICE</h1>
        <h2 className='slider-three-text' style={{ position: 'absolute', zIndex: 2 }}>
          Eat, drink, chat and enjoy yourselves and our service.
        </h2>
        <img
          className='slider-three'
          src='/images/roastar_social_image.webp'
          alt='slider_three'
          height={720}
          width={1440}
          loading='lazy'
          style={{ width: '100%', objectFit: 'cover', }}
        />
      </div>

      {/* PAGINATION */}
      <div className='pagination'>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`dot ${activeSlide === index ? 'active-slide' : ''}`}
            onClick={() => setActiveSlide(index)}
            style={{
              cursor: 'pointer',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              background: activeSlide === index ? 'white' : 'var(--main-green)',
              margin: '0 5px',
              zIndex: 3,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default Banner