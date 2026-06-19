import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  allowedDevOrigins: ['192.168.29.173'],
};

export default nextConfig;
