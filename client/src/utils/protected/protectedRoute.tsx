import * as React from "react";
import { Navigate, Outlet } from 'react-router-dom';
import { type RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;