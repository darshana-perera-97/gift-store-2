// Backend API Configuration
export const API_CONFIG = {
  // Main backend URL - change this to switch between environments
  BASE_URL: 'http://localhost:3031',
  
  // API endpoints
  ENDPOINTS: {
    // Store endpoints
    VIEW_STORES: '/viewStores',
    ADD_STORE: '/addStore',
    CHANGE_STATUS: '/changeStatus',
    
    // Product endpoints
    VIEW_PRODUCTS: '/viewProducts',
    ADD_PRODUCT: '/addProduct',
    UPDATE_PRODUCT: '/updateProduct',
    DELETE_PRODUCT: '/deleteProduct',
    
    // Order endpoints
    ORDER_PRODUCT: '/orderProduct',
    STORE_ORDERS: '/storeOrders',
    ALL_ORDERS: '/allOrders',
    UPDATE_ORDER_STATUS: '/updateOrderStatus',
    
    // File upload endpoints
    UPLOAD_STORE_IMAGE: '/uploadStoreImage',
    UPLOAD_PRODUCT_IMAGE: '/uploadProductImage',
    
    // Store request endpoints
    STORE_REQUEST: '/storeRequest',
  },
  
  // File paths for static assets
  ASSETS: {
    STORE_IMAGES: '/storeAssets',
    PRODUCT_IMAGES: '/productImages',
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to build asset URLs
export const buildAssetUrl = (assetPath, filename) => {
  return `${API_CONFIG.BASE_URL}${assetPath}/${filename}`;
};

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    BASE_URL: 'http://localhost:3031',
  },
  production: {
    BASE_URL: 'https://your-production-api.com', // Change this to your production URL
  },
  staging: {
    BASE_URL: 'https://your-staging-api.com', // Change this to your staging URL
  }
};

// Get current environment
export const getCurrentEnv = () => {
  return process.env.NODE_ENV || 'development';
};

// Get configuration for current environment
export const getConfig = () => {
  const env = getCurrentEnv();
  return {
    ...API_CONFIG,
    BASE_URL: ENV_CONFIG[env]?.BASE_URL || API_CONFIG.BASE_URL,
  };
}; 