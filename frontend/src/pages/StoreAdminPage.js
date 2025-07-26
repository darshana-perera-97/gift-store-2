import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { buildApiUrl, getStoreImageUrl, getProductImageUrl } from '../apiConfig';

export default function StoreAdminPage() {
  const { storeName } = useParams();
  const navigate = useNavigate();
  const [store] = useState(JSON.parse(localStorage.getItem('store')));
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
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

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsResponse = await fetch(buildApiUrl(`/products/${store.storeId}`));
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Fetch orders
        const ordersResponse = await fetch(buildApiUrl(`/storeOrders/${store.storeId}`));
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeName, navigate, store]);

  const handleLogout = () => {
    localStorage.removeItem('store');
    navigate(`/${storeName}/admin/login`);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(buildApiUrl('/updateOrderStatus'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        // Refresh orders after status update
        const ordersResponse = await fetch(buildApiUrl(`/storeOrders/${store.storeId}`));
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

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

  const getOrderStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-warning text-dark',
      confirmed: 'bg-info text-white',
      shipped: 'bg-primary text-white',
      delivered: 'bg-success text-white',
      cancelled: 'bg-danger text-white'
    };
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary text-white'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter products based on search term and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                      src={getStoreImageUrl(store.propic)}
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
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="fas fa-shopping-cart me-2"></i>
                Orders ({orders.length})
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
                      <i className="fas fa-shopping-cart fa-2x text-success me-3"></i>
                      <div>
                        <h3 className="mb-0 text-success">{orders.length}</h3>
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
                      <i className="fas fa-clock fa-2x text-warning me-3"></i>
                      <div>
                        <h3 className="mb-0 text-warning">
                          {orders.filter(order => order.status === 'pending').length}
                        </h3>
                        <small className="text-muted">Pending Orders</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card border-0 shadow-sm text-center h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="fas fa-check-circle fa-2x text-info me-3"></i>
                      <div>
                        <h3 className="mb-0 text-info">
                          {orders.filter(order => order.status === 'delivered').length}
                        </h3>
                        <small className="text-muted">Delivered Orders</small>
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
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h5 className="mb-0">
                      <i className="fas fa-box me-2"></i>
                      Products Management
                    </h5>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-2 justify-content-md-end">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: '200px' }}
                      />
                      <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ maxWidth: '150px' }}
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-box fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No products found</h5>
                    <p className="text-muted">Add your first product to get started</p>
                    <Link to={`/${storeName}/admin/add-product`} className="btn btn-primary">
                      <i className="fas fa-plus me-2"></i>
                      Add Product
                    </Link>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredProducts.map((product) => (
                      <div key={product.productId} className="col-lg-4 col-md-6">
                        <div className="card h-100 border-0 shadow-sm">
                          {product.images && product.images[0] && (
                            <img
                              src={getProductImageUrl(product.images[0])}
                              className="card-img-top"
                              alt={product.productName}
                              style={{ height: '200px', objectFit: 'cover' }}
                            />
                          )}
                          <div className="card-body">
                            <h6 className="card-title">{product.productName}</h6>
                            <p className="text-primary fw-bold mb-2">Rs. {product.price}</p>
                            {product.description && (
                              <p className="card-text small text-muted">
                                {product.description.length > 100
                                  ? `${product.description.substring(0, 100)}...`
                                  : product.description
                                }
                              </p>
                            )}
                            <div className="d-flex justify-content-between align-items-center">
                              {getStatusBadge(product.status)}
                              <Link
                                to={`/${storeName}/admin/product/${product.productId}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                Edit
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="tab-pane fade show active">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-shopping-cart me-2"></i>
                  Order Management
                </h5>
              </div>
              <div className="card-body">
                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No orders yet</h5>
                    <p className="text-muted">Orders from customers will appear here</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Product</th>
                          <th>Customer</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.orderId}>
                            <td>
                              <small className="text-muted">{order.orderId}</small>
                            </td>
                            <td>
                              <strong>{order.productName}</strong>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">{order.customerName}</div>
                                <small className="text-muted">{order.customerEmail}</small>
                              </div>
                            </td>
                            <td>{order.quantity}</td>
                            <td>
                              <strong className="text-primary">Rs. {order.totalAmount}</strong>
                            </td>
                            <td>
                              <small>{formatDate(order.orderDate)}</small>
                            </td>
                            <td>
                              {getOrderStatusBadge(order.status)}
                            </td>
                            <td>
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                >
                                  Update Status
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => updateOrderStatus(order.orderId, 'confirmed')}
                                    >
                                      Confirm Order
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => updateOrderStatus(order.orderId, 'shipped')}
                                    >
                                      Mark as Shipped
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => updateOrderStatus(order.orderId, 'delivered')}
                                    >
                                      Mark as Delivered
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item text-danger"
                                      onClick={() => updateOrderStatus(order.orderId, 'cancelled')}
                                    >
                                      Cancel Order
                                    </button>
                                  </li>
                                </ul>
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
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="tab-pane fade show active">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-chart-line me-2"></i>
                  Analytics
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  {/* Order Statistics Cards */}
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-white">
                        <h6 className="mb-0">
                          <i className="fas fa-chart-pie me-2"></i>
                          Order Statistics
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-6">
                            <div className="text-center p-3 bg-light rounded">
                              <h4 className="text-primary mb-1">{orders.length}</h4>
                              <small className="text-muted">Total Orders</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-3 bg-light rounded">
                              <h4 className="text-warning mb-1">
                                {orders.filter(o => o.status === 'pending').length}
                              </h4>
                              <small className="text-muted">Pending</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-3 bg-light rounded">
                              <h4 className="text-info mb-1">
                                {orders.filter(o => o.status === 'confirmed').length}
                              </h4>
                              <small className="text-muted">Confirmed</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-3 bg-light rounded">
                              <h4 className="text-primary mb-1">
                                {orders.filter(o => o.status === 'shipped').length}
                              </h4>
                              <small className="text-muted">Shipped</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-3 bg-light rounded">
                              <h4 className="text-success mb-1">
                                {orders.filter(o => o.status === 'delivered').length}
                              </h4>
                              <small className="text-muted">Delivered</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-3 bg-light rounded">
                              <h4 className="text-danger mb-1">
                                {orders.filter(o => o.status === 'cancelled').length}
                              </h4>
                              <small className="text-muted">Cancelled</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Overview Cards */}
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-white">
                        <h6 className="mb-0">
                          <i className="fas fa-dollar-sign me-2"></i>
                          Revenue Overview
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-12">
                            <div className="text-center p-4 bg-success bg-opacity-10 rounded">
                              <h3 className="text-success mb-2">
                                Rs. {orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                              </h3>
                              <p className="text-muted mb-0">Total Revenue</p>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-3 bg-opacity-10 rounded">
                              <h5 className="text-primary mb-1">
                                Rs. {orders.length > 0 ? (orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length).toFixed(2) : 0}
                              </h5>
                              <small className="text-muted">Average Order Value</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-3 bg-info bg-opacity-10 rounded">
                              <h5 className="text-info mb-1">
                                {orders.filter(o => o.status === 'delivered').length}
                              </h5>
                              <small className="text-muted">Completed Orders</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-white">
                        <h6 className="mb-0">
                          <i className="fas fa-tachometer-alt me-2"></i>
                          Performance Metrics
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-3">
                            <div className="text-center p-3 border rounded">
                              <i className="fas fa-box fa-2x text-primary mb-2"></i>
                              <h5 className="text-primary">{products.length}</h5>
                              <small className="text-muted">Total Products</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center p-3 border rounded">
                              <i className="fas fa-shopping-cart fa-2x text-success mb-2"></i>
                              <h5 className="text-success">{orders.length}</h5>
                              <small className="text-muted">Total Orders</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center p-3 border rounded">
                              <i className="fas fa-percentage fa-2x text-info mb-2"></i>
                              <h5 className="text-info">
                                {orders.length > 0 ? ((orders.filter(o => o.status === 'delivered').length / orders.length) * 100).toFixed(1) : 0}%
                              </h5>
                              <small className="text-muted">Completion Rate</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center p-3 border rounded">
                              <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                              <h5 className="text-warning">
                                {orders.length > 0 ? Math.round(orders.reduce((sum, order) => {
                                  const orderDate = new Date(order.orderDate);
                                  const now = new Date();
                                  return sum + (now - orderDate) / (1000 * 60 * 60 * 24);
                                }, 0) / orders.length) : 0}
                              </h5>
                              <small className="text-muted">Avg. Days Since Order</small>
                            </div>
                          </div>
                        </div>
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
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-cog me-2"></i>
                  Store Settings
                </h5>
              </div>
              <div className="card-body">
                <p className="text-muted">Store settings and configuration options will be available here.</p>
                <Link to={`/${storeName}/admin/settings`} className="btn btn-primary">
                  <i className="fas fa-cog me-2"></i>
                  Manage Settings
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
