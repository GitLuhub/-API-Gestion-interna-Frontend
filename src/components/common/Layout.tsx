import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../features/auth/authSlice';
import { useLogoutMutation } from '../../features/auth/authApi';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Error de red al cerrar sesión: se ignora y se limpia el estado local
    }
    dispatch(logout());
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Usuarios', path: '/users' },
    { name: 'Roles', path: '/roles' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-blue-600 border-b border-blue-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white font-bold text-xl">AdminApp</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname.startsWith(item.path)
                          ? 'bg-blue-700 text-white'
                          : 'text-white hover:bg-blue-500'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <span className="text-white text-sm mr-4">
                  {user?.first_name} {user?.last_name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="bg-blue-600 inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-500 focus:outline-none"
              >
                <span className="sr-only">Abrir menú principal</span>
                {mobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname.startsWith(item.path)
                      ? 'bg-blue-700 text-white'
                      : 'text-white hover:bg-blue-500'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-blue-700">
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div className="text-sm font-medium leading-none text-blue-200 mt-1">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-500 bg-red-500 hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};
