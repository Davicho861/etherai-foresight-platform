import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  console.log('ProtectedRoute render, token:', window?.localStorage?.getItem('praevisio_token'));
  if (typeof window === 'undefined') return <>{children}</>;
  const token = window.localStorage.getItem('praevisio_token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
