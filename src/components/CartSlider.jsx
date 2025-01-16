import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';

const CartSlider = ({ initialProducts = [] }) => {
  const [products, setProducts] = React.useState(initialProducts);
  const [loading, setLoading] = React.useState(!initialProducts.length);

  useEffect(() => {
    if (products.length > 0) return;
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
      };
      getProducts();
  }, [initialProducts, products])

  if (loading) {
    return (
      <div className="cart-slider-skeleton">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    )
  }
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
        {products.map(({ node }, index) => (
          <SwiperSlide 
            key={node.id} 
            className='cart-track' 
            style={{ textAlign: 'center'}}
          >
            <Link href={`/product/${node.handle}`} style={{ textDecoration: 'none', color: 'black' }}>
              {node.images.edges.length > 0 && (
                <Image 
                  src={`${node.images.edges[0].node.src}?width=150&height=130`}
                  alt={node.title}
                  width={150}
                  height={130}
                  className='cart-slide swiper-lazy'
                  loading={index < 2 ? 'eager' : 'lazy'}
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