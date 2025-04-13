import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { useState, useEffect, useCallback } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('You need to provide NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable');
}

let provider: Awaited<ReturnType<typeof EthereumProvider.init>> | null = null;

export function useWalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start loading until provider is initialized

  const initializeProvider = useCallback(async () => {
    try {
        // Defaults to Sepolia
        // Check https://docs.walletconnect.com/2.0/web/providers/ethereum#initialization
        // for customizing chains
        provider = await EthereumProvider.init({
            projectId: projectId!,
            optionalChains: [
                8453,     // Base
                42161,    // Arbitrum One
                10,        // Optimism
                1        // Ethereum
            ], 
            showQrModal: true, // Required to show the QR code modal
            methods: ['eth_sendTransaction', 'personal_sign'],
            events: ['chainChanged', 'accountsChanged'],
            metadata: {
                name: 'NextJS Ethereum Provider Lab',
                description: 'A lab for testing WalletConnect Ethereum Provider',
                url: 'http://localhost:3000', // Replace with your actual deployment URL
                icons: ['https://walletconnect.com/walletconnect-logo.png'] // Replace with your app icon
            }
        });

        console.log("WalletConnect Provider Initialized");

        // Subscribe to events
        provider.on('connect', (connectInfo: { chainId: string }) => {
            console.log('connect event received:', connectInfo);
            const parsedChainId = parseInt(connectInfo.chainId, 16);
            setChainId(parsedChainId);
            setIsConnected(true);
            if (provider?.accounts?.[0]) {
                setAccount(provider.accounts[0]);
            }
        });

        provider.on('disconnect', () => {
            console.log('disconnect event received');
            resetState();
        });

        provider.on('chainChanged', (newChainIdHex: string) => {
            console.log('chainChanged event received:', newChainIdHex);
            const parsedChainId = parseInt(newChainIdHex, 16);
            setChainId(parsedChainId);
        });

        provider.on('accountsChanged', (accounts: string[]) => {
            console.log('accountsChanged', accounts);
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setIsConnected(true); // Ensure connected state is true if accounts change while potentially disconnected modal is up
            } else {
                // Handle case where user disconnects all accounts
                resetState();
                // Optionally, trigger disconnect flow or prompt user
            }
        });

        // Check if already connected (persistent session)
        if (provider.session && provider.accounts.length > 0) {
            setAccount(provider.accounts[0]);
            setChainId(provider.chainId);
            setIsConnected(true);
            console.log("Found existing session:", provider.session);
        }

    } catch (error) {
        console.error("Failed to initialize WalletConnect Provider", error);
        // Handle initialization error (e.g., show error message to user)
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!provider) {
        initializeProvider();
    }

    // Cleanup function to remove listeners when the component unmounts
    // or before re-initializing.
    return () => {
        if (provider) {
            provider.off('connect', console.log);
            provider.off('disconnect', console.log);
            provider.off('chainChanged', console.log);
            provider.off('accountsChanged', console.log);
            console.log("Cleaned up WalletConnect listeners");
            // Note: We don't nullify the provider here as it might be shared across components/hooks instances
            // Depending on architecture, a more robust cleanup (like provider?.disconnect()) might be needed
            // if the provider instance is meant to be truly destroyed.
        }
    };
  }, [initializeProvider]); // Rerun effect if initializeProvider changes (it shouldn't due to useCallback)


  const resetState = () => {
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
  };

  const connectWallet = useCallback(async () => {
    if (isLoading || !provider) {
        console.log("Provider not ready or still loading");
        // Optionally wait for initialization or show a message
        return;
    }
    if (isConnected) {
        console.log("Already connected");
        return;
    }
    try {
      setIsLoading(true); // Indicate connection attempt
      await provider.connect();
      // State updates (account, chainId, isConnected) will be handled by the event listeners
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      // Handle connection error (e.g., user rejected)
      resetState(); // Reset state on failure
    } finally {
        setIsLoading(false);
    }
  }, [provider, isConnected, isLoading]);

  const disconnectWallet = useCallback(async () => {
    if (!provider || !isConnected) return;
    try {
      await provider.disconnect();
      resetState();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      // Handle disconnection error
    }
  }, [provider, isConnected]);

  const signMessage = useCallback(async (message: string): Promise<string | null> => {
    if (!provider || !account) {
      console.error("Cannot sign message: Provider or account not available.");
      return null;
    }
    try {
      const signature = await provider.request<string>({
        method: 'personal_sign',
        params: [message, account],
      });
      console.log("Message signed:", signature);
      return signature;
    } catch (error) {
      console.error("Failed to sign message:", error);
      return null; // Indicate failure
    }
  }, [provider, account]);

  return {
    account,
    chainId,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    signMessage,
    provider // Expose provider if direct access is needed, but use with caution
  };
} 