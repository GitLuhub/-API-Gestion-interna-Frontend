import React from 'react';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useDeleteRoleMutation } from './rolesApi';
import { useToast } from '../../components/common/Toast';
import { RolePublic } from '../../types/role';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roleToDelete?: RolePublic;
}

export const RoleDeleteConfirm = ({ isOpen, onClose, roleToDelete }: Props) => {
  const [deleteRole, { isLoading }] = useDeleteRoleMutation();
  const { showToast } = useToast();

  const handleConfirm = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRole(roleToDelete.id).unwrap();
      showToast('Rol eliminado correctamente', 'success');
      onClose();
    } catch (err: any) {
      showToast(err?.data?.detail || 'Error al eliminar el rol', 'error');
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Eliminar Rol"
      message={`¿Estás seguro de que deseas eliminar el rol "${roleToDelete?.name}"? Esta acción no se puede deshacer.`}
      onConfirm={handleConfirm}
      onCancel={onClose}
      isLoading={isLoading}
    />
  );
};
