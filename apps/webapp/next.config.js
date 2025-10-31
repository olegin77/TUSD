/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // Optimize for production
  reactStrictMode: true,

  images: {
    domains: ["localhost"],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  },

  // Exclude packages from server-side bundles (Next.js 15+)
  serverExternalPackages: [
    "@solana/wallet-adapter-wallets",
    "@solana/wallet-adapter-react",
    "@solana/wallet-adapter-react-ui",
    "@solana/wallet-adapter-base",
    "@solana/web3.js",
    "tronweb",
  ],

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
    }

    // Ignore pino-pretty to avoid import errors
    config.ignoreWarnings = [
      { module: /node_modules\/pino/ },
      { module: /node_modules\/@walletconnect/ },
      { module: /node_modules\/@solana/ },
    ];

    if (isServer) {
      // Exclude all wallet-related packages from server bundle
      const walletPackages = [
        "@solana/wallet-adapter-wallets",
        "@solana/wallet-adapter-react",
        "@solana/wallet-adapter-react-ui",
        "@solana/wallet-adapter-base",
        "@solana/web3.js",
        "tronweb",
      ];

      config.externals = config.externals || [];
      config.externals.push("pino-pretty");

      // Add each wallet package as external
      walletPackages.forEach(pkg => {
        if (typeof config.externals === 'function') {
          const originalExternals = config.externals;
          config.externals = async (context, request, callback) => {
            if (request === pkg || request.startsWith(pkg + '/')) {
              return callback(null, 'commonjs ' + request);
            }
            return originalExternals(context, request, callback);
          };
        } else if (Array.isArray(config.externals)) {
          config.externals.push(pkg);
        }
      });
    }

    return config;
  },
};

module.exports = nextConfig;
