import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function StoreManagement() {
  const { storeName } = useParams();
  const navigate = useNavigate();
  
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Check if already authenticated
    const storedStore = localStorage.getItem('storeManagement');
    if (storedStore) {
      const parsedStore = JSON.parse(storedStore);
      if (parsedStore.storeName === storeName) {
        setStore(parsedStore);
        setAuthenticated(true);
        fetchProducts(parsedStore.storeId);
        return;
      }
    }
    setLoading(false);
  }, [storeName]);

  const fetchProducts = async (storeId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3031/products/${storeId}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await fetch('http://localhost:3031/viewStores');
      const stores = await response.json();
      const foundStore = stores.find(s => s.storeName === storeName && s.email === loginForm.email);

      if (foundStore && foundStore.password === loginForm.password) {
        setStore(foundStore);
        setAuthenticated(true);
        localStorage.setItem('storeManagement', JSON.stringify(foundStore));
        fetchProducts(foundStore.storeId);
      } else {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('storeManagement');
    setAuthenticated(false);
    setStore(null);
    setProducts([]);
    setLoginForm({ email: '', password: '' });
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const response = await fetch('http://localhost:3031/updateProductStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, status: newStatus })
      });

      if (response.ok) {
        // Update local state
        setProducts(prev => prev.map(product => 
          product.productId === productId 
            ? { ...product, status: newStatus }
            : product
        ));
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch('http://localhost:3031/deleteProduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        });

        if (response.ok) {
          setProducts(prev => prev.filter(product => product.productId !== productId));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
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
      live: 'bg-success',
      'out of stock': 'bg-danger',
      inactive: 'bg-secondary'
    };
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status}
      </span>
    );
  };

  // Login Form
  if (!authenticated) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white text-center">
                <h4 className="mb-0">
                  <i className="fas fa-store me-2"></i>
                  Store Management
                </h4>
                <p className="mb-0 mt-2">{storeName}</p>
              </div>
              <div className="card-body p-4">
                {loginError && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Store Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={loginLoading}
                      placeholder="Enter store email"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                      disabled={loginLoading}
                      placeholder="Enter password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Login to Manage Store
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <Link to={`/${storeName}`} className="text-muted">
                    <i className="fas fa-arrow-left me-1"></i>
                    Back to Store
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <i className="fas fa-cogs me-2 text-primary"></i>
            Store Management - {store.storeName}
          </h1>
          <p className="text-muted mt-2">
            Manage your products and inventory
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="d-flex gap-2 justify-content-md-end">
            <Link to={`/${storeName}`} className="btn btn-outline-secondary">
              <i className="fas fa-store me-2"></i>
              View Store
            </Link>
            <button onClick={handleLogout} className="btn btn-outline-danger">
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-2">
              {store.propic && (
                <img
                  src={`http://localhost:3031/storeAssets/${store.propic}`}
                  alt={store.storeName}
                  className="img-fluid rounded"
                  style={{ maxHeight: '80px', objectFit: 'cover' }}
                />
              )}
            </div>
            <div className="col-md-8">
              <h5 className="mb-1">{store.storeName}</h5>
              <p className="text-muted mb-1">
                <i className="fas fa-envelope me-2"></i>
                {store.email}
              </p>
              <p className="text-muted mb-0">
                <i className="fas fa-map-marker-alt me-2"></i>
                {store.location}
              </p>
            </div>
            <div className="col-md-2 text-md-end">
              <span className="badge bg-success">Authenticated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search products..."
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
                <option value="live">Live</option>
                <option value="out of stock">Out of Stock</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-lg-4">
              <div className="d-flex gap-2">
                <Link to={`/${storeName}/admin/add-product`} className="btn btn-success flex-grow-1">
                  <i className="fas fa-plus me-2"></i>
                  Add New Product
                </Link>
                <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <i className="fas fa-box me-2"></i>
            Products ({filteredProducts.length})
          </h5>
        </div>
        <div className="card-body p-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
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
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.productId}>
                      <td>
                        <div className="d-flex align-items-center">
                          {product.images[0] && (
                            <img
                              src={`http://localhost:3031/productImages/${product.images[0]}`}
                              alt={product.productName}
                              className="rounded me-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <h6 className="mb-0">{product.productName}</h6>
                            <small className="text-muted">
                              {product.description?.substring(0, 50)}...
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="fw-bold text-primary">Rs. {product.price}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getStatusBadge(product.status || 'live')}
                          <div className="dropdown ms-2">
                            <button 
                              className="btn btn-sm btn-outline-secondary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              <i className="fas fa-cog"></i>
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => handleStatusChange(product.productId, 'live')}
                                  disabled={product.status === 'live'}
                                >
                                  <i className="fas fa-check text-success me-2"></i>
                                  Set Live
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => handleStatusChange(product.productId, 'out of stock')}
                                  disabled={product.status === 'out of stock'}
                                >
                                  <i className="fas fa-times text-danger me-2"></i>
                                  Out of Stock
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => handleStatusChange(product.productId, 'inactive')}
                                  disabled={product.status === 'inactive'}
                                >
                                  <i className="fas fa-pause text-warning me-2"></i>
                                  Inactive
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link 
                            to={`/product/${product.productId}`}
                            className="btn btn-sm btn-outline-primary"
                            title="View Product"
                            target="_blank"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                                                      <Link 
                              to={`/${storeName}/edit-product/${product.productId}`}
                              className="btn btn-sm btn-outline-success"
                              title="Edit Product"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            title="Delete Product"
                            onClick={() => handleDeleteProduct(product.productId)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <h4 className="text-primary">{products.filter(p => p.status === 'live').length}</h4>
              <small className="text-muted">Live Products</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <h4 className="text-danger">{products.filter(p => p.status === 'out of stock').length}</h4>
              <small className="text-muted">Out of Stock</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <h4 className="text-secondary">{products.filter(p => p.status === 'inactive').length}</h4>
              <small className="text-muted">Inactive</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <h4 className="text-info">{products.length}</h4>
              <small className="text-muted">Total Products</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 