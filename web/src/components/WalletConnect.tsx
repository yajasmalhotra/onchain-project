'use client';

import { useAccount, useDisconnect, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEffect, useState } from 'react';

interface WalletConnectProps {
  className?: string;
}

export function WalletConnect({ className }: WalletConnectProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();

  useEffect(() => {
    console.log('WalletConnect component mounted');
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    console.log('Connect button clicked');
    try {
      console.log('Attempting to connect with injected connector');
      connect({ connector: injected() });
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className={className}>
      {!isConnected ? (
        <button
          type="button"
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </span>
          <button
            type="button"
            onClick={() => disconnect()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
} 