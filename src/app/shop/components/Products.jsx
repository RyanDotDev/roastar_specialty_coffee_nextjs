"use client"
import React, { useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence } from 'framer-motion';
import ProductPreview from './ProductPreview';
import Loader from './Loader';

const Products = ({ addToCart }) => {
  const [productsList, setProductsList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  // handles for opening and closing preview of product
  const handleOpenModal = (handle) => setSelectedProduct(handle);
  const handleCloseModal = () => setSelectedProduct(null)

  useEffect(() => {
    handleCloseModal();
    const getProducts = async () => {
      try {
        const response = await fetch('/api/shopify/products', { cache: 'no-cache' })
        if (!response.ok) throw new Error('Failed to fetch products'); // Check the data structure here
        const data = await response.json()
        setProductsList(data.products || [])
      } catch (error) {
        console.error("Error fetching product list:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // prevent scroll when popup is active
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const htmlElement = document.documentElement;
      if (selectedProduct) {
        htmlElement.classList.add('no-scroll');
      } else {
        htmlElement.classList.remove('no-scroll');
      }
        return () => {
          htmlElement.classList.remove('no-scroll')
        }
      };
    }, [selectedProduct]);

  if (loading) return <Loader />

  return (
    <div className="product-container">
      <div className='product-grid'>
      {
        productsList.map(({ node }) => (
          <div
            className='product-card' 
            key={node.id}
          >
            {/* Ensure the link is by handle */}
            <Link href={`/product/${node.handle}`}>
              {node.images.edges.length > 0 && (
                <Image 
                  src={node.images.edges[0].node.src} 
                  alt={node.title} 
                  width={300}
                  height={250}
                  loading='eager'
                  priority
                />
              )}
              <h2>{node.title}</h2>
              <div className='view-product'> 
                {/* PREVIEW BUTTON OF PRODUCT DESKTOP/LAPTOP */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenModal(node.handle)
                  }} 
                  type='button'
                  className='product-view'
                >
                  PRODUCT PREVIEW
                </button>
              </div>
              <p>£{`${parseFloat(node.variants.edges[0].node.priceV2.amount).toFixed(2)}`}</p>
              {/* Renders "SOLD OUT" label if totalInventory is 0 */}
              {node.totalInventory === 0 && <p>SOLD OUT</p>}
              {/* PREVIEW BUTTON OF PRODUCT FOR TABLET/MOBILE ONLY */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenModal(node.handle)
                }} 
                type='button'
                className='pro'
              >
                PRODUCT PREVIEW
              </button>
            </Link>
          </div>
        ))
      }
      <AnimatePresence>
        {selectedProduct && (
          <ProductPreview 
            handle={selectedProduct}
            handleClose={handleCloseModal}
            addToCart={addToCart}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}

export default Products