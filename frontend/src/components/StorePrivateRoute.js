// src/components/StorePrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function StorePrivateRoute({ children }) {
  const store = JSON.parse(localStorage.getItem('store'));
  return store ? children : <Navigate to="/store/login" replace />;
}
