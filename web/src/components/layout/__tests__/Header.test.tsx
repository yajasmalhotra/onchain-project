import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../Header';

// Mock the WalletConnect component
jest.mock('@/components/WalletConnect', () => ({
  WalletConnect: ({ className }: { className?: string }) => (
    <div data-testid="wallet-connect" className={className}>
      Mock WalletConnect
    </div>
  ),
}));

// Mock the Lucide icon component
jest.mock('lucide-react', () => ({
  Flame: () => <div data-testid="flame-icon">Mock Flame Icon</div>,
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) => (
    <a href={href} className={className} data-testid="next-link">
      {children}
    </a>
  );
});

describe('Header Component', () => {
  it('renders the header with app name and wallet connect', () => {
    render(<Header />);
    
    // Check if the app name is displayed
    expect(screen.getByText('EtherBets')).toBeInTheDocument();
    
    // Check if the Flame icon is rendered
    expect(screen.getByTestId('flame-icon')).toBeInTheDocument();
    
    // Check if the WalletConnect component is rendered
    expect(screen.getByTestId('wallet-connect')).toBeInTheDocument();
  });
  
  it('links to the home page when logo is clicked', () => {
    render(<Header />);
    
    // Check that the link points to the home page
    const homeLink = screen.getByTestId('next-link');
    expect(homeLink).toHaveAttribute('href', '/');
    
    // Check that the logo is inside the link
    expect(homeLink).toContainElement(screen.getByTestId('flame-icon'));
    expect(homeLink).toContainElement(screen.getByText('EtherBets'));
  });
  
  it('applies the correct styling and structure', () => {
    const { container } = render(<Header />);
    
    // Check for container class
    expect(container.querySelector('header')).toHaveClass('container');
    expect(container.querySelector('header')).toHaveClass('mx-auto');
    
    // Check for flex layout
    const flexContainer = container.querySelector('div.flex.items-center.justify-between');
    expect(flexContainer).toBeInTheDocument();
    
    // Check that WalletConnect is contained in a relative div with z-index
    const walletConnectContainer = screen.getByTestId('wallet-connect').parentElement;
    expect(walletConnectContainer).toHaveClass('relative');
    expect(walletConnectContainer).toHaveClass('z-10');
    
    // Check that WalletConnect has the correct className passed
    expect(screen.getByTestId('wallet-connect')).toHaveClass('text-white');
    
    // Check that link has hover styling
    const link = screen.getByTestId('next-link');
    expect(link).toHaveClass('hover:opacity-80');
    expect(link).toHaveClass('transition-opacity');
  });
}); 