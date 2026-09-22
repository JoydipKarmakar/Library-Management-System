import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // If not logged in, redirect to login page. Otherwise, render the child routes.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
