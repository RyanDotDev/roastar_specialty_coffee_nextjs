import CartSlider from "@/components/CartSlider";

export async function getServerSideProps() {
  try {
    const response = await fetch(`http://localhost:3000/api/shopify/products`);

    if (!response.ok) {
      const text = await response.text();
      console.error("API Error Response:", text);
      throw new Error(`Failed to fetch products. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched products in getServerSideProps:", data.products);

    return {
      props: {
        products: data.products || [],
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        products: [],
        error: "Failed to fetch products",
      },
    };
  }
}

const CartPage = ({ products, error }) => {
  if (error) {
    return ( <p>Error: {error}</p> );
  }

  return ( <CartSlider products={products} /> );
};

export default CartPage;
