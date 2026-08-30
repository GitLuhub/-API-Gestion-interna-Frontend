import React from 'react';

export const LoadingSpinner = ({ message = 'Cargando...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
    <p className="text-gray-500 text-sm">{message}</p>
  </div>
);
