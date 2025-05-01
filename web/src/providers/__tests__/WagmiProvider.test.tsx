import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Providers } from '../WagmiProvider';
import { config } from '@/config/wagmi';

// Mock the imports
jest.mock('wagmi', () => ({
  WagmiProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wagmi-provider">{children}</div>
  ),
}));

jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-client-provider">{children}</div>
  ),
}));

jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <div data-testid="react-query-devtools" />,
}));

jest.mock('@/config/wagmi', () => ({
  config: { mock: 'config' },
}));

// Mock console.log to track output
const originalConsoleLog = console.log;
const mockConsoleLog = jest.fn();

describe('Providers Component', () => {
  beforeEach(() => {
    console.log = mockConsoleLog;
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    jest.clearAllMocks();
  });

  it('renders the provider components correctly', () => {
    const { getByTestId, getByText } = render(
      <Providers>
        <div>Test Child Component</div>
      </Providers>
    );

    // Check if WagmiProvider is rendered
    expect(getByTestId('wagmi-provider')).toBeInTheDocument();

    // Check if QueryClientProvider is rendered
    expect(getByTestId('query-client-provider')).toBeInTheDocument();

    // Check if ReactQueryDevtools is rendered
    expect(getByTestId('react-query-devtools')).toBeInTheDocument();

    // Check if children are rendered
    expect(getByText('Test Child Component')).toBeInTheDocument();
  });

  it('logs when the provider is mounted', () => {
    render(
      <Providers>
        <div>Test Child Component</div>
      </Providers>
    );

    // Check if console.log was called with the correct message
    expect(mockConsoleLog).toHaveBeenCalledWith('WagmiProvider mounted');
  });
}); 