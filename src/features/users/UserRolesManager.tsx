import React, { useState } from 'react';
import { useAssignRoleMutation, useRevokeRoleMutation } from '../roles/rolesApi';
import { useGetRolesQuery } from '../roles/rolesApi';
import { useToast } from '../../components/common/Toast';
import { UserPublic } from '../../types/user';
import { RolePublic } from '../../types/role';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user?: UserPublic;
}

export const UserRolesManager = ({ isOpen, onClose, user }: Props) => {
  const { data: rolesResponse, isLoading: rolesLoading } = useGetRolesQuery({ limit: 100 });
  const [assignRole, { isLoading: isAssigning }] = useAssignRoleMutation();
  const [revokeRole, { isLoading: isRevoking }] = useRevokeRoleMutation();
  const { showToast } = useToast();

  const [selectedRole, setSelectedRole] = useState<string>('');

  if (!isOpen || !user) return null;

  const allRoles = rolesResponse?.data || [];
  // Currently we don't have user.roles in UserPublic from the GET /users list endpoint.
  // The backend might return roles in GET /users/{id} but for the MVP let's assume we can assign roles
  // directly. Ideally we'd know which roles the user has. 
  // Wait, the backend UserPublic schema does NOT include roles!
  // So we can only blindly assign or revoke. 

  const handleAssign = async () => {
    if (!selectedRole) return;
    try {
      await assignRole({ roleId: selectedRole, userId: user.id }).unwrap();
      showToast('Rol asignado correctamente', 'success');
      setSelectedRole('');
    } catch (err: any) {
      showToast(err?.data?.detail || 'Error al asignar el rol', 'error');
    }
  };

  const handleRevoke = async (roleId: string) => {
    try {
      await revokeRole({ roleId, userId: user.id }).unwrap();
      showToast('Rol revocado correctamente', 'success');
    } catch (err: any) {
      showToast(err?.data?.detail || 'Error al revocar el rol', 'error');
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Gestionar Roles - {user.first_name} {user.last_name}
            </h3>
            
            {rolesLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <select
                    id="role-select"
                    aria-label="Seleccionar rol para asignar"
                    className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">Seleccione un rol para asignar...</option>
                    {allRoles.map((role: RolePublic) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssign}
                    disabled={!selectedRole || isAssigning}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    Asignar
                  </button>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Acciones Rápidas de Revocación</h4>
                  <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                    {allRoles.map((role: RolePublic) => (
                      <li key={role.id} className="py-2 flex justify-between items-center">
                        <span className="text-sm text-gray-800">{role.name}</span>
                        <button
                          onClick={() => handleRevoke(role.id)}
                          disabled={isRevoking}
                          className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                        >
                          Revocar
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    Nota: Actualmente no se muestra la lista de roles asignados. Puede intentar asignar o revocar cualquier rol de la lista.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
