import type { NextConfig } from "next";
import withSerwist from "@serwist/next";
import { getConfig } from "./config";

const { backendUrl, allowedOrigins } = getConfig();
const nextConfig: NextConfig = {
  allowedDevOrigins: allowedOrigins,
  turbopack: {},

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `${backendUrl}/socket.io/:path*`,
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