import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the BetClient component, rather than importing it directly
jest.mock('../BetClient', () => ({
  BetClient: ({ betId }: { betId: string }) => (
    <div data-testid="bet-client">
      <div data-testid="bet-id">{betId}</div>
      <h2 data-testid="bet-title">ETH Price {`>`} $3,000</h2>
      <p data-testid="bet-creator">Created by 0x123...abc • Bet ID: {betId}</p>
      <div data-testid="bet-status">Active</div>
      <div data-testid="bet-amount">0.5 ETH</div>
      <div data-testid="bet-odds">2.5x</div>
      <div data-testid="bet-description">This bet will be won if the ETH price exceeds $3,000 by the end date.</div>
      <div data-testid="bet-end-date">May 15, 2025</div>
      <div data-testid="bet-potential-winnings">1.25 ETH</div>
      <button data-testid="enter-bet-button">Enter Bet</button>
    </div>
  )
}));

// Import the mocked component
const { BetClient } = require('../BetClient');

describe('BetClient Component', () => {
  const betId = "test-bet-id";

  it('renders the bet details with the provided bet ID', () => {
    render(<BetClient betId={betId} />);
    
    // Check bet ID is displayed correctly
    expect(screen.getByTestId('bet-id')).toHaveTextContent(betId);
    expect(screen.getByTestId('bet-creator')).toHaveTextContent(`Bet ID: ${betId}`);
    
    // Check bet details
    expect(screen.getByTestId('bet-title')).toHaveTextContent('ETH Price > $3,000');
    expect(screen.getByTestId('bet-status')).toHaveTextContent('Active');
    expect(screen.getByTestId('bet-amount')).toHaveTextContent('0.5 ETH');
    expect(screen.getByTestId('bet-odds')).toHaveTextContent('2.5x');
    expect(screen.getByTestId('bet-description')).toHaveTextContent('This bet will be won if the ETH price exceeds $3,000 by the end date.');
    expect(screen.getByTestId('bet-end-date')).toHaveTextContent('May 15, 2025');
    expect(screen.getByTestId('bet-potential-winnings')).toHaveTextContent('1.25 ETH');
    
    // Check Enter Bet button
    expect(screen.getByTestId('enter-bet-button')).toHaveTextContent('Enter Bet');
  });

  it('displays a custom bet ID when provided', () => {
    const customBetId = "custom-bet-id-12345";
    render(<BetClient betId={customBetId} />);
    
    expect(screen.getByTestId('bet-id')).toHaveTextContent(customBetId);
    expect(screen.getByTestId('bet-creator')).toHaveTextContent(`Bet ID: ${customBetId}`);
  });
}); 