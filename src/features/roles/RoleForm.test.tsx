import React from 'react';
import { render, screen, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import { RoleForm } from './RoleForm';

describe('RoleForm Component', () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create role form', () => {
    render(<RoleForm isOpen={true} onClose={onCloseMock} />);
    
    expect(screen.getByText('Crear Rol')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
  });

  test('renders edit role form and populates data', () => {
    const roleToEdit = {
      id: '1', name: 'Admin', description: 'Administrator',
      created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z'
    };

    render(<RoleForm isOpen={true} onClose={onCloseMock} roleToEdit={roleToEdit} />);
    
    expect(screen.getByText('Editar Rol')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Admin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Administrator')).toBeInTheDocument();
  });

  test('submits create role successfully', async () => {
    render(<RoleForm isOpen={true} onClose={onCloseMock} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Nombre'), 'Manager');
    await user.type(screen.getByLabelText('Descripción'), 'Manager role');
    
    const submitBtn = screen.getByRole('button', { name: /Guardar/i });
    const clickPromise = user.click(submitBtn);

    expect(await screen.findByText('Guardando...')).toBeInTheDocument();
    
    await clickPromise;

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  test('submits edit role successfully', async () => {
    const roleToEdit = {
      id: '1', name: 'Admin', description: 'Administrator',
      created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z'
    };

    render(<RoleForm isOpen={true} onClose={onCloseMock} roleToEdit={roleToEdit} />);
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText('Nombre');
    await user.clear(nameInput);
    await user.type(nameInput, 'SuperAdmin');
    
    const submitBtn = screen.getByRole('button', { name: /Guardar/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });
});
