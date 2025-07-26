// src/pages/StoreAdminView.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buildApiUrl, getProductImageUrl } from '../apiConfig';

export default function StoreAdminView({ store }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [store.storeId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(buildApiUrl(`/products/${store.storeId}`));
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(buildApiUrl(`/storeOrders/${store.storeId}`));
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
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
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'confirmed':
        return 'badge bg-info text-white';
      case 'shipped':
        return 'badge bg-primary text-white';
      case 'delivered':
        return 'badge bg-success text-white';
      case 'cancelled':
        return 'badge bg-danger text-white';
      default:
        return 'badge bg-secondary text-white';
    }
  };

  const logout = () => {
    localStorage.removeItem("store");
    navigate("/store/login");
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

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading store data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100">
      {/* Header */}
      <div className="bg-light border-bottom">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0 fw-bold">{store.storeName} (Admin)</h1>
              <p className="text-muted mb-0">
                <i className="fas fa-map-marker-alt me-1"></i>
                {store.location}
              </p>
            </div>
            <button 
              onClick={logout}
              className="btn btn-outline-dark"
              style={{ borderRadius: '0' }}
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mt-4">
        <ul className="nav nav-tabs" style={{ borderBottom: '2px solid #dee2e6' }}>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
              style={{ 
                border: 'none', 
                borderRadius: '0',
                color: activeTab === 'products' ? '#333' : '#666',
                fontWeight: activeTab === 'products' ? '600' : '400'
              }}
            >
              <i className="fas fa-box me-2"></i>
              Products ({products.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
              style={{ 
                border: 'none', 
                borderRadius: '0',
                color: activeTab === 'orders' ? '#333' : '#666',
                fontWeight: activeTab === 'orders' ? '600' : '400'
              }}
            >
              <i className="fas fa-shopping-cart me-2"></i>
              Orders ({orders.length})
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'products' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 mb-0">Your Products</h2>
                <Link 
                  to={`/store/${store.storeId}/add-product`}
                  className="btn btn-primary"
                  style={{ borderRadius: '0' }}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add New Product
                </Link>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-box fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted mb-3">No products yet</h4>
                  <p className="text-muted mb-4">Start by adding your first product to your store.</p>
                  <Link 
                    to={`/store/${store.storeId}/add-product`}
                    className="btn btn-primary"
                    style={{ borderRadius: '0' }}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add Your First Product
                  </Link>
                </div>
              ) : (
                <div className="row g-4">
                  {products.map((product) => (
                    <div key={product.productId} className="col-lg-4 col-md-6">
                      <Link
                        to={`/store/${store.storeId}/product/${product.productId}`}
                        className="text-decoration-none"
                      >
                        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '0' }}>
                          {product.images && product.images[0] && (
                            <img
                              src={getProductImageUrl(product.images[0])}
                              className="card-img-top"
                              alt={product.productName}
                              style={{ height: '200px', objectFit: 'cover' }}
                            />
                          )}
                          <div className="card-body p-4">
                            <h5 className="card-title mb-2" style={{ color: '#333' }}>
                              {product.productName}
                            </h5>
                            <p className="text-primary fw-bold mb-2">Rs. {product.price}</p>
                            {product.description && (
                              <p className="card-text text-muted small">
                                {product.description.length > 100 
                                  ? `${product.description.substring(0, 100)}...` 
                                  : product.description
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="h4 mb-4">Order Management</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted mb-3">No orders yet</h4>
                  <p className="text-muted">Orders from customers will appear here.</p>
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
                            <span className={getStatusBadgeClass(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button 
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                style={{ borderRadius: '0' }}
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
          )}
        </div>
      </div>
    </div>
  );
}
