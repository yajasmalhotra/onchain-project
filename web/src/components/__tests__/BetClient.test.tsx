import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BetClient } from '../BetClient';

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <button className={className}>{children}</button>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className} data-testid="card">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardTitle: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <h2 className={className} data-testid="card-title">{children}</h2>
  ),
  CardDescription: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <p className={className} data-testid="card-description">{children}</p>
  ),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Coins: () => <span data-testid="coins-icon">CoinsIcon</span>,
  Users: () => <span data-testid="users-icon">UsersIcon</span>,
}));

describe('BetClient Component', () => {
  const betId = "test-bet-id";

  it('renders the bet details correctly', () => {
    render(<BetClient betId={betId} />);
    
    // Check title and description
    expect(screen.getByTestId('card-title')).toHaveTextContent('ETH Price > $3,000');
    expect(screen.getByTestId('card-description')).toHaveTextContent('Created by 0x123...abc');
    expect(screen.getByTestId('card-description')).toHaveTextContent(`Bet ID: ${betId}`);
    
    // Check status
    expect(screen.getByText('Active')).toBeInTheDocument();
    
    // Check icons
    expect(screen.getByTestId('coins-icon')).toBeInTheDocument();
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    
    // Check data fields
    expect(screen.getByText('Total Pool')).toBeInTheDocument();
    expect(screen.getByText('6.0 ETH')).toBeInTheDocument();
    expect(screen.getByText('Participants')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('This bet will be won if the ETH price exceeds $3,000 by the end date.')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
    expect(screen.getByText('May 15, 2025')).toBeInTheDocument();
    
    // Check button
    expect(screen.getByText('Enter Bet')).toBeInTheDocument();
  });

  it('displays the provided bet ID', () => {
    const customBetId = "custom-bet-id-12345";
    render(<BetClient betId={customBetId} />);
    
    expect(screen.getByTestId('card-description')).toHaveTextContent(`Bet ID: ${customBetId}`);
  });
}); 