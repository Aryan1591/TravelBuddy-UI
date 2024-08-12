import React from 'react';
import { Navigate } from 'react-router-dom';
import isTokenExpired from './tokenValidation'; // Adjust the path if necessary

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!sessionStorage.getItem('username') && !isTokenExpired();

  console.log('Authenticated:', isAuthenticated); // Debugging line

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
