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
import HomePage from "./pages/HomePage";
import StoreCustomerPage from "./pages/StoreCustomerPage";
import ProductPage from "./pages/ProductPage";

// --- Store-Admin pages & guard ---
import StoreAdminLogin from "./pages/StoreAdminLogin";
import StoreAdminPage from "./pages/StoreAdminPage";
import AddProduct from "./pages/AddProduct";
import StoreAdminRoute from "./components/StoreAdminRoute";

// --- Store Management ---
import StoreManagement from "./pages/StoreManagement";
import EditProduct from "./pages/EditProduct";

// --- Store Request ---
import StoreRequest from "./pages/StoreRequest";
import StoreRequestSuccess from "./pages/StoreRequestSuccess";

// --- Store Settings ---
import StoreSettings from "./pages/StoreSettings";

// --- Public Pages ---
import AllStores from "./pages/AllStores";
import AllProducts from "./pages/AllProducts";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navigation />
          <main className="flex-grow-1">
            <Routes>
              {/* 01. Home page - URL: / */}
              <Route path="/" element={<HomePage />} />

              {/* 02. Single Store - URL: /[storeName] */}
              <Route path="/:storeName" element={<StoreCustomerPage />} />

              {/* 03. Single Product Page - URL: /productid */}
              <Route path="/product/:productId" element={<ProductPage />} />

              {/* 04. Super Admin - URL: /Admin */}
              <Route path="/Admin" element={<AdminPage />} />
              <Route
                path="/Admin/stores"
                element={
                  <PrivateRoute>
                    <StoreList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Admin/add-store"
                element={
                  <PrivateRoute>
                    <AddStore />
                  </PrivateRoute>
                }
              />

              {/* 05. Store Admin - URL: /[storeName]/admin */}
              <Route
                path="/:storeName/admin/login"
                element={<StoreAdminLogin />}
              />
              <Route
                path="/:storeName/admin"
                element={
                  <StoreAdminRoute>
                    <StoreAdminPage />
                  </StoreAdminRoute>
                }
              />
              <Route
                path="/:storeName/admin/add-product"
                element={
                  <StoreAdminRoute>
                    <AddProduct />
                  </StoreAdminRoute>
                }
              />

              {/* 06. Store Management - URL: /[storeName]/manage */}
              <Route
                path="/:storeName/manage"
                element={<StoreManagement />}
              />

              {/* 07. Edit Product - URL: /[storeName]/edit-product/[productId] */}
              <Route
                path="/:storeName/edit-product/:productId"
                element={<EditProduct />}
              />

              {/* 08. Store Request - URL: /storeRequest */}
              <Route path="/storeRequest" element={<StoreRequest />} />
              <Route path="/storeRequest/success" element={<StoreRequestSuccess />} />

              {/* 09. Store Settings - URL: /[storeName]/admin/settings */}
              <Route
                path="/:storeName/admin/settings"
                element={
                  <StoreAdminRoute>
                    <StoreSettings />
                  </StoreAdminRoute>
                }
              />

              {/* 10. All Stores - URL: /allStores */}
              <Route path="/allStores" element={<AllStores />} />

              {/* 11. All Products - URL: /allProducts */}
              <Route path="/allProducts" element={<AllProducts />} />

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
