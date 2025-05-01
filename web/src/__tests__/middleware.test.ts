import { middleware } from '../middleware';
import { NextResponse } from 'next/server';

// Mock next/server module without requireActual
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({
      headers: {
        set: jest.fn(),
      },
    })),
  },
}));

describe('Middleware', () => {
  let mockResponse: { headers: { set: jest.Mock } };
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock response
    mockResponse = {
      headers: {
        set: jest.fn(),
      },
    };
    
    (NextResponse.next as jest.Mock).mockReturnValue(mockResponse);
  });
  
  it('sets Content-Security-Policy header', () => {
    // Call middleware
    const result = middleware();
    
    // Check if header was set
    expect(mockResponse.headers.set).toHaveBeenCalledWith(
      'Content-Security-Policy',
      expect.any(String)
    );
    
    // Check CSP content
    const cspCall = mockResponse.headers.set.mock.calls[0];
    const [headerName, headerValue] = cspCall;
    
    expect(headerName).toBe('Content-Security-Policy');
    expect(headerValue).toContain("default-src 'self'");
    expect(headerValue).toContain("connect-src 'self'");
    
    // Check for wallet connection domains
    expect(headerValue).toContain('https://*.walletconnect.com');
    expect(headerValue).toContain('wss://*.walletconnect.com');
    expect(headerValue).toContain('https://*.walletconnect.org');
    expect(headerValue).toContain('wss://*.walletconnect.org');
    expect(headerValue).toContain('https://*.walletlink.org');
    expect(headerValue).toContain('wss://*.walletlink.org');
    
    // Check that response is returned
    expect(result).toBe(mockResponse);
  });
  
  it('has correct config matcher', () => {
    const { config } = require('../middleware');
    
    expect(config).toBeDefined();
    expect(config.matcher).toContainEqual('/((?!api|_next/static|_next/image|favicon.ico).*)');
  });
}); 