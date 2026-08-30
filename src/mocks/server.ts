import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('http://localhost:8000/api/v1/auth/login', async ({ request }) => {
    const data = await request.json() as { email?: string; password?: string };
    
    if (data.email === 'admin@example.com' && data.password === 'admin123') {
      return HttpResponse.json({
        access_token: 'mock-access-token',
        token_type: 'bearer',
      });
    }
    
    return HttpResponse.json(
      { detail: 'Email o contraseña incorrectos' },
      { status: 401 }
    );
  }),

  http.post('http://localhost:8000/api/v1/auth/refresh', () => {
    return HttpResponse.json({ detail: 'No authenticated' }, { status: 401 });
  }),

  http.post('http://localhost:8000/api/v1/auth/logout', () => {
    return HttpResponse.json({ detail: 'Logged out' });
  }),

  http.get('http://localhost:8000/api/v1/users/me', () => {
    return HttpResponse.json({
      data: {
        id: '1', email: 'admin@example.com', first_name: 'Admin', last_name: 'User',
        is_active: true, is_superuser: true, roles: [],
        created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z'
      }
    });
  }),
  
  http.get('http://localhost:8000/api/v1/users/', () => {
    return HttpResponse.json({
      data: [
        { id: '1', email: 'admin@example.com', first_name: 'Admin', last_name: 'User', is_active: true, is_superuser: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
        { id: '2', email: 'user@example.com', first_name: 'Test', last_name: 'User', is_active: true, is_superuser: false, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }
      ],
      meta: { total: 2, skip: 0, limit: 100 }
    });
  }),
  
  http.get('http://localhost:8000/api/v1/roles/', () => {
    return HttpResponse.json({
      data: [
        { id: 'r1', name: 'Admin', description: 'Administrator', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }
      ],
      meta: { total: 1, skip: 0, limit: 100 }
    });
  }),

  http.post('http://localhost:8000/api/v1/users/', async ({ request }) => {
    const data = await request.json() as any;
    return HttpResponse.json({
      data: {
        id: 'new-user-id',
        ...data,
        is_active: data.is_active ?? true,
        is_superuser: data.is_superuser ?? false,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      }
    }, { status: 201 });
  }),

  http.put('http://localhost:8000/api/v1/users/:id', async ({ request, params }) => {
    const data = await request.json() as any;
    return HttpResponse.json({
      data: {
        id: params.id,
        email: data.email || 'updated@example.com',
        first_name: data.first_name || 'Updated',
        last_name: data.last_name || 'User',
        is_active: data.is_active ?? true,
        is_superuser: data.is_superuser ?? false,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      }
    });
  }),

  http.delete('http://localhost:8000/api/v1/users/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('http://localhost:8000/api/v1/roles/', async ({ request }) => {
    const data = await request.json() as any;
    return HttpResponse.json({
      data: {
        id: 'new-role-id',
        ...data,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      }
    }, { status: 201 });
  }),

  http.put('http://localhost:8000/api/v1/roles/:id', async ({ request, params }) => {
    const data = await request.json() as any;
    return HttpResponse.json({
      data: {
        id: params.id,
        name: data.name || 'Updated Role',
        description: data.description || 'Updated description',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      }
    });
  }),

  http.delete('http://localhost:8000/api/v1/roles/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('http://localhost:8000/api/v1/roles/:roleId/assign/:userId', () => {
    return HttpResponse.json({ detail: 'Role assigned' });
  }),

  http.delete('http://localhost:8000/api/v1/roles/:roleId/revoke/:userId', () => {
    return HttpResponse.json({ detail: 'Role revoked' });
  }),
];

export const server = setupServer(...handlers);