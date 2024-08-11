const { withContentlayer } = require("next-contentlayer2");

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

module.exports = withContentlayer(nextConfig);
