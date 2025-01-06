import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { fetchProducts } from '../../../../../server/api/shopify/products.mjs';
import { AnimatePresence } from 'framer-motion';
import ProductPreview from './ProductPreview';
import Loader from './Loader';

const Products = ({ addToCart }) => {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  // State for popup/preview of product
  const [selectedProduct, setSelectedProduct] = useState(null);

  // handles for opening and closing preview of product
  const handleOpenModal = (handle) => setSelectedProduct(handle);
  const handleCloseModal = () => setSelectedProduct(null)

  useEffect(() => {
    // calls close of handle modal
    handleCloseModal();

    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProductsList(data);
      } catch (error) {
        console.error("Error fetching product list:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

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
            <Link to={`/product/${node.handle}`}>
              {node.images.edges.length > 0 && (
                <img 
                  src={node.images.edges[0].node.src} 
                  alt={node.title} 
                  width={300}
                  loading='eager'
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