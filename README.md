# GiftStore - Gift Marketplace Platform

A modern gift marketplace platform that connects local stores with customers, featuring a beautiful carousel, store listings, and product management.

## Page Structure

### 01. Home Page (`/`)
- **URL**: `/`
- **Visibility**: Public (Customer-facing)
- **Features**:
  - Hero carousel with promotional content
  - Store list with card view (background image, store icon, name, ratings, view button)
  - Featured products with card view (product image, name, view button)

### 02. Single Store Page (`/[storeName]`)
- **URL**: `/[storeName]` (e.g., `/my-gift-store`)
- **Visibility**: Public (Customer-facing)
- **Features**:
  - Store name, description, background image, store icon
  - Products grid with card view (product image, name, view button)
  - Store information section

### 03. Single Product Page (`/product/:productId`)
- **URL**: `/product/:productId` (e.g., `/product/p_001`)
- **Visibility**: Public (Customer-facing)
- **Features**:
  - Product images gallery
  - Product details and description
  - Order form with customer information
  - Sends email to store with order details

### 04. Super Admin (`/Admin`)
- **URL**: `/Admin`
- **Visibility**: Admin only (Login: admin/admin)
- **Features**:
  - Store management (add, edit, status control)
  - Store listing and analytics
  - System administration

### 05. Store Admin (`/[storeName]/admin`)
- **URL**: `/[storeName]/admin` (e.g., `/my-gift-store/admin`)
- **Visibility**: Store owners (Login: store email/password)
- **Features**:
  - Product management (add, edit products)
  - Store settings (description, background)
  - Order analytics and management

## Features

### Customer Features
- Browse stores and products
- View detailed product information
- Place orders with contact information
- Responsive design for all devices

### Store Admin Features
- Product management
- Store customization
- Order notifications via email
- Analytics dashboard

### Super Admin Features
- Store management
- System administration
- User management
- Platform analytics

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Bootstrap for styling
- React Responsive Carousel

### Backend
- Node.js
- Express.js
- Nodemailer for email notifications
- Multer for file uploads
- JSON file-based data storage

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gift-store-2
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Start the application**
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend development server
   cd ../frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3031

## Usage

### For Customers
1. Visit the home page to browse stores and products
2. Click on a store to view its products
3. Click on a product to view details and place an order
4. Fill in your contact information and submit the order

### For Store Admins
1. Navigate to `/[your-store-name]/admin/login`
2. Login with your store email and password
3. Manage your products and store settings
4. View incoming orders via email notifications

### For Super Admins
1. Navigate to `/Admin`
2. Login with username: `admin`, password: `admin`
3. Manage all stores and system settings

## File Structure

```
gift-store-2/
├── backend/
│   ├── index.js              # Main server file
│   ├── stores.json           # Store data
│   ├── products.json         # Product data
│   ├── storeAssets/          # Store images
│   └── productImages/        # Product images
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main app with routing
│   │   ├── pages/
│   │   │   ├── HomePage.js   # Home page with carousel
│   │   │   ├── StoreCustomerPage.js  # Single store view
│   │   │   ├── ProductPage.js        # Single product view
│   │   │   ├── AdminPage.js          # Super admin
│   │   │   ├── StoreAdminPage.js     # Store admin
│   │   │   └── ...
│   │   └── components/
│   └── public/
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.