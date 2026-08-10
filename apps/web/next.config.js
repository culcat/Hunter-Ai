const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@hunter-ai/types', 'antd', '@ant-design/nextjs-registry'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
};

module.exports = nextConfig;
