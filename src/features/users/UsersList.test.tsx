import React from 'react';
import { render, screen, waitFor } from '../../test-utils';
import { UsersList } from './UsersList';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('UsersList Component', () => {
  test('renders users loading state and then data', async () => {
    render(<UsersList />);

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument();
    });

    expect(await screen.findByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  test('handles error state', async () => {
    server.use(
      http.get('http://localhost:8000/api/v1/users/', () => {
        return HttpResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
      })
    );

    render(<UsersList />);

    expect(await screen.findByText(/Error al cargar/i)).toBeInTheDocument();
  });

  test('renders empty state when no users', async () => {
    server.use(
      http.get('http://localhost:8000/api/v1/users/', () => {
        return HttpResponse.json({
          data: [],
          meta: { total: 0, skip: 0, limit: 100 }
        });
      })
    );

    render(<UsersList />);

    expect(await screen.findByText(/No hay usuarios registrados/i)).toBeInTheDocument();
  });
});
