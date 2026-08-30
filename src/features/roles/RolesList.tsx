import React, { useState, useEffect } from 'react';
import { useGetRolesQuery } from './rolesApi';
import { RolePublic } from '../../types/role';
import { Pagination } from '../../components/common/Pagination';
import { RoleForm } from './RoleForm';
import { RoleDeleteConfirm } from './RoleDeleteConfirm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const RolesList = () => {
  const [skip, setSkip] = useState(0);
  const { data: response, isLoading, isError } = useGetRolesQuery({ skip, limit: 10 });
  const roles = response?.data;
  const meta = response?.meta;

  useEffect(() => {
    document.title = 'Roles - API Gestión Interna';
  }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RolePublic | undefined>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RolePublic | undefined>();

  const handleCreate = () => {
    setRoleToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (role: RolePublic) => {
    setRoleToEdit(role);
    setIsFormOpen(true);
  };

  const handleDelete = (role: RolePublic) => {
    setRoleToDelete(role);
    setIsDeleteOpen(true);
  };

  if (isLoading) return <LoadingSpinner message="Cargando roles..." />;
  if (isError) return <ErrorMessage message="Error al cargar roles" />;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Roles del Sistema</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Crear Rol
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {roles?.map((role: RolePublic) => (
            <li key={role.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-purple-600 truncate">{role.name}</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(role)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(role)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {role.description || 'Sin descripción'}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Creado el {new Date(role.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {(!roles || roles.length === 0) && (
            <li className="px-4 py-4 sm:px-6 text-gray-500 text-center">No hay roles registrados</li>
          )}
        </ul>
        {meta && (
          <Pagination meta={meta} onPageChange={(newSkip) => setSkip(newSkip)} />
        )}
      </div>

      <RoleForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        roleToEdit={roleToEdit} 
      />
      <RoleDeleteConfirm 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        roleToDelete={roleToDelete} 
      />
    </div>
  );
};
