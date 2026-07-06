import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Dropzone from './Dropzone';

describe('Dropzone', () => {
  it('renders correctly', () => {
    render(<Dropzone onFileSelect={vi.fn()} />);
    expect(screen.getByText('Drag & Drop your files here')).toBeInTheDocument();
  });

  it('handles file selection via click', async () => {
    const handleFileSelect = vi.fn();
    render(<Dropzone onFileSelect={handleFileSelect} />);
    
    const input = document.getElementById('file-upload') as HTMLInputElement;
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    
    Object.defineProperty(input, 'files', {
      value: [file]
    });
    
    fireEvent.change(input);
    
    expect(handleFileSelect).toHaveBeenCalledWith([file]);
    expect(screen.getByText('hello.png')).toBeInTheDocument();
  });

  it('allows removing a selected file', () => {
    const handleFileSelect = vi.fn();
    render(<Dropzone onFileSelect={handleFileSelect} />);
    
    // Add file first
    const input = document.getElementById('file-upload') as HTMLInputElement;
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    
    Object.defineProperty(input, 'files', {
      value: [file]
    });
    fireEvent.change(input);
    
    // Check if it's there
    expect(screen.getByText('hello.png')).toBeInTheDocument();
    
    // Remove it
    const removeButton = screen.getByTitle('Remove file');
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('hello.png')).not.toBeInTheDocument();
    expect(handleFileSelect).toHaveBeenLastCalledWith([]);
  });
});
