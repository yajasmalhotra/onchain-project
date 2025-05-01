import logger from '../logger';
import pino from 'pino';

// Mock pino module
jest.mock('pino', () => {
  // Create a mock implementation of pino
  const mockPino = jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }));
  
  // Add the transport property to the mockPino function
  return Object.assign(mockPino, {
    transport: jest.fn()
  });
});

describe('Logger', () => {
  it('should create a pino logger with correct configuration', () => {
    // Check if pino was called with the correct configuration
    expect(pino).toHaveBeenCalledWith({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    });
  });
  
  it('should have standard logging methods', () => {
    // Check that the logger instance has all the standard methods
    expect(logger).toHaveProperty('info');
    expect(logger).toHaveProperty('error');
    expect(logger).toHaveProperty('warn');
    expect(logger).toHaveProperty('debug');
  });
}); 