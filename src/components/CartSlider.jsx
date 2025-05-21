import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';

const CartSlider = ({ data }) => {
  console.log('CartSlider data:', data);
  if (!data) return null;
  return (
    <div className='cart-slider'>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={2}
        loop={true}
        autoplay={{ delay: 3000 }}
        lazyPreloadPrevNext={false}
      >
        {Array.isArray(data.products) &&
          data.products.map(({ node }) => (
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
                    className='cart-slide swiper-lazy'
                    data-src={node.images.edges[0].node.src}
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