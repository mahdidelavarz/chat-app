import type { NextConfig } from "next";
import withSerwist from "@serwist/next";

const nextConfig: NextConfig = {
  // Add Turbopack configuration
  turbopack: {
    // Empty config silences the error
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:5000/api/:path*',
      },
      {
        source: '/socket.io/:path*',
        destination: 'http://backend:5000/socket.io/:path*',
      },
    ];
  },
};

const serwistConfig = {
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
};

export default withSerwist(serwistConfig)(nextConfig);