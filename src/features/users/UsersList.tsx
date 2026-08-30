import React, { useState, useEffect } from 'react';
import { useGetUsersQuery } from './usersApi';
import { UserPublic } from '../../types/user';
import { Pagination } from '../../components/common/Pagination';
import { UserForm } from './UserForm';
import { UserDeleteConfirm } from './UserDeleteConfirm';
import { UserRolesManager } from './UserRolesManager';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const UsersList = () => {
  const [skip, setSkip] = useState(0);
  const { data: response, isLoading, isError } = useGetUsersQuery({ skip, limit: 10 });
  const users = response?.data;
  const meta = response?.meta;

  useEffect(() => {
    document.title = 'Usuarios - API Gestión Interna';
  }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserPublic | undefined>();
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserPublic | undefined>();

  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const [userForRoles, setUserForRoles] = useState<UserPublic | undefined>();

  const handleCreate = () => {
    setUserToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (user: UserPublic) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: UserPublic) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const handleManageRoles = (user: UserPublic) => {
    setUserForRoles(user);
    setIsRolesOpen(true);
  };

  if (isLoading) return <LoadingSpinner message="Cargando usuarios..." />;
  if (isError) return <ErrorMessage message="Error al cargar usuarios" />;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Usuarios</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Crear Usuario
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users?.map((user: UserPublic) => (
            <li key={user.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">{user.first_name} {user.last_name}</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleManageRoles(user)}
                      className="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Roles
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {user.email}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500 sm:mt-0">
                    {user.is_superuser && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    )}
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Creado: {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
          {(!users || users.length === 0) && (
            <li className="px-4 py-4 sm:px-6 text-gray-500 text-center">No hay usuarios registrados</li>
          )}
        </ul>
        {meta && (
          <Pagination meta={meta} onPageChange={(newSkip) => setSkip(newSkip)} />
        )}
      </div>

      <UserForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        userToEdit={userToEdit} 
      />
      <UserDeleteConfirm 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        userToDelete={userToDelete} 
      />
      <UserRolesManager
        isOpen={isRolesOpen}
        onClose={() => setIsRolesOpen(false)}
        user={userForRoles}
      />
    </div>
  );
};
