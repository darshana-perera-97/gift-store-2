import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function StoreAdminPage() {
  const { storeName } = useParams();
  const navigate = useNavigate();
  const [store] = useState(JSON.parse(localStorage.getItem('store')));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // if for some reason storeName mismatch, force back to login
    if (!store || store.storeName !== storeName) {
      localStorage.removeItem('store');
      return navigate(`/${storeName}/admin/login`);
    }
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3031/products/${store.storeId}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [storeName, navigate, store]);

  const handleLogout = () => {
    localStorage.removeItem('store');
    navigate(`/${storeName}/admin/login`);
  };

  // Filter products based on search term and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-success',
      inactive: 'bg-secondary',
      pending: 'bg-warning'
    };
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border loading-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="section-title mb-0">
            <i className="fas fa-store me-2 text-success"></i>
            {store.storeName} - Admin Dashboard
          </h1>
          <p className="text-muted mt-2">
            Manage your store products and settings
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="d-flex gap-2 justify-content-md-end">
            <button 
              onClick={handleLogout}
              className="btn btn-outline-danger"
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
            <Link to={`/${storeName}/admin/settings`} className="btn btn-outline-primary">
              <i className="fas fa-cog me-2"></i>
              Settings
            </Link>
            <Link to={`/${storeName}/admin/add-product`} className="btn btn-success">
              <i className="fas fa-plus me-2"></i>
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Store Info Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-2">
                  {store.propic && (
                    <img
                      src={`http://localhost:3031/storeAssets/${store.propic}`}
                      alt={store.storeName}
                      className="img-fluid rounded"
                      style={{ maxHeight: '100px', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="col-md-8">
                  <h5 className="card-title mb-1">{store.storeName}</h5>
                  <p className="card-text text-muted mb-1">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {store.location}
                  </p>
                  {store.description && (
                    <p className="card-text mb-0">{store.description}</p>
                  )}
                </div>
                <div className="col-md-2 text-md-end">
                  <span className="badge bg-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <ul className="nav nav-tabs nav-fill" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <i className="fas fa-tachometer-alt me-2"></i>
                Dashboard
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <i className="fas fa-box me-2"></i>
                Products ({products.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="fas fa-chart-line me-2"></i>
                Analytics
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <i className="fas fa-cog me-2"></i>
                Settings
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-pane fade show active">
            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card border-0 shadow-sm text-center h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="fas fa-box fa-2x text-primary me-3"></i>
                      <div>
                        <h3 className="mb-0 text-primary">{products.length}</h3>
                        <small className="text-muted">Total Products</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card border-0 shadow-sm text-center h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="fas fa-eye fa-2x text-info me-3"></i>
                      <div>
                        <h3 className="mb-0 text-info">0</h3>
                        <small className="text-muted">Store Views</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card border-0 shadow-sm text-center h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="fas fa-shopping-cart fa-2x text-success me-3"></i>
                      <div>
                        <h3 className="mb-0 text-success">0</h3>
                        <small className="text-muted">Total Orders</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card border-0 shadow-sm text-center h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="fas fa-star fa-2x text-warning me-3"></i>
                      <div>
                        <h3 className="mb-0 text-warning">0.0</h3>
                        <small className="text-muted">Average Rating</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Recent Products
                </h5>
              </div>
              <div className="card-body">
                {products.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="fas fa-box fa-2x text-muted mb-3"></i>
                    <h6 className="text-muted">No products yet</h6>
                    <p className="text-muted">Start by adding your first product</p>
                    <Link to={`/${storeName}/admin/add-product`} className="btn btn-primary btn-sm">
                      <i className="fas fa-plus me-2"></i>
                      Add Product
                    </Link>
                  </div>
                ) : (
                  <div className="row g-3">
                    {products.slice(0, 4).map(product => (
                      <div key={product.productId} className="col-lg-3 col-md-6">
                        <div className="card h-100">
                          {product.images[0] && (
                            <img
                              src={`http://localhost:3031/productImages/${product.images[0]}`}
                              className="card-img-top"
                              alt={product.productName}
                              style={{ height: '120px', objectFit: 'cover' }}
                            />
                          )}
                          <div className="card-body">
                            <h6 className="card-title">{product.productName}</h6>
                            <p className="text-primary fw-bold mb-0">Rs. {product.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">
                      <i className="fas fa-tools me-2"></i>
                      Quick Actions
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <Link to={`/${storeName}/admin/add-product`} className="btn btn-success w-100">
                          <i className="fas fa-plus me-2"></i>
                          Add New Product
                        </Link>
                      </div>
                      <div className="col-md-4">
                        <Link to={`/${storeName}`} className="btn btn-outline-primary w-100">
                          <i className="fas fa-store me-2"></i>
                          View Public Store
                        </Link>
                      </div>
                      <div className="col-md-4">
                        <button onClick={handleLogout} className="btn btn-outline-danger w-100">
                          <i className="fas fa-sign-out-alt me-2"></i>
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="tab-pane fade show active">
            {/* Filters */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-lg-6">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="fas fa-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search products by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div className="col-lg-3">
                    <Link to={`/${storeName}/admin/add-product`} className="btn btn-primary w-100">
                      <i className="fas fa-plus me-2"></i>
                      Add Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <i className="fas fa-box fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">No products found</h4>
                  <p className="text-muted">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search criteria.' 
                      : 'No products have been added yet.'
                    }
                  </p>
                  <Link to={`/${storeName}/admin/add-product`} className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Add Your First Product
                  </Link>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts.map(product => (
                  <div key={product.productId} className="col-lg-3 col-md-4 col-sm-6">
                    <div className="card h-100 product-card">
                      {product.images[0] && (
                        <img
                          src={`http://localhost:3031/productImages/${product.images[0]}`}
                          className="card-img-top"
                          alt={product.productName}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{product.productName}</h5>
                        <p className="card-text text-muted flex-grow-1">
                          {product.description || 'No description available'}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="h6 text-primary mb-0">Rs. {product.price}</span>
                          <div className="btn-group" role="group">
                            <Link 
                              to={`/product/${product.productId}`}
                              className="btn btn-outline-primary btn-sm"
                              title="View Product"
                              target="_blank"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>
                            <button 
                              className="btn btn-outline-success btn-sm"
                              title="Edit Product"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              title="Delete Product"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="tab-pane fade show active">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="fas fa-chart-line me-2"></i>
                  Store Analytics
                </h5>
              </div>
              <div className="card-body text-center py-5">
                <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Analytics Coming Soon</h5>
                <p className="text-muted">Detailed analytics and performance metrics will be available here.</p>
                <div className="row g-3 mt-4">
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Total Views</h6>
                        <h4 className="text-primary">0</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Total Orders</h6>
                        <h4 className="text-success">0</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Revenue</h6>
                        <h4 className="text-info">Rs. 0</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="text-muted">Rating</h6>
                        <h4 className="text-warning">0.0</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-pane fade show active">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="fas fa-cog me-2"></i>
                  Store Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="card-title">
                          <i className="fas fa-store me-2"></i>
                          Store Information
                        </h6>
                        <p className="text-muted">Update your store details and contact information.</p>
                        <button className="btn btn-outline-primary btn-sm">
                          <i className="fas fa-edit me-2"></i>
                          Edit Store Info
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="card-title">
                          <i className="fas fa-images me-2"></i>
                          Store Images
                        </h6>
                        <p className="text-muted">Update your profile picture and background image.</p>
                        <button className="btn btn-outline-primary btn-sm">
                          <i className="fas fa-upload me-2"></i>
                          Update Images
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="card-title">
                          <i className="fas fa-bell me-2"></i>
                          Notifications
                        </h6>
                        <p className="text-muted">Configure email notifications for new orders.</p>
                        <button className="btn btn-outline-primary btn-sm">
                          <i className="fas fa-cog me-2"></i>
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h6 className="card-title">
                          <i className="fas fa-shield-alt me-2"></i>
                          Security
                        </h6>
                        <p className="text-muted">Change your password and security settings.</p>
                        <button className="btn btn-outline-primary btn-sm">
                          <i className="fas fa-key me-2"></i>
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
