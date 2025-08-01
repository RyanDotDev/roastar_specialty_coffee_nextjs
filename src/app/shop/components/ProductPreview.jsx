import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { motion } from 'framer-motion'
import { previewAnimate } from '@/utils/popups/product_preview/animation'
import Backdrop from '@/utils/popups/product_preview/Backdrop'
import { Plus, Minus, X } from 'lucide-react'
import { showErrorToast, showSuccessToast } from '@/lib/utils/toasts/toast'
import { useCartStore } from '@/store/cartStore';

const ProductPreview = ({ handle, handleClose }) => {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({})
  const [counter, setCounter] = useState(1);
  const [loading, setLoading] = useState(true);

  const productCache = new Map();  
  
  useEffect(() => {
    const getProduct = async () => {
      if (productCache.has(handle)) {
        setProduct(productCache.get(handle));
        return;
      }
      try {
        const res = await fetch(`/api/shopify/storefront/${handle}`, { 
          cache: 'no-store'
        });
        if (!res.ok) throw new Error ("Product not found or server error")
        const data = await res.json()
        productCache.set(handle, data);
        setProduct(data);
        // Automatically select the first available variant
        const firstAvailableVariant = data.variants.edges.find(
          ({ node }) => node.availableForSale
        )?.node;
        setSelectedVariant(firstAvailableVariant || null);
      } catch (error) {
        console.log("Failed to fetch product:", error)
      }
    }
    
    getProduct();
  }, [handle]);

  const handleCheckout = async () => {
    const unselectedOption = product.options.find(
      (option) => !selectedOptions[option.name]
    );

    if (unselectedOption) {
      showErrorToast(`Options must be selected before proceeding to checkout.`);
      return
    }

    if (!selectedVariant) {
      showErrorToast("The selected variant is unavailable. Please choose a valid option");
      return // Stop execution if no valid variant is selected
    }

    setLoading(true);

    try {
      const lineItems = { 
        title: product.title,
        variant: selectedVariant?.title,
        variantId: selectedVariant?.id,
        price: parseFloat(discountedPrice),
        quantity: counter,
        image: productImage,
      }

      const token = nanoid(40);

      const dataToStore = {
        token,
        product: lineItems,
      };

      localStorage.setItem('single-product-checkout', JSON.stringify(dataToStore));

      localStorage.setItem('previous-url', window.location.pathname);

      router.push(`/checkout?product-token=${token}`)
    } catch(error) {
      console.error("Checkout Error:", error.message || error);
      showErrorToast("Error creating checkout. Please try again later")
    } finally {
      setLoading(false);
    };
  };

  // Handle the variants/options avaivalbility  
  const handleVariantChange = (option, value) => {
    const updatedOptions = { ...selectedOptions, [option]: value };
    setSelectedOptions(updatedOptions);
    // Find a matching variant based on the updated selected options
    const matchingVariant = product.variants.edges.find(({ node }) => 
      node.availableForSale &&
      node.selectedOptions.every(
        (({ name, value }) => updatedOptions[name] === value)
      )
    );
    setSelectedVariant(matchingVariant ? matchingVariant.node : null)
  }

  const getAvailableOptions = (currentOptionName) => {
    if (!product || !product.variants) return [];

    // filter variants matching the currently selected options (excluding the current option)
    const validVariants = product.variants.edges.filter(({ node }) => 
      node.availableForSale &&
      node.selectedOptions.every(({ name, value }) => 
        name === currentOptionName || !selectedOptions[name] || selectedOptions[name] === value
      )
    );

    const availableValues = validVariants.map(({ node }) =>
      node.selectedOptions.find(({ name }) => name === currentOptionName)?.value
    );
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
    // Ensure selectVariant matches the current selection
    if (!selectedVariant) {
      showErrorToast("The selected variant is unavailable. Please choose a valid option");
      return // Stop execution if no valid variant is selected
    }

    const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

    const maxCartItems = 50;

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
        variant_id: selectedVariant.id,
        price: discountedPrice,
        quantity: counter,
        image: productImage,
        handle: product.handle,
        stripe_price_id: stripePriceId,
      });
      showSuccessToast('Item Added');
    }
  };

  if (!product) return <p></p>;

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
    <Backdrop>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className='product-preview-container'
        variants={previewAnimate}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        <button onClick={handleClose}>
          <X size={35} strokeWidth={1.5} />
        </button>
        <div className='product-preview-content'>

          {/* PRODUCT TITLE */}
          <h1>{product.title}</h1>
          <div className='product-preview-main'>

            {/* PRODUCT IMAGE */}
            <Image 
              src={productImage} 
              alt={`${product.title} ${selectedVariant?.title || ''}`}
              width={500}
              height={500}
              className='product-img'
              loading='lazy'
            />
           
            <div className='product-preview-details'>

              {/* PRODUCT PRICE */}
               {originalPrice && (
                <h3 style={{ textDecoration: 'line-through', color: '#ccc' }}>
                 £{originalPrice}
                </h3>
              )}

              <h2 className='product-preview-price' style={originalPrice ? { color: 'black' } : {}}>
                £{discountedPrice}
                 {originalPrice && (
                   <span 
                     style={{ 
                       marginLeft: '8px', 
                       fontSize: '0.9rem', 
                       fontWeight: '700', 
                       color: 'var(--main-green)',
                       letterSpacing: '0.5px' 
                     }}
                    >
                     ({discount}% off)
                   </span>
                 )}
              </h2>

              {product.totalInventory === 0 && <h3 style={{ color: 'black', letterSpacing: '1.5px' }}>SOLD OUT</h3>}

              {/* QUANTITY/AMOUNT */}
              <div className={product.totalInventory === 0 ? 'product-preview-quantity preview-disabled' : 'product-preview-quantity'}>
                <button className='product-preview-quantity-minus' onClick={handleClickMinus}><Minus size={15}/></button>
                  <p className='product-preview-quantity-amount'>{counter}</p>
                <button className='product-preview-quantity-plus' onClick={handleClickPlus}><Plus size={15}/></button>
              </div>

              {/* CHOICE OF VARIANT/OPTION */}
              <div className={`product-preview-coffee-grind ${
                product.options.length === 1 ? 'preview-single-variant' : ''
                }`}
              >
                {product.options.map((option, index) => (
                  <div key={index} className={`preview-variant-dropdown ${
                    product.options.length === 1
                      ? 'preview-variant-full-width'
                      : index === 2
                      ? 'preview-variant-full-width'
                      : 'preview-variant-half-width'
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
                      })};
                    </select>
                  </div>
                ))}
              </div>

              {/* ADD TO CART/CHECKOUT */}
              <button 
                onClick={handleAddToCart}
                className='product-add-to-cart'
                disabled={product.totalInventory === 0}
              >
                ADD TO CART
              </button>
              <button 
                onClick={handleCheckout}
                className='product-purchase'
                disabled={product.totalInventory === 0}
              >
                {loading ? 'CHECKOUT' : 'Processing...'}
              </button>
              <Link 
                className='view-details' 
                href={`/product/${handle}`}
              >
                VIEW DETAILS
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  )
}

export default ProductPreview;