'use client';

import { useAccount, useDisconnect, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEffect, useState } from 'react';

interface WalletConnectProps {
  className?: string;
}

export function WalletConnect({ className }: WalletConnectProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileOptions, setShowMobileOptions] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  useEffect(() => {
    console.log('WalletConnect component mounted');
    setIsMounted(true);
    
    // Check if we're on mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      return /android|iPad|iPhone|iPod/i.test(userAgent);
    };
    
    setIsMobile(checkMobile());
  }, []);

  const handleDesktopConnect = () => {
    console.log('Desktop connect button clicked');
    try {
      console.log('Attempting to connect with injected connector');
      connect({ connector: injected() });
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleMobileConnect = () => {
    setShowMobileOptions(true);
  };

  const openCoinbaseWallet = () => {
    console.log('Opening Coinbase Wallet');
    // Universal link for Coinbase Wallet
    window.location.href = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`;
  };

  const openMetaMask = () => {
    console.log('Opening MetaMask');
    // Universal link for MetaMask
    window.location.href = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;
  };

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className={className}>
      {!isConnected ? (
        isMobile && showMobileOptions ? (
          <div className="flex flex-col gap-2 bg-cyber-blue/80 border border-neon-pink p-4 rounded-lg shadow-lg absolute right-0 mt-2 w-48">
            <button
              type="button"
              onClick={openCoinbaseWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            >
              Coinbase Wallet
            </button>
            <button
              type="button"
              onClick={openMetaMask}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            >
              MetaMask
            </button>
            <button
              type="button"
              onClick={() => setShowMobileOptions(false)}
              className="text-sm text-white mt-1 hover:text-neon-pink"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={isMobile ? handleMobileConnect : handleDesktopConnect}
            className="bg-neon-pink hover:bg-neon-pink/80 text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        )
      ) : (
        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-neon-pink">
          <span className="text-sm text-white">
            {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </span>
          <button
            type="button"
            onClick={() => disconnect()}
            className="ml-2 text-neon-pink hover:text-white text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
} 