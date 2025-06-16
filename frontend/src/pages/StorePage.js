// src/pages/StorePage.js
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import StoreAdminView from "./StoreAdminView";
import StoreCustomerView from "./StoreCustomerView";

export default function StorePage() {
  const { storeId } = useParams();
  const stored = JSON.parse(localStorage.getItem("store"));
  const isAdmin = stored?.storeId === storeId;

  // if they’re _logged in_ but hit someone else’s store, log them out:
  if (stored && !isAdmin) {
    localStorage.removeItem("store");
    return <Navigate to="/store/login" replace />;
  }

  return isAdmin ? (
    <StoreAdminView store={stored} />
  ) : (
    <StoreCustomerView storeId={storeId} />
  );
}
