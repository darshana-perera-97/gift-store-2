// =============================================================================
// SINGLE FILE BACKEND CONFIGURATION
// =============================================================================
// Change the backend URL in this file to update all API calls across the app
// =============================================================================

// MAIN BACKEND URL - CHANGE THIS TO UPDATE ALL API CALLS
const BACKEND_URL = "http://69.197.187.24:3031";
// const BACKEND_URL = 'http://localhost:3031';

// Environment-specific URLs (optional - for different environments)
const ENVIRONMENT_URLS = {
  development: "http://69.197.187.24:3031",
  production: "https://your-production-api.com", // Change this
  staging: "https://your-staging-api.com", // Change this
};

// Get the current environment
const getCurrentEnvironment = () => {
  return process.env.NODE_ENV || "development";
};

// Get the appropriate URL for current environment
const getBackendUrl = () => {
  const env = getCurrentEnvironment();
  return ENVIRONMENT_URLS[env] || BACKEND_URL;
};

// API Endpoints
const API_ENDPOINTS = {
  // Store Management
  VIEW_STORES: "/viewStores",
  ADD_STORE: "/addStore",
  CHANGE_STATUS: "/changeStatus",

  // Product Management
  VIEW_PRODUCTS: "/viewProducts",
  ADD_PRODUCT: "/addProduct",
  UPDATE_PRODUCT: "/updateProduct",
  DELETE_PRODUCT: "/deleteProduct",

  // Order Management
  ORDER_PRODUCT: "/orderProduct",
  STORE_ORDERS: "/storeOrders",
  ALL_ORDERS: "/allOrders",
  UPDATE_ORDER_STATUS: "/updateOrderStatus",

  // File Uploads
  UPLOAD_STORE_IMAGE: "/uploadStoreImage",
  UPLOAD_PRODUCT_IMAGE: "/uploadProductImage",

  // Store Requests
  STORE_REQUEST: "/storeRequest",
};

// Asset Paths
const ASSET_PATHS = {
  STORE_IMAGES: "/storeAssets",
  PRODUCT_IMAGES: "/productImages",
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Build complete API URL
export const buildApiUrl = (endpoint) => {
  return `${getBackendUrl()}${endpoint}`;
};

// Build complete asset URL
export const buildAssetUrl = (assetPath, filename) => {
  return `${getBackendUrl()}${assetPath}/${filename}`;
};

// Get store image URL
export const getStoreImageUrl = (filename) => {
  return buildAssetUrl(ASSET_PATHS.STORE_IMAGES, filename);
};

// Get product image URL
export const getProductImageUrl = (filename) => {
  return buildAssetUrl(ASSET_PATHS.PRODUCT_IMAGES, filename);
};

// =============================================================================
// COMMON API CALLS
// =============================================================================

// Fetch stores
export const fetchStores = async () => {
  try {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.VIEW_STORES));
    return await response.json();
  } catch (error) {
    console.error("Error fetching stores:", error);
    return [];
  }
};

// Fetch products
export const fetchProducts = async () => {
  try {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.VIEW_PRODUCTS));
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fetch orders for a specific store
export const fetchStoreOrders = async (storeId) => {
  try {
    const response = await fetch(
      buildApiUrl(`${API_ENDPOINTS.STORE_ORDERS}/${storeId}`)
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching store orders:", error);
    return [];
  }
};

// Fetch all orders
export const fetchAllOrders = async () => {
  try {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.ALL_ORDERS));
    return await response.json();
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(
      buildApiUrl(API_ENDPOINTS.UPDATE_ORDER_STATUS),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
};

// Place order
export const placeOrder = async (orderData) => {
  try {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.ORDER_PRODUCT), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error placing order:", error);
    return { success: false, error: error.message };
  }
};

// Change store status
export const changeStoreStatus = async (storeId, status) => {
  try {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.CHANGE_STATUS), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId, status }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error changing store status:", error);
    return { success: false, error: error.message };
  }
};

// =============================================================================
// CONFIGURATION EXPORTS
// =============================================================================

// Export the main backend URL for direct access
export const BACKEND_BASE_URL = getBackendUrl();

// Export all endpoints
export const ENDPOINTS = API_ENDPOINTS;

// Export all asset paths
export const ASSETS = ASSET_PATHS;

// Export environment info
export const ENVIRONMENT = {
  current: getCurrentEnvironment(),
  url: getBackendUrl(),
  isDevelopment: getCurrentEnvironment() === "development",
  isProduction: getCurrentEnvironment() === "production",
  isStaging: getCurrentEnvironment() === "staging",
};

// =============================================================================
// USAGE EXAMPLES
// =============================================================================
/*
// In your component:
import { 
  buildApiUrl, 
  buildAssetUrl, 
  fetchStores, 
  fetchProducts,
  getStoreImageUrl,
  getProductImageUrl,
  BACKEND_BASE_URL 
} from '../apiConfig';

// Make API calls:
const stores = await fetchStores();
const products = await fetchProducts();

// Build URLs:
const apiUrl = buildApiUrl('/viewStores');
const imageUrl = getStoreImageUrl('store-image.jpg');

// Check environment:
console.log('Backend URL:', BACKEND_BASE_URL);
*/
