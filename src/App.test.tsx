import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';
import { setCredentials, logout } from './features/auth/authSlice';

describe('App Component (Session Hydration and ProtectedRoutes)', () => {
  beforeEach(() => {
    store.dispatch(logout());
  });

  test('shows loading state during session check', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText(/Verificando sesión/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/Verificando sesión/i)).not.toBeInTheDocument();
    });
  });

  test('redirects to login when unauthenticated', async () => {
    server.use(
      http.get('http://localhost:8000/api/v1/users/me', () => {
        return HttpResponse.json({ detail: 'Not authenticated' }, { status: 401 });
      })
    );
    
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Iniciar sesión en tu cuenta/i)).toBeInTheDocument();
    });
  });

  test('allows access to protected route when authenticated', async () => {
    store.dispatch(setCredentials({
      user: { id: '1', email: 'admin@example.com', first_name: 'Admin', last_name: 'User', is_superuser: true, roles: [] },
      accessToken: 'fake-token'
    }));

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Administrativo/i)).toBeInTheDocument();
    });
  });
});
