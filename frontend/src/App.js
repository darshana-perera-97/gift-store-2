// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// --- Admin-side ---
import Login from "./pages/Login";
import StoreList from "./pages/StoreList";
import AddStore from "./pages/AddStore";
import { AuthProvider } from "./components/AuthProvider";
import { PrivateRoute } from "./components/PrivateRoute";

// --- Public Homepage ---
import HomePage from "./pages/HomePage";

// --- Customer-facing Store Page ---
import StoreCustomerPage from "./pages/StoreCustomerPage";

// --- Store-Admin pages & guard ---
import StoreAdminLogin from "./pages/StoreAdminLogin";
import StoreAdminPage from "./pages/StoreAdminPage";
import AddProduct from "./pages/AddProduct";
import StoreAdminRoute from "./components/StoreAdminRoute";

// --- Public Product Page ---
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Homepage */}
          <Route path="/" element={<HomePage />} />

          {/* Admin back-office */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/stores"
            element={
              <PrivateRoute>
                <StoreList />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-store"
            element={
              <PrivateRoute>
                <AddStore />
              </PrivateRoute>
            }
          />

          {/* Customer View of a Store */}
          <Route path="/store/:storeId" element={<StoreCustomerPage />} />

          {/* Store-Admin Login (per-store) */}
          <Route
            path="/store/:storeId/admin/login"
            element={<StoreAdminLogin />}
          />

          {/* Store-Admin Dashboard */}
          <Route
            path="/store/:storeId/admin"
            element={
              <StoreAdminRoute>
                <StoreAdminPage />
              </StoreAdminRoute>
            }
          />

          {/* Store-Admin Add Product */}
          <Route
            path="/store/:storeId/admin/add-product"
            element={
              <StoreAdminRoute>
                <AddProduct />
              </StoreAdminRoute>
            }
          />

          {/* Public Product Detail / Order Page */}
          <Route
            path="/store/:storeId/product/:productId"
            element={<ProductPage />}
          />

          {/* Fallback: redirect unknown URLs to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
