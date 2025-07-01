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
      const stripePriceId = selectedVariant?.stripeDiscount?.value || selectedVariant?.stripe?.value;
      addToCart({
        id: selectedVariant.id,
        title: product.title,
        variant: selectedVariant.title,
        price: discountedPrice,
        quantity: counter,
        image: productImage,
        handle: product.handle,
        stripe_price_id: stripePriceId,
      });
    };
  };

  console.log('selectedVariant:', selectedVariant);
console.log('stripeDiscount:', selectedVariant?.stripeDiscount);
console.log('stripe:', selectedVariant?.stripe);
console.log('stripePriceId:', stripePriceId);

  /* Variant image change logic (if applicable) */
  const variantImage = selectedVariant?.image?.url;
  const originalImage = product.images.edges[0]?.node?.url;

  const productImage = variantImage ?? originalImage;

  /*
  * Discount Logic */
  // Filters out the available variants
  const availableVariants = product.variants.edges
    .map(edge => edge.node)
    .filter(variant => variant.availableForSale); // or your stock check

  // Finds the discounted variants
  const discountedVariants = availableVariants.filter(variant => {
    const price = parseFloat(variant.price.amount);
    const comparedAtPrice = variant.compareAtPrice?.amount
      ? parseFloat(variant.compareAtPrice.amount)
      : null;
    return comparedAtPrice && comparedAtPrice > price;
  })

  const nonDiscountedVariants = availableVariants.filter(variant => {
    const price = parseFloat(variant.price.amount);
    const comparedAtPrice = variant.compareAtPrice?.amount
      ? parseFloat(variant.compareAtPrice.amount)
      : null;
    return !(comparedAtPrice && comparedAtPrice > price);
  })

  // Chooses fallback variant:
  // If discountedVariant exists, use it
  // Else fallback to first available variant (non-discounted)
  const fallbackVariant = nonDiscountedVariants[0] || discountedVariants[0] || null;

  // Uses selectedVariant if fully chosen, other reverts back to fallbackVariant
  const chosenVariant = selectedVariant || fallbackVariant;

  // Parses price string to number, or defaults to 0 to avoid errors if missing
  const price = chosenVariant?.price?.amount
    ? parseFloat(chosenVariant.price.amount)
    : 0;
  // Parses comparedToPrice string to number, or defaults to 0 to avoid errors if missing
  const comparedAtPrice = chosenVariant?.compareAtPrice?.amount
    ? parseFloat(chosenVariant.compareAtPrice.amount)
    : null;

  // Calculates discount percentage if comparedAtPrice > price to ensure it is a real discount, not price increase.
  const isDiscounted = comparedAtPrice && comparedAtPrice > price;
  const discountPercentage =
    comparedAtPrice && comparedAtPrice > price
    ? Math.round(((comparedAtPrice - price) / comparedAtPrice) * 100)
    : null;

  // Uses discount only if selectedVariant is fully chosen which helps prevent early price changes and confusing UI
  const discount = 
    selectedVariant 
      ? (isDiscounted ? discountPercentage : null)
      : (fallbackVariant === chosenVariant && isDiscounted ? discountPercentage : null)

  // Formats the prices for display
  const discountedPrice = price.toFixed(2);
  const originalPrice = discount ? comparedAtPrice.toFixed(2) : null;

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
                      {Array.from(new Set(option.optionValues)).map((v, index) => {
                        const value = v.name;
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
