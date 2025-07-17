// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Components
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// --- Admin-side ---
import AdminPage from "./pages/AdminPage";
import StoreList from "./pages/StoreList";
import AddStore from "./pages/AddStore";
import { AuthProvider } from "./components/AuthProvider";
import { PrivateRoute } from "./components/PrivateRoute";

// --- Public Pages ---
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import PublicStores from "./pages/PublicStores";

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
        <div className="d-flex flex-column min-vh-100">
          <Navigation />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Homepage */}
              <Route path="/home" element={<HomePage />} />

              {/* Public Store List - for visitors */}
              <Route path="/stores" element={<PublicStores />} />

              {/* Admin back-office */}
              <Route path="/admin" element={<AdminPage />} />
              <Route
                path="/admin/stores"
                element={
                  <PrivateRoute>
                    <StoreList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/add-store"
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
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
