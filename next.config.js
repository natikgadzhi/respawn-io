import { withContentlayer } from "next-contentlayer2";

const nextConfig = {
  output: "standalone",
  turbopack: {},
  outputFileTracingExcludes: {
    "posts/[slug]/og-image.png": [
      "./content",       // Exclude all content files
      "./contentlayer",  // Exclude contentlayer generated files
      "./node_modules/contentlayer2" // Exclude contentlayer2 from the edge function
    ]
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
