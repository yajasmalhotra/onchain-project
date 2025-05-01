/**
 * Content Security Policy configuration
 * 
 * This file centralizes all CSP directives to make them easier to maintain.
 * Add new domains here as needed for wallet connections.
 */

// Domains for wallet connections and blockchain services
const walletConnectDomains = [
  'https://*.walletconnect.com',
  'https://*.walletconnect.org',
  'wss://*.walletconnect.com',
  'wss://*.walletconnect.org',
];

const walletLinkDomains = [
  'https://*.walletlink.org',
  'wss://*.walletlink.org',
];

const coinbaseDomains = [
  'https://*.coinbase.com',
  'https://chain-proxy.wallet.coinbase.com',
];

const blockchainServiceDomains = [
  'https://eth.merkle.io',
];

// Combine all domains for connect-src
const connectSrcDomains = [
  "'self'",
  ...walletConnectDomains,
  ...walletLinkDomains,
  ...coinbaseDomains,
  ...blockchainServiceDomains,
];

// Build CSP directives
export const cspDirectives = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' ${walletConnectDomains.join(' ')}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: ${walletConnectDomains.filter(d => d.startsWith('https:')).join(' ')}`,
  `connect-src ${connectSrcDomains.join(' ')}`,
  `frame-src 'self' ${walletConnectDomains.filter(d => d.startsWith('https:')).join(' ')}`,
];

// Get the formatted CSP string
export const getCSP = (): string => {
  return cspDirectives.join('; ');
}; 