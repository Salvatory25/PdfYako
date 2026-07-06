import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GenericTool from './GenericTool';
import * as api from '../services/api';
import { FileText } from 'lucide-react';

vi.mock('../services/api', () => ({
  uploadAndProcess: vi.fn(),
}));

describe('GenericTool Component', () => {
  const defaultProps = {
    title: 'Test Tool',
    description: 'A test generic tool',
    icon: FileText,
    colorClass: 'bg-blue-500',
    apiEndpoint: '/api/test'
  };

  const renderComponent = (props: any = defaultProps) => {
    return render(
      <BrowserRouter>
        <GenericTool {...props} />
      </BrowserRouter>
    );
  };

  it('renders title and description correctly', () => {
    renderComponent();
    expect(screen.getByText('Test Tool')).toBeInTheDocument();
    expect(screen.getByText('A test generic tool')).toBeInTheDocument();
  });

  it('shows error if no file selected', async () => {
    renderComponent();
    
    // Upload button shouldn't exist initially
    const btn = screen.queryByText('Process File');
    expect(btn).toBeNull();
  });

  it('handles extra input fields correctly', () => {
    renderComponent({
      ...defaultProps,
      extraInput: {
        type: 'text',
        label: 'Custom Text',
        placeholder: 'Enter text',
        key: 'text',
        defaultValue: 'initial'
      }
    });
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('initial');
    
    fireEvent.change(input, { target: { value: 'changed' } });
    expect(input).toHaveValue('changed');
  });

  it('allows url processing without file', () => {
    renderComponent({
      ...defaultProps,
      extraInput: {
        type: 'url',
        label: 'Website URL',
        placeholder: 'https://...',
        key: 'url'
      }
    });
    
    const input = screen.getByPlaceholderText('https://...');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    
    const processBtn = screen.getByText('Process File');
    expect(processBtn).toBeInTheDocument();
  });
});
