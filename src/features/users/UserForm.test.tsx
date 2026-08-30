import React from 'react';
import { render, screen, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import { UserForm } from './UserForm';

describe('UserForm', () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and submits create form', async () => {
    render(<UserForm isOpen={true} onClose={onCloseMock} />);
    const user = userEvent.setup();
    
    expect(screen.getByText('Crear Usuario')).toBeInTheDocument();
    
    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Nombre'), 'Test');
    await user.type(screen.getByLabelText('Apellido'), 'User');
    await user.type(screen.getByLabelText('Contraseña'), 'password123');
    
    const submitBtn = screen.getByRole('button', { name: /Guardar/i });
    const clickPromise = user.click(submitBtn);
    
    expect(await screen.findByText('Guardando...')).toBeInTheDocument();
    
    await clickPromise;
    
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  it('renders edit form correctly and submits', async () => {
    const userToEdit = {
      id: '1',
      email: 'edit@test.com',
      first_name: 'Edit',
      last_name: 'User',
      is_active: true,
      is_superuser: false,
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    };
    render(<UserForm isOpen={true} onClose={onCloseMock} userToEdit={userToEdit} />);
    const user = userEvent.setup();
    
    expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
    expect(screen.getByDisplayValue('edit@test.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit')).toBeInTheDocument();
    expect(screen.getByDisplayValue('User')).toBeInTheDocument();
    
    const firstNameInput = screen.getByLabelText('Nombre');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Updated');
    
    const submitBtn = screen.getByRole('button', { name: /Guardar/i });
    await user.click(submitBtn);
    
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });
});
