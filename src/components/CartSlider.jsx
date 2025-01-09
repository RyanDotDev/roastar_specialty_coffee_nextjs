import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react'
/* import Loader from '../pages/Shop/components/Loader'; */
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';

const CartSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch('/api/shopify/cart-slider')
        if (!response.ok) throw new Error('Failed to fetch products'); // Check the data structure here
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, [])
  
  if (loading) return 

  return (
    <div className='cart-slider'>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={2}
        loop={true}
        autoplay={{ delay: 3000 }}
      >
        {products.map(({ node }, index) => (
          <SwiperSlide 
            key={node.id} 
            className='cart-track' 
            style={{ textAlign: 'center'}}
          >
            <Link href={`/product/${node.handle}`} style={{ textDecoration: 'none', color: 'black' }}>
              {node.images.edges.length > 0 && (
                <Image 
                  src={node.images.edges[0].node.src}
                  alt={node.title}
                  width={150}
                  height={130}
                  className='cart-slide'
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
              )}
              <p>{node.title}</p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default CartSlider