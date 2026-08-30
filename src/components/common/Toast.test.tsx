import React, { useEffect } from 'react';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from './Toast';

const TestComponent = () => {
  const { showToast } = useToast();
  useEffect(() => {
    showToast('Success!', 'success');
    showToast('Error!', 'error');
  }, [showToast]);
  return <div />;
};

describe('Toast Component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('shows toasts and auto-hides', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3500);
    });

    expect(screen.queryByText('Success!')).not.toBeInTheDocument();
  });
});
