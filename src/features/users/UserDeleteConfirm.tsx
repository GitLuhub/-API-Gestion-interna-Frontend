import React from 'react';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useDeleteUserMutation } from './usersApi';
import { useToast } from '../../components/common/Toast';
import { UserPublic } from '../../types/user';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userToDelete?: UserPublic;
}

export const UserDeleteConfirm = ({ isOpen, onClose, userToDelete }: Props) => {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const { showToast } = useToast();

  const handleConfirm = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id).unwrap();
      showToast('Usuario eliminado correctamente', 'success');
      onClose();
    } catch (err: any) {
      showToast(err?.data?.detail || 'Error al eliminar el usuario', 'error');
    }
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Eliminar Usuario"
      message={`¿Estás seguro de que deseas eliminar a "${userToDelete?.first_name} ${userToDelete?.last_name}"? El usuario será desactivado (soft delete).`}
      onConfirm={handleConfirm}
      onCancel={onClose}
      isLoading={isLoading}
    />
  );
};
