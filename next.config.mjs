/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.shopify.com', // Add Shopify's CDN domain here
        },
      ], 
    },
    env: {
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
    },
  };
  
export default nextConfig;
