const withTM = require('next-transpile-modules')(['@mui/material', '@mui/system']); // pass the modules you would like to see transpiled

/** @type {import('next').NextConfig} */
module.exports = withTM({
  // experimental: {
  //   esmExternals: true,
  // },
  // https://github.com/Velenir/nextjs-ipfs-example/
  assetPrefix: './',
  trailingSlash: true,
  reactStrictMode: true,
  webpack(config, {isServer}) {
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
});
