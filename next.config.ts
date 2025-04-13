import type { NextConfig } from "next";

// Reference: https://docs.reown.com/advanced/security/content-security-policy
// and https://nextjs.org/docs/app/building-your-application/configuring/headers
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline'; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  img-src * 'self' data: blob: https://walletconnect.org https://walletconnect.com https://secure.walletconnect.com https://secure.walletconnect.org https://tokens-data.1inch.io https://tokens.1inch.io https://ipfs.io https://cdn.zerion.io;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://rpc.walletconnect.com https://rpc.walletconnect.org https://relay.walletconnect.com https://relay.walletconnect.org wss://relay.walletconnect.com wss://relay.walletconnect.org https://pulse.walletconnect.com https://pulse.walletconnect.org https://api.web3modal.com https://api.web3modal.org https://keys.walletconnect.com https://keys.walletconnect.org https://notify.walletconnect.com https://notify.walletconnect.org https://echo.walletconnect.com https://echo.walletconnect.org https://push.walletconnect.com https://push.walletconnect.org https://explorer-api.walletconnect.com wss://www.walletlink.org;
  frame-src 'self' https://verify.walletconnect.com https://verify.walletconnect.org https://secure.walletconnect.com https://secure.walletconnect.org;
`.replace(/\s{2,}/g, ' ').trim(); // Replace newline characters and multiple spaces


const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*', // Apply CSP to all routes
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
        ],
      },
    ];
  },
  /* other config options might be here */
};

export default nextConfig;
