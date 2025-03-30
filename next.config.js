import { withContentlayer } from "next-contentlayer2";

const nextConfig = {
  outputFileTracingExcludes: {
    "posts/[slug]/og-image.png": ["./content"]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media0.giphy.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "respawn.io",
        port: "",
        pathname: "/api/opengraph/**",
      },
    ],
  },
};

export default withContentlayer(nextConfig);
