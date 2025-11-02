/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Node.js server (with SSR fixes)
  output: "standalone",

  // Optimize for production
  reactStrictMode: true,

  // API URL configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  },

  // Exclude wallet adapters from server-side bundle
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
      // Aggressively externalize wallet adapters to prevent server bundling
      const externalPackages = [
        "pino-pretty",
        "@solana/wallet-adapter-wallets",
        "@solana/wallet-adapter-react",
        "@solana/wallet-adapter-react-ui",
        "@solana/wallet-adapter-base",
        "@solana/web3.js",
        "tronweb",
      ];

      config.externals = config.externals || [];

      if (Array.isArray(config.externals)) {
        externalPackages.forEach(pkg => {
          if (!config.externals.includes(pkg)) {
            config.externals.push(pkg);
          }
        });
      }

      // Add regex-based externalization for wallet adapters
      if (typeof config.externals === 'function') {
        const originalExternals = config.externals;
        config.externals = async (context, request, callback) => {
          if (request.match(/@solana\/wallet-adapter/) || request.match(/@solana\/web3\.js/)) {
            return callback(null, `commonjs ${request}`);
          }
          return originalExternals(context, request, callback);
        };
      } else {
        const originalExternals = config.externals;
        config.externals = [
          (context, request, callback) => {
            if (request.match(/@solana\/wallet-adapter/) || request.match(/@solana\/web3\.js/)) {
              return callback(null, `commonjs ${request}`);
            }
            callback();
          },
          ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]).filter(Boolean),
        ];
      }
    }

    return config;
  },
};

module.exports = nextConfig;
