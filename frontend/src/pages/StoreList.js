import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';
import StoreEditModal from '../components/StoreEditModal';

export default function StoreList() {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('stores');
  const [orderStoreFilter, setOrderStoreFilter] = useState('all');
  const [orderTimeFilter, setOrderTimeFilter] = useState('all');
  const navigate = useNavigate();

  // Check if user is admin
  const isAdmin = user && user.username === 'admin';

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3031/viewStores');
      const data = await res.json();
      setStores(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:3031/allOrders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchOrders();
  }, []);

  // Filter stores based on search term and status
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter orders based on store and time period
  const filteredOrders = orders.filter(order => {
    // Store filter
    const matchesStore = orderStoreFilter === 'all' || order.storeId === orderStoreFilter;
    
    // Time period filter
    let matchesTime = true;
    if (orderTimeFilter !== 'all') {
      const orderDate = new Date(order.orderDate);
      const now = new Date();
      const diffTime = Math.abs(now - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (orderTimeFilter) {
        case 'today':
          matchesTime = diffDays === 0;
          break;
        case 'week':
          matchesTime = diffDays <= 7;
          break;
        case 'month':
          matchesTime = diffDays <= 30;
          break;
        case 'quarter':
          matchesTime = diffDays <= 90;
          break;
        case 'year':
          matchesTime = diffDays <= 365;
          break;
        default:
          matchesTime = true;
      }
    }
    
    return matchesStore && matchesTime;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-success',
      inactive: 'bg-secondary',
      pending: 'bg-warning',
      suspended: 'bg-danger'
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

  const handleEditStore = (store) => {
    setSelectedStore(store);
    setShowEditModal(true);
  };

  const handleStatusChange = async (storeId, newStatus) => {
    try {
      const res = await fetch('http://localhost:3031/changeStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, status: newStatus })
      });
      
      if (res.ok) {
        await fetchStores(); // Refresh the list
      }
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/Admin" replace />;
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
        <div className="col-md-6">
          <h1 className="section-title mb-0">
            <i className="fas fa-shield-alt me-2 text-primary"></i>
            Admin Dashboard
          </h1>
          <p className="text-muted mt-2">
            Manage stores and monitor orders across the platform
          </p>
        </div>
        <div className="col-md-6 text-md-end">
          <div className="d-flex gap-2 justify-content-md-end">
            <Link to="/Admin/add-store" className="btn btn-success">
              <i className="fas fa-plus me-2"></i>
              Add Store
            </Link>
            <button 
              onClick={() => navigate('/Admin')}
              className="btn btn-outline-danger"
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <ul className="nav nav-tabs nav-fill" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'stores' ? 'active' : ''}`}
                onClick={() => setActiveTab('stores')}
              >
                <i className="fas fa-store me-2"></i>
                Stores ({stores.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="fas fa-shopping-cart me-2"></i>
                All Orders ({orders.length})
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Stores Tab */}
        {activeTab === 'stores' && (
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
                        placeholder="Search stores by name, location, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderRadius: '0' }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ borderRadius: '0' }}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="col-lg-3">
                    <button
                      className="btn btn-outline-dark w-100"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                      }}
                      style={{ borderRadius: '0' }}
                    >
                      <i className="fas fa-times me-2"></i>
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stores Table */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-store me-2"></i>
                  Store Management
                </h5>
              </div>
              <div className="card-body">
                {filteredStores.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-store fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No stores found</h5>
                    <p className="text-muted">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search criteria.' 
                        : 'No stores have been added yet.'
                      }
                    </p>
                    <Link to="/Admin/add-store" className="btn btn-primary">
                      <i className="fas fa-plus me-2"></i>
                      Add Your First Store
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Store</th>
                          <th>Location</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Products</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStores.map(store => (
                          <tr key={store.storeId}>
                            <td>
                              <div className="d-flex align-items-center">
                                {store.propic && (
                                  <img
                                    src={`http://localhost:3031/storeAssets/${store.propic}`}
                                    alt={store.storeName}
                                    className="rounded-circle me-3"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  />
                                )}
                                <div>
                                  <h6 className="mb-0">{store.storeName}</h6>
                                  {store.description && (
                                    <small className="text-muted">{store.description}</small>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <i className="fas fa-map-marker-alt me-1 text-muted"></i>
                              {store.location}
                            </td>
                            <td>
                              <small>{store.email}</small>
                            </td>
                            <td>
                              {getStatusBadge(store.status)}
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {store.products ? store.products.length : 0} products
                              </span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEditStore(store)}
                                  title="Edit Store"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <Link
                                  to={`/${store.storeName}`}
                                  className="btn btn-sm btn-outline-secondary"
                                  title="View Store"
                                  target="_blank"
                                >
                                  <i className="fas fa-external-link-alt"></i>
                                </Link>
                                <div className="btn-group" role="group">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    title="Change Status"
                                  >
                                    <i className="fas fa-toggle-on"></i>
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange(store.storeId, 'active')}
                                      >
                                        Activate
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange(store.storeId, 'inactive')}
                                      >
                                        Deactivate
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange(store.storeId, 'suspended')}
                                      >
                                        Suspend
                                      </button>
                                    </li>
                                  </ul>
                                </div>
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

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="tab-pane fade show active">
            {/* Order Filters */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-lg-4">
                    <label className="form-label fw-bold">
                      <i className="fas fa-store me-2"></i>
                      Filter by Store
                    </label>
                    <select
                      className="form-select"
                      value={orderStoreFilter}
                      onChange={(e) => setOrderStoreFilter(e.target.value)}
                      style={{ borderRadius: '0' }}
                    >
                      <option value="all">All Stores</option>
                      {stores.map(store => (
                        <option key={store.storeId} value={store.storeId}>
                          {store.storeName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-4">
                    <label className="form-label fw-bold">
                      <i className="fas fa-calendar me-2"></i>
                      Time Period
                    </label>
                    <select
                      className="form-select"
                      value={orderTimeFilter}
                      onChange={(e) => setOrderTimeFilter(e.target.value)}
                      style={{ borderRadius: '0' }}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                      <option value="quarter">Last 3 Months</option>
                      <option value="year">Last Year</option>
                    </select>
                  </div>
                  <div className="col-lg-4">
                    <label className="form-label fw-bold">
                      <i className="fas fa-filter me-2"></i>
                      Actions
                    </label>
                    <button
                      className="btn btn-outline-dark w-100"
                      onClick={() => {
                        setOrderStoreFilter('all');
                        setOrderTimeFilter('all');
                      }}
                      style={{ borderRadius: '0' }}
                    >
                      <i className="fas fa-times me-2"></i>
                      Clear Filters
                    </button>
                  </div>
                </div>
                {orderStoreFilter !== 'all' || orderTimeFilter !== 'all' ? (
                  <div className="mt-3">
                    <small className="text-muted">
                      <i className="fas fa-info-circle me-1"></i>
                      Showing {filteredOrders.length} orders
                      {orderStoreFilter !== 'all' && ` from ${stores.find(s => s.storeId === orderStoreFilter)?.storeName}`}
                      {orderTimeFilter !== 'all' && ` in the last ${orderTimeFilter === 'today' ? 'day' : orderTimeFilter === 'week' ? '7 days' : orderTimeFilter === 'month' ? '30 days' : orderTimeFilter === 'quarter' ? '3 months' : 'year'}`}
                    </small>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Orders Table */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="fas fa-shopping-cart me-2"></i>
                  All Orders ({filteredOrders.length} of {orders.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No orders found</h5>
                    <p className="text-muted">
                      {orderStoreFilter !== 'all' || orderTimeFilter !== 'all' 
                        ? 'Try adjusting your filter criteria.' 
                        : 'No orders have been placed yet.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Store</th>
                          <th>Product</th>
                          <th>Customer</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.orderId}>
                            <td>
                              <small className="text-muted">{order.orderId}</small>
                            </td>
                            <td>
                              <div>
                                <strong>{order.storeName}</strong>
                                <br />
                                <small className="text-muted">{order.storeId}</small>
                              </div>
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
      </div>

      {/* Store Edit Modal */}
      {showEditModal && selectedStore && (
        <StoreEditModal
          store={selectedStore}
          show={showEditModal}
          onHide={() => {
            setShowEditModal(false);
            setSelectedStore(null);
          }}
          onUpdate={fetchStores}
        />
      )}
    </div>
  );
}
