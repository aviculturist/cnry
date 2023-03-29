/** @type {import('next').NextConfig} */
module.exports = {
  // experimental: {
  //   esmExternals: true,
  // },
  // https://github.com/Velenir/nextjs-ipfs-example/
  assetPrefix: './',
  trailingSlash: true,
  // https://medium.com/@yashashr/next-js-optimization-for-better-performance-part-1-material-ui-mui-configs-plugins-6fdc48a4e984
  transpilePackages: ['@mui/system', '@mui/material', '@mui/icons-material'],
  reactStrictMode: true,
  webpack(config, { isServer }) {
    const fallback = config.resolve.fallback || (config.resolve.fallback = {});
    if (!isServer) fallback['crypto'] = fallback['stream'] = false;

    config.module.rules = [
      ...config.module.rules,
      {
        resourceQuery: /raw-lingui/,
        type: 'javascript/auto',
      },
    ];
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mui/styled-engine': '@mui/styled-engine-sc',
    };
    return config;
  },
};
