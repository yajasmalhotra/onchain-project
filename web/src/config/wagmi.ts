import { http, createConfig } from 'wagmi';
import { baseSepolia, sepolia } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    injected({
      target: 'coinbaseWallet',
    }),
    coinbaseWallet({
      appName: 'EtherBets',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
  batch: {
    multicall: true,
  },
}); 