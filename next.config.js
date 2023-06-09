const { withContentlayer } = require("next-contentlayer");

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
