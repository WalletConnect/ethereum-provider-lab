"use client"; // Required for hooks like useState, useEffect

import { useState } from 'react';
import { useWalletConnect } from '@/hooks/useWalletConnect'; // Assuming '@/hooks/...' path alias is configured or adjust path as needed

export default function Home() {
  const { 
    account, 
    chainId, 
    isConnected, 
    isLoading, 
    connectWallet, 
    disconnectWallet, 
    signMessage 
  } = useWalletConnect();

  const [message, setMessage] = useState('Hello WalletConnect!');
  const [signature, setSignature] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);

  const handleSignMessage = async () => {
    setSignature(null); // Reset previous signature/error
    setSignError(null);
    if (!message) {
      setSignError("Message cannot be empty.");
      return;
    }
    try {
      const result = await signMessage(message);
      if (result) {
        setSignature(result);
      } else {
        setSignError("Failed to sign message. Check console.");
      }
    } catch (err: any) {
      console.error("Signing error:", err);
      setSignError(err.message || "An unexpected error occurred during signing.");
    }
  };

  // Helper to display truncated account
  const truncateAddress = (address: string) => {
    if (!address) return "No Account";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">WalletConnect v2 Lab</h1>

        {isLoading && <p className="text-center text-gray-500">Loading / Initializing...</p>}

        {!isLoading && (
          <div className="space-y-4">
            {!isConnected ? (
              <button 
                onClick={connectWallet}
                className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-50"
                disabled={isLoading} // Disable while loading initial provider
              >
                Connect Wallet
              </button>
            ) : (
              <div className="p-4 border rounded-md bg-gray-50 space-y-3">
                <p className="text-sm text-gray-700">Connected Account: <strong className="font-mono break-all">{truncateAddress(account!)}</strong></p>
                <p className="text-sm text-gray-700">Chain ID: <strong className="font-mono">{chainId ?? 'N/A'}</strong></p>
                <button 
                  onClick={disconnectWallet}
                  className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                >
                  Disconnect
                </button>
              </div>
            )}

            {isConnected && (
              <div className="pt-4 border-t space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Sign a Message</h2>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-600 mb-1">Message:</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter message to sign"
                  />
                </div>
                <button
                  onClick={handleSignMessage}
                  className="w-full px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                  disabled={!message || isLoading} // Also disable if initial provider is still loading?
                >
                  Sign Message
                </button>
                {signature && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm font-semibold text-green-800">Signature:</p>
                    <p className="text-xs font-mono break-all text-green-700">{signature}</p>
                  </div>
                )}
                {signError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm font-semibold text-red-800">Error:</p>
                    <p className="text-xs text-red-700">{signError}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
