import React, { useEffect, useState } from 'react';
import { useCreateUserMutation, useUpdateUserMutation } from './usersApi';
import { UserPublic } from '../../types/user';
import { useToast } from '../../components/common/Toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: UserPublic;
}

export const UserForm = ({ isOpen, onClose, userToEdit }: Props) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSuperuser, setIsSuperuser] = useState(false);
  
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { showToast } = useToast();

  useEffect(() => {
    if (userToEdit) {
      setEmail(userToEdit.email);
      setFirstName(userToEdit.first_name);
      setLastName(userToEdit.last_name);
      setPassword('');
      setIsActive(userToEdit.is_active);
      setIsSuperuser(userToEdit.is_superuser);
    } else {
      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('');
      setIsActive(true);
      setIsSuperuser(false);
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userToEdit) {
        await updateUser({ id: userToEdit.id, data: { email, first_name: firstName, last_name: lastName, is_active: isActive, is_superuser: isSuperuser } }).unwrap();
        showToast('Usuario actualizado correctamente', 'success');
      } else {
        await createUser({ email, first_name: firstName, last_name: lastName, password, is_active: isActive, is_superuser: isSuperuser }).unwrap();
        showToast('Usuario creado correctamente', 'success');
      }
      onClose();
    } catch (err: any) {
      showToast(err?.data?.detail || 'Error al guardar el usuario', 'error');
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {userToEdit ? 'Editar Usuario' : 'Crear Usuario'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      id="first_name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido</label>
                    <input
                      id="last_name"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                {!userToEdit && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                )}
                <div className="flex items-center mt-4">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Usuario Activo
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="is_superuser"
                    type="checkbox"
                    checked={isSuperuser}
                    onChange={(e) => setIsSuperuser(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_superuser" className="ml-2 block text-sm text-gray-900">
                    Es Superusuario
                  </label>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
