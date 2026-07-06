import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ThemeToggle from './ThemeToggle';

// Mock matchMedia before all tests
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  
  // Clear HTML class
  document.documentElement.className = '';
});

describe('ThemeToggle', () => {
  it('renders correctly and defaults to light mode', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    
    // Default should not have 'dark' class on HTML
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles dark class on the document element when clicked', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    
    // Click to enable dark mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    
    // Click again to disable dark mode
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
