import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();

  // Set CSP headers
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.walletconnect.com https://*.walletconnect.org",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://*.walletconnect.com https://*.walletconnect.org",
      "connect-src 'self' https://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.com wss://*.walletconnect.org https://*.walletlink.org wss://*.walletlink.org https://eth.merkle.io https://*.coinbase.com https://chain-proxy.wallet.coinbase.com https://sepolia.drpc.org",
      "frame-src 'self' https://*.walletconnect.com https://*.walletconnect.org",
    ].join('; ')
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 