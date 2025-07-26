# API Configuration Guide

## Overview
This project now uses a centralized configuration system for managing backend URLs and API endpoints. All API calls should use the configuration file instead of hardcoded URLs.

## File Location
- **Configuration File**: `src/config.js`
- **Main Backend URL**: Change in one place to update all API calls

## How to Use

### 1. Import the Configuration
```javascript
import { buildApiUrl, buildAssetUrl, API_CONFIG } from '../config';
```

### 2. Make API Calls
Instead of:
```javascript
const response = await fetch('http://69.197.187.24:3031/viewStores');
```

Use:
```javascript
const response = await fetch(buildApiUrl('/viewStores'));
```

### 3. Build Asset URLs
Instead of:
```javascript
src={`http://69.197.187.24:3031/storeAssets/${imageName}`}
```

Use:
```javascript
src={buildAssetUrl('/storeAssets', imageName)}
```

## Changing the Backend URL

### For Development
Edit `src/config.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://69.197.187.24:3031', // Change this
  // ... rest of config
};
```

### For Different Environments
The config supports multiple environments:
```javascript
export const ENV_CONFIG = {
  development: {
    BASE_URL: 'http://69.197.187.24:3031',
  },
  production: {
    BASE_URL: 'https://your-production-api.com',
  },
  staging: {
    BASE_URL: 'https://your-staging-api.com',
  }
};
```

## Available Helper Functions

### `buildApiUrl(endpoint)`
Builds a complete API URL:
```javascript
buildApiUrl('/viewStores') // Returns: http://69.197.187.24:3031/viewStores
```

### `buildAssetUrl(assetPath, filename)`
Builds a complete asset URL:
```javascript
buildAssetUrl('/storeAssets', 'store-image.jpg') 
// Returns: http://69.197.187.24:3031/storeAssets/store-image.jpg
```

### `getConfig()`
Gets the current environment configuration:
```javascript
const config = getConfig();
console.log(config.BASE_URL);
```

## Available Endpoints
All endpoints are defined in `API_CONFIG.ENDPOINTS`:
- `VIEW_STORES`: '/viewStores'
- `VIEW_PRODUCTS`: '/viewProducts'
- `ADD_STORE`: '/addStore'
- `ADD_PRODUCT`: '/addProduct'
- `ORDER_PRODUCT`: '/orderProduct'
- `STORE_ORDERS`: '/storeOrders'
- `ALL_ORDERS`: '/allOrders'
- And more...

## Migration Steps
1. Import the config in your component
2. Replace hardcoded URLs with `buildApiUrl()`
3. Replace hardcoded asset URLs with `buildAssetUrl()`
4. Test to ensure everything works

## Benefits
- **Single Source of Truth**: Change backend URL in one place
- **Environment Support**: Easy switching between dev/staging/production
- **Type Safety**: All endpoints are defined in one place
- **Maintainability**: Easier to update and manage API calls 