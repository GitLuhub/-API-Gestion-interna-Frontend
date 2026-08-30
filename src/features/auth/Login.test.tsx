import React from 'react';
import { render, screen, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import { Login } from './Login';
import * as router from 'react-router-dom';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByText(/Iniciar sesión en tu cuenta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
  });

  test('shows error message on invalid credentials', async () => {
    render(<Login />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/correo electrónico/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/Contraseña/i), 'wrongpass');
    
    await user.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));

    expect(await screen.findByText(/Error al iniciar sesión/i)).toBeInTheDocument();
  });

  test('successful login redirects or updates state', async () => {
    render(<Login />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/correo electrónico/i), 'admin@example.com');
    await user.type(screen.getByLabelText(/Contraseña/i), 'admin123');
    
    const loginButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    
    // Trigger submit but don't await immediately so we can check loading state
    const clickPromise = user.click(loginButton);
    
    // The button should show loading state and be disabled
    expect(await screen.findByText(/Iniciando sesión/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    
    await clickPromise;

    await waitFor(() => {
      expect(screen.queryByText(/Iniciando sesión/i)).not.toBeInTheDocument();
    });
    
    expect(screen.queryByText(/Error al iniciar sesión/i)).not.toBeInTheDocument();
    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
