import React, { useEffect } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { previewAnimate } from '@/utils/popups/product_preview/animation'
import { addToCart } from '@/store/state'
import Backdrop from '@/utils/popups/product_preview/Backdrop'
import { Plus, Minus, X } from 'lucide-react'
import { showErrorToast, showSuccessToast } from '@/lib/utils/toasts/toast'

const ProductPreview = ({ handle, handleClose }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch =  useDispatch();
  const [product, setProduct] = React.useState(null);
  const [selectedVariant, setSelectedVariant] = React.useState(null);
  const [selectedOptions, setSelectedOptions] = React.useState({})
  const [counter, setCounter] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`/api/shopify/${handle}`, { cache: 'no-cache'});
        if (!res.ok) throw new Error ("Product not found or server error")
        const data = await res.json()
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
    setLoading(true);
    const unselectedOption = product.options.find(
      (option) => !selectedOptions[option.name]
    );
    if (unselectedOption) {
      showErrorToast(`Please select options before proceeding to checkout.`);
      return
    }
    if (!selectedVariant) {
      showErrorToast("The selected variant is unavailable. Please choose a valid option");
      return // Stop execution if no valid variant is selected
    }
    try {
      const lineItems = [{ 
        merchandiseId: selectedVariant.id, 
        quantity: counter,
      }]
      console.log("Line items sent to Shopify:", lineItems);
      const response = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineItems })
      })
      if (!response) {
        throw new Error("Checkout URL is missing or invalid.")
      } 
      const { checkoutUrl } = await response.json();
      if (checkoutUrl) {
        console.log("Redirecting to checkout URL:", checkoutUrl);
        window.location.href = checkoutUrl;
      } else {
        showErrorToast("Failed to create checkout. Please try again")
      }
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

  // Count functions for increasing or decreasing quantity
  const handleClickPlus = () => {
    setCounter(counter + 1)
  }
  const handleClickMinus = () => {
    setCounter(counter => Math.max(counter - 1, 1))
  }

  const handleAddToCart = () => {
    const unselectedOption = product.options.find(
      (option) => !selectedOptions[option.name]
    );
    if (unselectedOption) {
      showErrorToast(`Please choose a ${unselectedOption.name.toLowerCase()} option`);
      return
    }
    // Ensure selectVariant matches the current selection
    if (!selectedVariant) {
      showErrorToast("The selected variant is unavailable. Please choose a valid option");
      return // Stop execution if no valid variant is selected
    }

    const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

    const maxCartItems = 10

    if (totalItemsInCart + counter > maxCartItems) {
      showErrorToast(`You can only add up to ${maxCartItems} items to your cart.`);
      return;
    }

    if (selectedVariant && product) {
      dispatch(addToCart({
        id: selectedVariant.id,
        title: product.title,
        variant: selectedVariant.title,
        price: parseFloat(selectedVariant.priceV2.amount),
        quantity: counter,
        image: product.images.edges[0]?.node.src,
        handle: product.handle,
      }));
    }
    if (handleAddToCart) showSuccessToast('Item Added');
  };
  if (!product) return <p></p>;

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
            {product.images.edges.length > 0 && (
              <img 
                src={product.images.edges[0].node.src} 
                alt={product.title} 
                width={500}
                className='product-img'
              />
            )}
            <div className='product-preview-details'>
              {/* allVariantsUnavailable ? (<h2>SOLD OUT</h2>) : (<>CODE GOES HERE<> */}
              {/* PRODUCT PRICE */}
              <h2 className='product-preview-price'>
                £{selectedVariant && selectedOptions ? 
                  parseFloat(selectedVariant.priceV2.amount).toFixed(2) : 
                  parseFloat(product.variants.edges[0].node.priceV2.amount || 0).toFixed(2)
                 }
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
                      {Array.from(new Set(option.values)).map((value, index) =>{
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
                {loading ? 'CHECKOUT' : '...Processing'}
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

export default ProductPreview