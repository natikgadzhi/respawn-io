import { withContentlayer } from "next-contentlayer2";

const nextConfig = {
  images: {
    remotePatterns: [
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
