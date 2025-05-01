import { config } from '../wagmi';

// Mock wagmi dependencies
jest.mock('wagmi', () => ({
  http: jest.fn(() => 'http-transport'),
  createConfig: jest.fn(config => config),
}));

jest.mock('wagmi/chains', () => ({
  mainnet: { id: 1 },
  sepolia: { id: 11155111 },
}));

jest.mock('wagmi/connectors', () => ({
  injected: jest.fn(options => ({ type: 'injected', options })),
  coinbaseWallet: jest.fn(options => ({ type: 'coinbaseWallet', options })),
}));

describe('Wagmi Configuration', () => {
  // Use type assertion to avoid TypeScript errors with our mock
  const typedConfig = config as any;
  
  it('should have the correct chains configured', () => {
    expect(typedConfig.chains).toEqual([
      { id: 1 },       // mainnet
      { id: 11155111 } // sepolia
    ]);
  });

  it('should have the correct connectors', () => {
    expect(typedConfig.connectors).toHaveLength(3);
    
    // Check MetaMask injected connector
    expect(typedConfig.connectors[0]).toEqual({
      type: 'injected',
      options: { target: 'metaMask' }
    });
    
    // Check Coinbase injected connector
    expect(typedConfig.connectors[1]).toEqual({
      type: 'injected',
      options: { target: 'coinbaseWallet' }
    });
    
    // Check Coinbase Wallet connector
    expect(typedConfig.connectors[2]).toEqual({
      type: 'coinbaseWallet',
      options: { appName: 'EtherBets' }
    });
  });

  it('should have the correct transports for each chain', () => {
    expect(typedConfig.transports).toEqual({
      1: 'http-transport',        // mainnet
      11155111: 'http-transport', // sepolia
    });
  });

  it('should have SSR enabled', () => {
    expect(typedConfig.ssr).toBe(true);
  });

  it('should have multicall batch enabled', () => {
    expect(typedConfig.batch?.multicall).toBe(true);
  });
}); 