"use client"
import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"

const Banner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const timeoutRef = useRef();
  const hasMounted = useRef(false);

  const slideStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transition: "opacity 1s ease-in-out",
    willChange: "opacity",
    pointerEvents: "none",
  }

  const bgImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  }

  useEffect(() => {
    hasMounted.current = true
    timeoutRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(timeoutRef.current)
  }, [])

  return (
    <div className="banner">
      {/* SLIDE ONE */}
      <div
        className="slide slide-one"
        style={{
          ...slideStyle,
          opacity: activeSlide === 0 ? 1 : 0,
          transition: hasMounted.current ? "opacity 1s ease-in-out" : "none"
        }}
      >
        {/* Logo + Text */}
        <div className='slider-one-container'>
          <Image
            className="slider-one-image"
            alt="Roastar Vietnamese Logo"
            width={500}
            height={180}
            src="/logo/Logo-ROASTAR-white.webp"
            priority
          />
          <h2 className="slider-one-text" style={{ position: "absolute", zIndex: 3 }}>Welcome!</h2>
        </div>

        {/* Background */}
        <Image
          className="slider-one"
          src="/slides/slider-one.webp"
          alt="slider_one"
          height={720}
          width={1440}
          style={{ ...bgImageStyle }}
          priority
        />
      </div>

      {/* SLIDE TWO */}
      <div
        className="slide slide-two"
        style={{
          ...slideStyle,
          opacity: activeSlide === 1 ? 1 : 0,
          zIndex: activeSlide === 1 ? 2 : 1,
        }}
      >
        <div className="slider-two-container">
          <h1 className="slider-two-header">
            COCONUT <span>COFFEE</span>
          </h1>
          <h2 className="slider-two-text">Specially made with Vietnamese "Phin" brewed coffee.</h2>
        </div>
        <Image
          className="slider-two"
          src="/images/roastar_coconut_coffee_photo.webp"
          alt="slider_two"
          height={720}
          width={1440}
          style={{ ...bgImageStyle }}
          loading='lazy'
        />
      </div>

      {/* SLIDE THREE */}
      <div
        className="slide slide-three"
        style={{
          ...slideStyle,
          opacity: activeSlide === 2 ? 1 : 0,
          zIndex: activeSlide === 2 ? 2 : 1,
        }}
      >
        <div className="slider-three-container">
          <h1 className="slider-three-header">ENJOY OUR SERVICE</h1>
          <h2 className="slider-three-text">Eat, drink, chat and enjoy yourselves and our service.</h2>
        </div>
        <Image
          className="slider-three"
          src="/images/roastar_social_image.webp"
          alt="slider_three"
          height={720}
          width={1440}
          style={{ ...bgImageStyle }}
          loading='lazy'
        />
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`dot ${activeSlide === index ? "active-slide" : ""}`}
            onClick={() => setActiveSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default Banner