/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  },
  // Disable static optimization to avoid SSR issues with wallet adapters
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
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
    ];
    
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push('pino-pretty');
    }
    
    return config;
  },
};

module.exports = nextConfig;
