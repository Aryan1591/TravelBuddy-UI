import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Or however you're storing authentication

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default AuthenticatedRoute;