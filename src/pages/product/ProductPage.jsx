import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/state';
import { fetchProduct, fetchRelatedProducts } from '../../../../server/api/shopify/products';
import './ProductPage.css';
import '../../App.css';
import { Minus, Plus, ChevronLeft } from 'lucide-react';
import Footer from '../../components/Footer';

const MAX_CART_ITEMS = 10

const ProductPage = () => {
  const cart = useSelector((state) => state.cart);
  const { handle } = useParams();
  const dispatch = useDispatch();

  // State fetches and displays product from Products.jsx when clicked
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  // States that return whether product(s) are loading or an error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for changing variant
  const [selectedVariant, setSelectedVariant] = useState(null);
  // State for increasing and decresing quantity
  const [counter, setCounter] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProduct(handle);
        console.log("Fetched product data:", data);
        setProduct(data);
        // Automatically select the first available variant
        const firstAvailableVariant = data.variants.edges.find(
          ({ node }) => node.availableForSale
        )?.node;
        setSelectedVariant(firstAvailableVariant || null);
      } catch (error) {
        console.log("Error fetching product", error);
        setError(`Sorry, Something went wrong!`)
      } finally {
        setLoading(false);
      }
    };

    const getRelatedProducts = async () => {
      try {
        const data = await fetchRelatedProducts();
        setRelatedProducts(data);
      } catch (error) {
        console.error("Error fetching product list:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getRelatedProducts();
    getProduct();
    document.body.style.backgroundColor = 'var(--main-green)';

    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [handle]);

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
      alert(`Please choose a ${unselectedOption.name.toLowerCase()} option`);
      return
    }
    // Ensure selectedVariant matches the current selections
    if (!selectedVariant) {
      alert("The selected variant is unavailable. Please choose valid options.");
      return // Stop execution if no valid variant is selected
    }

    const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

    if (totalItemsInCart + counter > MAX_CART_ITEMS) {
      alert(`You can only add up to ${MAX_CART_ITEMS} items to your cart.`);
      return;
    }
    
    if (selectedVariant && product) {
      console.log({
        id: selectedVariant.id,
        title: product.title,
        variant: selectedVariant.title,
        price: parseFloat(selectedVariant.priceV2.amount),
        quantity: counter,
        image: product.images.edges[0]?.node.src,
        handle: product.handle, // Ensure this is logged
      });

      dispatch(addToCart({
        id: selectedVariant.id,
        title: product.title,
        variant: selectedVariant.title,
        price: parseFloat(selectedVariant.priceV2.amount),
        quantity: counter,
        image: product.images.edges[0]?.node.src,
        handle: product.handle,
      }));
    };
  };

  if (loading) return <div className='pnf-container'/>;
  // If error is made, returns this error message
  if (error) return <div className='pnf-container'><p>{error}</p></div>; 
  // If product is not found, returns this error message
  if (!product) return <div className='pnf-container'></div>;

  return (
    <div className='product-page-background'>
      <div className='product-page-container'>
        <Link to='/Shop' reloadDocument>
          <ChevronLeft style={{ position: 'relative', top: '0.45rem', color: 'white'}}/><h5>BACK TO SHOP</h5>
        </Link>
        <div className='product-content'>
          <h1>{product.title}</h1>
          <div className='product-main'>
            {/* PRODUCT IMAGE */}
            {product.images.edges.length > 0 && (
              <img 
                src={product.images.edges[0].node.src} 
                alt={product.title} 
                width={600}
                className='product-img'
                loading='eager'
              />
            )}
            <div className='product-details'>
              {/* PRODUCT DETAILS */}
              <div className='product-desc' dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              {/* INGREDIENTS (IF APPLICABLE) */}
              <p>{/* product.metafield?.key */}</p>
              {/* PRODUCT PRICE */}
              <h2>
                £{
                   selectedVariant && selectedOptions ? 
                   parseFloat(selectedVariant.priceV2.amount).toFixed(2) : 
                   parseFloat(product.variants.edges[0].node.priceV2.amount || 0).toFixed(2)
                 }
              </h2>
              {product.totalInventory === 0 && <h3 style={{ color: 'white', letterSpacing: '1.5px'}}>SOLD OUT</h3>}
              {/* `${parseFloat(productDetails.variants.edges[0].node.priceV2.amount).toFixed(2)}`*/}
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
                      {option.values.map((value) => {
                        // Check if this value is available
                        const isAvailable = getAvailableOptions(option.name).includes(value);
                        return (
                          <option key={value} value={value} disabled={!isAvailable}>
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
                className='add-to-cart'
                disabled={product.totalInventory === 0}
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
          <div className='related-product-list'>
            {relatedProducts
                .filter(({ node }) => node.handle !== product.handle)
                .slice(0,4).map(({ node }) => (
                <div 
                  className='related-product-card'
                  key={node.id}
                >
                  {/* Ensure the link is by handle */}
                  <Link to={`/product/${node.handle}`} reloadDocument>
                    {node.images.edges.length > 0 && (
                      <img 
                        src={node.images.edges[0].node.src} 
                        alt={node.title} 
                        width={200}
                      />
                    )}
                    <h3>{node.title}</h3>
                    <div>
                      <button>PREVIEW PRODUCT</button>
                    </div>
                  </Link>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProductPage;