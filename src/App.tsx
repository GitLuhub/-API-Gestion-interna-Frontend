import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setCredentials } from './features/auth/authSlice';
import { useGetMeQuery } from './features/auth/authApi';
import { Layout } from './components/common/Layout';
import { ToastProvider } from './components/common/Toast';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const Login = lazy(() => import('./features/auth/Login').then(module => ({ default: module.Login })));
const UsersList = lazy(() => import('./features/users/UsersList').then(module => ({ default: module.UsersList })));
const RolesList = lazy(() => import('./features/roles/RolesList').then(module => ({ default: module.RolesList })));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard').then(module => ({ default: module.Dashboard })));

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  const { data: meResponse, isLoading } = useGetMeQuery();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (meResponse?.data && accessToken) {
      dispatch(setCredentials({ user: meResponse.data, accessToken }));
    }
  }, [meResponse, accessToken, dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner message="Verificando sesión..." />
      </div>
    );
  }

  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center bg-gray-50">
            <LoadingSpinner message="Cargando componente..." />
          </div>
        }>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <div className="py-4"><UsersList /></div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute>
                  <div className="py-4"><RolesList /></div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App;
