import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BetClient } from '../BetClient';

// Mock the modules at the top level
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('wagmi', () => ({
  useAccount: () => ({ address: '0x123' }),
}));

// Mock the useContract hook
jest.mock('@/hooks/useContract', () => {
  return {
    useContract: () => ({
      useGetBet: () => ({
        data: [
          '0x456', // owner
          'Side 1', // side1Title
          'Side 2', // side2Title
          BigInt(100), // side1Total
          BigInt(200), // side2Total
          'Test Bet', // title
          false, // settled
        ],
        isLoading: false,
      }),
      useGetAllSide1Participants: () => ({
        data: [],
      }),
      useGetAllSide2Participants: () => ({
        data: [],
      }),
      useJoinBet: () => ({
        joinBet: jest.fn(),
        isLoading: false,
      }),
      useSettleBet: () => ({
        settleBet: jest.fn(),
        isLoading: false,
      }),
    }),
    CONTRACT_ADDRESS: '0xContract',
    CONTRACT_ABI: [],
  };
});

jest.mock('react-qr-code', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ value }) => (
      <div data-testid="qr-code" data-value={value}>
        QR Code Mock
      </div>
    )),
  };
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(),
  },
});

// Mock window.location for URL generation
const originalLocation = window.location;
Object.defineProperty(window, 'location', {
  configurable: true,
  value: {
    href: 'https://example.com/bets/123',
  },
});

// Setup TextEncoder and TextDecoder for viem
global.TextEncoder = require('util').TextEncoder;
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}

describe('Bet Sharing Feature', () => {
  const mockBetId = '123';
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  afterAll(() => {
    // Restore window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });
  
  test('renders share button in bet view', () => {
    render(<BetClient betId={mockBetId} />);
    
    // Check if share button is rendered
    const shareButton = screen.getByRole('button', { name: /share/i });
    expect(shareButton).toBeInTheDocument();
  });
  
  test('opens share dialog when share button is clicked', async () => {
    render(<BetClient betId={mockBetId} />);
    
    // Click on share button
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    
    // Check if dialog is opened
    const dialogTitle = await screen.findByText('Share This Bet');
    expect(dialogTitle).toBeInTheDocument();
  });
  
  test('displays QR code with correct URL', async () => {
    render(<BetClient betId={mockBetId} />);
    
    // Open share dialog
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    
    // Check if QR code is displayed with correct URL
    const qrCode = await screen.findByTestId('qr-code');
    expect(qrCode).toBeInTheDocument();
    expect(qrCode.getAttribute('data-value')).toBe('https://example.com/bets/123');
  });
  
  test('copies link to clipboard when copy button is clicked', async () => {
    render(<BetClient betId={mockBetId} />);
    
    // Open share dialog
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    
    // Check if input with URL is displayed
    const urlInput = await screen.findByDisplayValue('https://example.com/bets/123');
    expect(urlInput).toBeInTheDocument();
    
    // Click copy button
    const copyButton = screen.getByRole('button', { name: '' }); // The button only has an icon
    fireEvent.click(copyButton);
    
    // Check if clipboard.writeText was called with correct URL
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/bets/123');
    
    // Check if success icon is displayed temporarily
    const checkIcon = await screen.findByTestId('check-icon');
    expect(checkIcon).toBeInTheDocument();
    
    // After 2 seconds, it should switch back to copy icon
    await waitFor(() => {
      const copyIcon = screen.getByTestId('copy-icon');
      expect(copyIcon).toBeInTheDocument();
    }, { timeout: 2100 });
  });
}); 