"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence } from 'framer-motion';
import ProductPreview from './ProductPreview';
import Loader from './Loader';

const Products = ({ products = [], error: serverError, addToCart }) => {
  const [productsList, setProductsList] = useState(products);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(serverError || null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // handles for opening and closing preview of product
  const handleOpenModal = (handle) => setSelectedProduct(handle);
  const handleCloseModal = () => setSelectedProduct(null)

  useEffect(() => {
    setProductsList(products);
  }, [products]);

  // Scroll and background color logic
  useEffect(() => {
    handleCloseModal();
    const originalBackgroundColor = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'var(--main-green)';
    return () => {
      document.body.style.backgroundColor = originalBackgroundColor;
    };
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
  if (!productsList) {
    return <div className='products-not-found'><p>{error}</p></div>
  }

  return (
    <div className="product-container">
      <div className='product-grid'>
      {
        productsList.map(({ node }) => {
          const discount = node?.metafield?.value
            ? parseFloat(node.metafield.value)
            : null;
  
          const price = node.variants.edges[0].node.price.amount
            ? parseFloat(node.variants.edges[0].node.price.amount)
            : node.variants.edges[0]
              ? parseFloat(node.variants.edges[0].node.price.amount)
              : 0;
  
          const discountedPrice = discount
            ? (price * (1 - discount / 100)).toFixed(2)
            : price.toFixed(2);

          const originalPrice = discount ? price.toFixed(2) : null;

          return (
          <div
            className='product-card' 
            key={node.id}
          >
            {/* Link to product page */}
            <Link href={`/product/${node.handle}`}>
              {node.images.edges.length > 0 && (
                <Image 
                  src={node.images.edges[0].node.url} 
                  alt={node.title} 
                  width={250}
                  height={250}
                  priority
                />
              )}

              {/* PRODUCT TITLE */}
              <h2>{node.title}</h2>
              <div className='view-product'> 

                {/* PREVIEW BUTTON OF PRODUCT DESKTOP/LAPTOP */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenModal(node.handle)
                  }} 
                  type='button'
                  className='product-preview-button'
                >
                  PRODUCT PREVIEW
                </button>
              </div>

              {/* PRODUCT PRICING */}
              <div className='product-pricing'>
                {originalPrice && (
                  <p style={{ textDecoration: 'line-through', color: 'black'}}>
                   £{originalPrice}
                  </p>
                )}
                {/* SALE PRICE */}
                <p style={ originalPrice ? { color: 'crimson' }: {}}>
                  £{discountedPrice}
                </p>
              </div>

              {/* Renders "SOLD OUT" label if totalInventory is 0 */}
              {node.totalInventory === 0 && <p>SOLD OUT</p>}

              {/* PREVIEW BUTTON OF PRODUCT FOR TABLET/MOBILE ONLY */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenModal(node.handle)
                }} 
                type='button'
                className='product-preview-mobile-button'
              >
                PRODUCT PREVIEW
              </button>
            </Link>
          </div>
        )}
      )}

      {/* LOGIC FOR PRODUCT MODAL */}
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