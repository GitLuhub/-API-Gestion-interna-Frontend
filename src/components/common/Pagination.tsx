import React from 'react';
import { PaginationMeta } from '../../types/api';

interface Props {
  meta?: PaginationMeta;
  onPageChange: (skip: number) => void;
}

export const Pagination = ({ meta, onPageChange }: Props) => {
  if (!meta || meta.total <= meta.limit) return null;

  const { total, skip, limit } = meta;
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{skip + 1}</span> a <span className="font-medium">{Math.min(skip + limit, total)}</span> de <span className="font-medium">{total}</span> resultados
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(0, skip - limit))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => onPageChange(skip + limit)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
