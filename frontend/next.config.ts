import type { NextConfig } from "next";
import withSerwist from "@serwist/next";
import { getConfig } from "./config";

// const { backendUrl, allowedOrigins } = getConfig();
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://host.docker.internal:5000';
const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost', '127.0.0.1', '172.16.2.99','192.168.1.100'],
  turbopack: {},

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `${apiUrl}/socket.io/:path*`,
      },
    ];
  },
};

export default withSerwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);