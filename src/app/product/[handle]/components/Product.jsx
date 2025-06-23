"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { showErrorToast } from '@/lib/utils/toasts/toast';
import { Minus, Plus, ChevronLeft } from 'lucide-react';
import RelatedProducts from './RelatedProducts';

const Product = ({ product, relatedProducts, html }) => {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({}); 
  const [counter, setCounter] = useState(1);

  useEffect(() => { 
    const firstAvailableVariant = product.variants.edges.find(({ node }) => node.availableForSale)?.node;
    setSelectedVariant(firstAvailableVariant || null)
    document.body.style.backgroundColor = 'var(--main-green)';
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [product]);

  const handleVariantChange = (option, value) => {
    const updatedOptions = { ...selectedOptions, [option]: value };
    setSelectedOptions(updatedOptions);
    // Finds a matching variant based on the updated selected options
    const matchingVariant = product.variants.edges.find(({ node }) => 
      node.availableForSale &&
      node.selectedOptions.every(
        (({ name, value }) => updatedOptions[name] === value)
      )
    );
    setSelectedVariant(matchingVariant ? matchingVariant.node : null)
  };

  const getAvailableOptions = (currentOptionName) => {
    if (!product || !product.variants) return [];
    // filter variants matching the currently selected options (excluding current option)
    const validVariants = product.variants.edges.filter(({ node }) =>
      node.availableForSale &&
      node.selectedOptions.every(({ name, value }) => 
        name === currentOptionName || !selectedOptions[name] || selectedOptions[name] === value
      )
    );
    const availableValues = validVariants.map(({ node }) => 
      node.selectedOptions.find(({ name }) => name === currentOptionName)?.value
    )
    // Extract unique values for the specified option name
    return [...new Set(availableValues)];
  };

  const maxQuantity = 99;

  // Count functions for increasing or decreasing quantity
  const handleClickPlus = () => {
    if (counter < maxQuantity) {
      setCounter(counter + 1)
    }
  }
  const handleClickMinus = () => {
    setCounter(counter => Math.max(counter - 1, 1))
  }

  const handleAddToCart = () => {
    const unselectedOption = product.options.find(
      (option) => !selectedOptions[option.name]
    );
    if (unselectedOption) {
      showErrorToast(`Please choose a ${unselectedOption.name.toLowerCase()}`);
      return
    }
    if (!selectedVariant) {
      showErrorToast("The selected variant is unavailable. Please choose valid options.");
      return // Stop execution if no valid variant is selected
    }

    /* Max cart item variable and "Add To Cart" cart logic */
    const maxCartItems = 50;
    const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
    if (totalItemsInCart + counter > maxCartItems) {
      showErrorToast(`You can only add up to ${maxCartItems} items to your cart.`);
      return;
    }

    if (selectedVariant && product) {
      addToCart({
        id: selectedVariant.id,
        title: product.title,
        variant: selectedVariant.title,
        price: discountedPrice,
        quantity: counter,
        image: productImage,
        handle: product.handle,
      });
    };
  };

  /* Variant image change logic (if applicable) */
  const variantImage = selectedVariant?.image?.src;
  const originalImage = product.images.edges[0]?.node?.src;

  const productImage = variantImage ?? originalImage;

  /*
  * Discount Logic */
  // Product Discount
  const productDiscount = product?.metafield?.value
    ? parseFloat(product.metafield.value)
    : null;

  // Variant Discount
  const variantDiscount = selectedVariant?.metafield 
    ? parseFloat(selectedVariant.metafield.value) 
    : null;

  const price = selectedVariant && selectedVariant.priceV2.amount
    ? parseFloat(selectedVariant.priceV2.amount) 
    : product.variants.edges[0]
      ? parseFloat(product.variants.edges[0].node.priceV2.amount)
      : 0;
  
  const discount = variantDiscount ?? productDiscount;

  const discountedPrice = discount
    ? (price * (1 - discount / 100)).toFixed(2)
    : price.toFixed(2);

  const originalPrice = discount ? price.toFixed(2) : null;

  return (
    <div className='product-page-background'>
      <div className='product-page-container'>
        <Link href='/shop'>
          <ChevronLeft style={{ position: 'relative', top: '0.45rem', color: 'white' }}/><h5>BACK TO SHOP</h5>
        </Link>
        <div className='product-content'>
          <h1>{product.title}</h1>
          <div className='product-main'>

            {/* PRODUCT IMAGE */}
            <Image
              src={productImage} 
              alt={`${product.title} ${selectedVariant?.title || ''}`} 
              width={600}
              height={550}
              className='product-img'
              priority
            />

            <div className='product-details'>
              {/* PRODUCT DETAILS */}
              <div className='product-desc' dangerouslySetInnerHTML={{ __html: html }} />
             
              {/* PRODUCT PRICE */}
              {originalPrice && (
                <h3 style={{ textDecoration: 'line-through', color: 'rgb(255, 255, 255, 0.5)' }}>
                 £{originalPrice}
                </h3>
              )}

              <h2 style={originalPrice ? { color: 'white' } : {}}>
                £{discountedPrice}
                 {originalPrice && (
                   <span style={{ marginLeft: '8px', fontSize: '0.9rem', color: 'var(--main-beige)' }}>
                     ({discount}% off)
                   </span>
                 )}
              </h2>

              {/* STOCK AVAILABILITY */}
              {product.totalInventory === 0 && <h3 style={{ color: 'white', letterSpacing: '1.5px'}}>SOLD OUT</h3>}
              
              {/* QUANTITY/AMOUNT */}
              <div className={product.totalInventory === 0 ? 'product-quantity disabled' : 'product-quantity'}>
                <button className='product-quantity-minus' onClick={handleClickMinus}>
                  <Minus size={15}/>
                </button>
                  <p>{counter}</p>
                <button className='product-quantity-plus' onClick={handleClickPlus}>
                  <Plus size={15}/>
                </button>
              </div>

              {/* CHOICE OF TYPE(GRIND) */}
              <div className={`product-coffee-grind ${
                  product.options.length === 1 ? 'single-variant' : ''
                }`}
              >
                {product.options.map((option, index) => (
                  <div key={index} className={`variant-dropdown ${
                    product.options.length === 1 
                      ? 'variant-full-width' 
                      : index === 2
                      ? 'variant-full-width' 
                      : 'variant-half-width'
                    }`}
                  >
                    <select
                      id={`variant-option-${index}`}
                      value={selectedOptions[option.name] || ''}
                      name='option'
                      onChange={(e) => handleVariantChange(option.name, e.target.value)}
                      disabled={product.totalInventory === 0}
                    >
                      <option value='' disabled>
                        SELECT {option.name.toUpperCase()}
                      </option>
                      {Array.from(new Set(option.values)).map((value, index) => {
                        // Check if this value is available
                        const isAvailable = getAvailableOptions(option.name).includes(value);
                        return (
                          <option key={`${option.name}-${value}-${index}`} value={value} disabled={!isAvailable}>
                            {value.toUpperCase()}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ))}
              </div>

              {/* ADD TO CART/CHECKOUT */}
              <button 
                onClick={handleAddToCart}
                className='add-to-cart'
                disabled={product.totalInventory === 0}
                aria-label="Add this product to the cart"
              >
                ADD TO CART
              </button>

              {/* DELIVERY & SHIPPING INFORMATION */}
              <div className='product-delivery-info'>
                <h2>DELIVERY & SHIPPING</h2>
                <p style={{ color: 'white', marginTop: '1rem'}}>Shipping is processed within 24 hours and we aim to deliver between 3 - 5 days.</p>
                <p style={{ color: 'white', marginTop: '1rem' }}>Free delivery for orders above £25.</p>
              </div>
            </div>
          </div>

          {/* RELATED PRODUCTS*/}
          <h2 className='related-product-title'>OTHER PRODUCTS</h2>
          <RelatedProducts 
            relatedProducts={relatedProducts} 
            product={product}
          />
        </div>
      </div>
    </div>
  )
}

export default Product;
