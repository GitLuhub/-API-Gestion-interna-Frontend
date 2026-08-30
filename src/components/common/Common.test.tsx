import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';
import { Pagination } from './Pagination';

describe('Common Components', () => {
  it('renders ConfirmDialog', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    render(
      <ConfirmDialog 
        isOpen={true} 
        title="Test" 
        message="Test Message" 
        onConfirm={onConfirm} 
        onCancel={onCancel} 
      />
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Confirmar'));
    expect(onConfirm).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders ErrorMessage', () => {
    render(<ErrorMessage message="Error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders LoadingSpinner', () => {
    render(<LoadingSpinner message="Loading" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders Pagination', () => {
    const onPageChange = jest.fn();
    render(
      <Pagination 
        meta={{ total: 100, skip: 10, limit: 10 }} 
        onPageChange={onPageChange} 
      />
    );
    expect(screen.getByText('Página 2 de 10')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Siguiente'));
    expect(onPageChange).toHaveBeenCalledWith(20);
    fireEvent.click(screen.getByText('Anterior'));
    expect(onPageChange).toHaveBeenCalledWith(0);
  });
});
