import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        // Game files: cần COOP + COEP để Eaglercraft có thể dùng SharedArrayBuffer
        // postMessage vẫn hoạt động giữa same-origin pages dù có COOP/COEP
        source: "/game/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};


export default nextConfig;

// Trigger redeploy for Framework Preset change

