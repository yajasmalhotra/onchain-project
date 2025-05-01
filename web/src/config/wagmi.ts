import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [sepolia],
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
    [sepolia.id]: http(),
  },
  ssr: true,
  batch: {
    multicall: true,
  },
}); 