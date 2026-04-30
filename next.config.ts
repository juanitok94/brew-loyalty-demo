import type { NextConfig } from "next";

const allowedOrigins = process.env.ALLOWED_ORIGINS ?? "https://wavl-guide.vercel.app";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@lancedb/lancedb"],
  async headers() {
    return [
      {
        source: "/api/passport/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: allowedOrigins },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
