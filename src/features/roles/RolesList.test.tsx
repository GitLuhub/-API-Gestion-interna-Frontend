import React from 'react';
import { render, screen, waitFor } from '../../test-utils';
import { RolesList } from './RolesList';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('RolesList Component', () => {
  test('renders roles loading state and then data', async () => {
    render(<RolesList />);

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument();
    });

    expect(await screen.findByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });

  test('handles error state', async () => {
    server.use(
      http.get('http://localhost:8000/api/v1/roles/', () => {
        return HttpResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
      })
    );

    render(<RolesList />);

    expect(await screen.findByText(/Error al cargar/i)).toBeInTheDocument();
  });

  test('renders empty state when no roles', async () => {
    server.use(
      http.get('http://localhost:8000/api/v1/roles/', () => {
        return HttpResponse.json({
          data: [],
          meta: { total: 0, skip: 0, limit: 100 }
        });
      })
    );

    render(<RolesList />);

    expect(await screen.findByText(/No hay roles registrados/i)).toBeInTheDocument();
  });
});
