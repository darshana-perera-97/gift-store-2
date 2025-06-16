// src/components/StoreAdminRoute.js
import React from "react";
import { Navigate, useParams } from "react-router-dom";

export default function StoreAdminRoute({ children }) {
  const { storeId } = useParams();
  const store = JSON.parse(localStorage.getItem("store"));
  if (!store || store.storeId !== storeId) {
    // not logged in as this store → go to that store’s admin login
    return <Navigate to={`/store/${storeId}/admin/login`} replace />;
  }
  return children;
}
