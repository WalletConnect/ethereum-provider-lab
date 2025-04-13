"use client"; // Make this page a Client Component

import dynamic from 'next/dynamic';

// Dynamically import the client-side component, disabling SSR
const WalletConnectClient = dynamic(
  () => import('@/components/WalletConnectClient'),
  {
    ssr: false
  }
);

export default function Home() {
  // This page component now only renders the dynamically imported client component
  return <WalletConnectClient />;
}
