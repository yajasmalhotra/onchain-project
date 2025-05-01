import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../page';

// Mock the wagmi useAccount hook
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
}));

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <button className={className} onClick={onClick} data-testid="button">
      {children}
    </button>
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
  CardFooter: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className} data-testid="card-footer">{children}</div>
  ),
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode, onValueChange?: (value: string) => void }) => (
    <div data-testid="tabs">{children}</div>
  ),
  TabsList: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={className} data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({ children, value }: { children: React.ReactNode, value: string, className?: string }) => (
    <button data-testid={`tab-${value}`} value={value}>{children}</button>
  ),
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} data-testid="input" />,
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode, htmlFor: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-icon">→</span>,
  Coins: () => <span data-testid="coins-icon">🪙</span>,
  Plus: () => <span data-testid="plus-icon">+</span>,
  Sparkles: () => <span data-testid="sparkles-icon">✨</span>,
  Trophy: () => <span data-testid="trophy-icon">🏆</span>,
  User: () => <span data-testid="user-icon">👤</span>,
  Users: () => <span data-testid="users-icon">👥</span>,
}));

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a message to connect wallet when not connected', () => {
    // Mock useAccount to simulate not connected
    (require('wagmi').useAccount as jest.Mock).mockReturnValue({
      address: undefined,
      isConnected: false,
    });
    
    render(<HomePage />);
    
    // Check for the connect wallet message
    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument();
    expect(screen.getByText('Connect your wallet to see your bets and create new ones.')).toBeInTheDocument();
    
    // Main heading should still be visible
    expect(screen.getByText('Bet on Anything.')).toBeInTheDocument();
    expect(screen.getByText('Win Big.')).toBeInTheDocument();
  });

  it('shows two columns of bets when connected', () => {
    // Mock useAccount to simulate connected
    (require('wagmi').useAccount as jest.Mock).mockReturnValue({
      address: '0x1234567890abcdef1234567890abcdef12345678',
      isConnected: true,
    });
    
    render(<HomePage />);
    
    // Check for the section headings
    expect(screen.getByText('Bets You Created')).toBeInTheDocument();
    expect(screen.getByText('Bets You Joined')).toBeInTheDocument();
    
    // Check for the existence of bet cards by their titles
    expect(screen.getByText('ETH Price > $3,000')).toBeInTheDocument();
    expect(screen.getByText('BTC/ETH Ratio < 15')).toBeInTheDocument();
    expect(screen.getByText('Total ETH Staked > 30M')).toBeInTheDocument();
    expect(screen.getByText('SOL Price < $150')).toBeInTheDocument();
    
    // Check that we have tab filter options
    expect(screen.getByTestId('tab-all')).toBeInTheDocument();
    expect(screen.getByTestId('tab-active')).toBeInTheDocument();
    expect(screen.getByTestId('tab-completed')).toBeInTheDocument();
  });
}); 