import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

// Wrap the config with PWA support
const withPWA = withPWAInit({
  dest: "public", // this is where the service worker will be output
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["m.media-amazon.com"],
  },
};

export default withPWA({
  ...nextConfig,
});
