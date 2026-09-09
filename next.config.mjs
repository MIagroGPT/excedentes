/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    // serverActions
  },
  output: 'standalone', // Ideal para Docker en EasyPanel
};

export default nextConfig;
