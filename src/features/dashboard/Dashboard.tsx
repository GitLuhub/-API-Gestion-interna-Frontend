import React, { useEffect } from 'react';
import { UsersList } from '../users/UsersList';
import { RolesList } from '../roles/RolesList';

export const Dashboard = () => {
  useEffect(() => {
    document.title = 'Dashboard - API Gestión Interna';
  }, []);
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Administrativo
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Resumen de actividad y acceso rápido a módulos.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UsersList />
        <RolesList />
      </div>
    </div>
  );
};
