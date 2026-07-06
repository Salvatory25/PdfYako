import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProcessingState from './ProcessingState';

describe('ProcessingState', () => {
  it('returns null when status is idle', () => {
    const { container } = render(<ProcessingState status="idle" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders uploading state with correct message', () => {
    render(<ProcessingState status="uploading" message="Uploading 1 of 5" />);
    expect(screen.getByText('Uploading files...')).toBeInTheDocument();
    expect(screen.getByText('Uploading 1 of 5')).toBeInTheDocument();
  });

  it('renders processing state', () => {
    render(<ProcessingState status="processing" />);
    expect(screen.getByText('Processing document...')).toBeInTheDocument();
  });

  it('renders success state and handles reset click', () => {
    const handleReset = vi.fn();
    render(<ProcessingState status="success" onReset={handleReset} downloadUrl="/test.pdf" />);
    
    expect(screen.getByText('Task Complete!')).toBeInTheDocument();
    expect(screen.getByText('Download File')).toHaveAttribute('href', '/test.pdf');
    
    const resetButton = screen.getByRole('button', { name: /start over/i });
    fireEvent.click(resetButton);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('renders error state and handles try again click', () => {
    const handleReset = vi.fn();
    render(<ProcessingState status="error" message="Server failed" onReset={handleReset} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Server failed')).toBeInTheDocument();
    
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(tryAgainButton);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
