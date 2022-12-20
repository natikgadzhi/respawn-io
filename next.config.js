
// next.config.js
module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'respawn.io',
                port: '',
                pathname: '/api/opengraph/**',
            },
        ],
    },
}
