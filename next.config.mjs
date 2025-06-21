/** @type {import('next').NextConfig} */
import moduleAlias from 'module-alias';

moduleAlias.addAlias('punycode', 'punycode/');

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
};
  
export default nextConfig;
