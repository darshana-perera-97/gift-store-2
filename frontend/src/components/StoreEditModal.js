import React, { useState, useEffect } from 'react';

export default function StoreEditModal({ store, onClose }) {
  const [formData, setFormData] = useState({
    storeName: store.storeName || '',
    location: store.location || '',
    email: store.email || '',
    tp: store.tp || '',
    description: store.description || '',
    status: store.status || 'active',
    password: store.password || ''
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchProducts();
  }, [store.storeId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:3031/products/${store.storeId}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3031/changeStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId: store.storeId, status: newStatus })
      });
      
      if (res.ok) {
        setFormData(prev => ({ ...prev, status: newStatus }));
        setMessage('Status updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating status');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('http://localhost:3031/updateStore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: store.storeId,
          storeName: formData.storeName,
          location: formData.location,
          email: formData.email,
          tp: formData.tp,
          description: formData.description
        })
      });
      
      if (res.ok) {
        setMessage('Store details updated successfully!');
        setTimeout(() => setMessage(''), 3000);
        // Update the store object with new data
        store.storeName = formData.storeName;
        store.location = formData.location;
        store.email = formData.email;
        store.tp = formData.tp;
        store.description = formData.description;
      } else {
        throw new Error('Failed to update store');
      }
    } catch (error) {
      setMessage('Error saving changes');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          {/* Header */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fas fa-edit me-2"></i>
              Edit Store: {store.storeName}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-0">
            {/* Navigation Tabs */}
            <ul className="nav nav-tabs nav-fill" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  <i className="fas fa-info-circle me-2"></i>
                  Store Details
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
                  className={`nav-link ${activeTab === 'images' ? 'active' : ''}`}
                  onClick={() => setActiveTab('images')}
                >
                  <i className="fas fa-images me-2"></i>
                  Images
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
            </ul>

            {/* Tab Content */}
            <div className="tab-content p-4">
              {/* Store Details Tab */}
              {activeTab === 'details' && (
                <div className="tab-pane fade show active">
                  {message && (
                    <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
                      <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                      {message}
                    </div>
                  )}

                  <div className="row">
                    {/* Store Images */}
                    <div className="col-lg-4 mb-4">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">
                            <i className="fas fa-images me-2"></i>
                            Store Images
                          </h6>
                        </div>
                        <div className="card-body">
                          {store.propic && (
                            <div className="mb-3">
                              <label className="form-label">Profile Picture</label>
                              <img
                                src={`http://localhost:3031/storeAssets/${store.propic}`}
                                alt="Profile"
                                className="img-fluid rounded"
                                style={{ maxHeight: '150px', objectFit: 'cover' }}
                              />
                            </div>
                          )}
                          {store.backgroundImage && (
                            <div>
                              <label className="form-label">Background Image</label>
                              <img
                                src={`http://localhost:3031/storeAssets/${store.backgroundImage}`}
                                alt="Background"
                                className="img-fluid rounded"
                                style={{ maxHeight: '150px', objectFit: 'cover' }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Store Information */}
                    <div className="col-lg-8">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">
                            <i className="fas fa-info-circle me-2"></i>
                            Store Information
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label">
                                <i className="fas fa-store me-2"></i>
                                Store Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                Location
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                <i className="fas fa-envelope me-2"></i>
                                Email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                <i className="fas fa-phone me-2"></i>
                                Phone
                              </label>
                              <input
                                type="tel"
                                className="form-control"
                                name="tp"
                                value={formData.tp}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">
                                <i className="fas fa-align-left me-2"></i>
                                Description
                              </label>
                              <textarea
                                className="form-control"
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleInputChange}
                              ></textarea>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                <i className="fas fa-lock me-2"></i>
                                Password
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                readOnly
                              />
                              <small className="text-muted">Password cannot be changed here</small>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">
                                <i className="fas fa-toggle-on me-2"></i>
                                Status
                              </label>
                              <div className="d-flex align-items-center gap-2">
                                {getStatusBadge(formData.status)}
                                <div className="dropdown">
                                  <button 
                                    className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    disabled={loading}
                                  >
                                    Change Status
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <button 
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange('active')}
                                        disabled={formData.status === 'active'}
                                      >
                                        <i className="fas fa-check text-success me-2"></i>
                                        Activate
                                      </button>
                                    </li>
                                    <li>
                                      <button 
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange('inactive')}
                                        disabled={formData.status === 'inactive'}
                                      >
                                        <i className="fas fa-pause text-warning me-2"></i>
                                        Deactivate
                                      </button>
                                    </li>
                                    <li>
                                      <button 
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange('suspended')}
                                        disabled={formData.status === 'suspended'}
                                      >
                                        <i className="fas fa-ban text-danger me-2"></i>
                                        Suspend
                                      </button>
                                    </li>
                                  </ul>
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

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="tab-pane fade show active">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Store Products ({products.length})</h5>
                    <a 
                      href={`/${store.storeName}/admin/login`} 
                      target="_blank" 
                      className="btn btn-primary btn-sm"
                    >
                      <i className="fas fa-plus me-2"></i>
                      Add Product
                    </a>
                  </div>
                  
                  {products.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-box fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">No products yet</h5>
                      <p className="text-muted">This store hasn't added any products.</p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {products.map(product => (
                        <div key={product.productId} className="col-lg-4 col-md-6">
                          <div className="card h-100">
                            {product.images[0] && (
                              <img
                                src={`http://localhost:3031/productImages/${product.images[0]}`}
                                className="card-img-top"
                                alt={product.productName}
                                style={{ height: '150px', objectFit: 'cover' }}
                              />
                            )}
                            <div className="card-body">
                              <h6 className="card-title">{product.productName}</h6>
                              <p className="card-text text-muted small">
                                {product.description}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="text-primary fw-bold">Rs. {product.price}</span>
                                <a 
                                  href={`/product/${product.productId}`} 
                                  target="_blank"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="fas fa-eye"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Images Tab */}
              {activeTab === 'images' && (
                <div className="tab-pane fade show active">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">
                            <i className="fas fa-user-circle me-2"></i>
                            Profile Picture
                          </h6>
                        </div>
                        <div className="card-body text-center">
                          {store.propic ? (
                            <div>
                              <img
                                src={`http://localhost:3031/storeAssets/${store.propic}`}
                                alt="Profile"
                                className="img-fluid rounded mb-3"
                                style={{ maxHeight: '200px', objectFit: 'cover' }}
                              />
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="fas fa-edit me-2"></i>
                                Change Profile Picture
                              </button>
                            </div>
                          ) : (
                            <div className="py-4">
                              <i className="fas fa-user-circle fa-3x text-muted mb-3"></i>
                              <p className="text-muted">No profile picture uploaded</p>
                              <button className="btn btn-primary btn-sm">
                                <i className="fas fa-upload me-2"></i>
                                Upload Profile Picture
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">
                            <i className="fas fa-image me-2"></i>
                            Background Image
                          </h6>
                        </div>
                        <div className="card-body text-center">
                          {store.backgroundImage ? (
                            <div>
                              <img
                                src={`http://localhost:3031/storeAssets/${store.backgroundImage}`}
                                alt="Background"
                                className="img-fluid rounded mb-3"
                                style={{ maxHeight: '200px', objectFit: 'cover' }}
                              />
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="fas fa-edit me-2"></i>
                                Change Background
                              </button>
                            </div>
                          ) : (
                            <div className="py-4">
                              <i className="fas fa-image fa-3x text-muted mb-3"></i>
                              <p className="text-muted">No background image uploaded</p>
                              <button className="btn btn-primary btn-sm">
                                <i className="fas fa-upload me-2"></i>
                                Upload Background
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="tab-pane fade show active">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <div className="card border-0 shadow-sm text-center">
                        <div className="card-body">
                          <i className="fas fa-box fa-2x text-primary mb-2"></i>
                          <h4 className="text-primary">{products.length}</h4>
                          <p className="text-muted mb-0">Total Products</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-0 shadow-sm text-center">
                        <div className="card-body">
                          <i className="fas fa-eye fa-2x text-info mb-2"></i>
                          <h4 className="text-info">0</h4>
                          <p className="text-muted mb-0">Store Views</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-0 shadow-sm text-center">
                        <div className="card-body">
                          <i className="fas fa-shopping-cart fa-2x text-success mb-2"></i>
                          <h4 className="text-success">0</h4>
                          <p className="text-muted mb-0">Total Orders</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-0 shadow-sm text-center">
                        <div className="card-body">
                          <i className="fas fa-star fa-2x text-warning mb-2"></i>
                          <h4 className="text-warning">0.0</h4>
                          <p className="text-muted mb-0">Average Rating</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card border-0 shadow-sm mt-3">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="fas fa-chart-line me-2"></i>
                        Store Performance
                      </h6>
                    </div>
                    <div className="card-body text-center py-5">
                      <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">Analytics Coming Soon</h5>
                      <p className="text-muted">Detailed analytics and performance metrics will be available here.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <div className="d-flex gap-2">
              <a 
                href={`/${store.storeName}`} 
                target="_blank"
                className="btn btn-outline-info"
              >
                <i className="fas fa-eye me-2"></i>
                View Store
              </a>
              <a 
                href={`/${store.storeName}/admin/login`} 
                target="_blank"
                className="btn btn-outline-success"
              >
                <i className="fas fa-cog me-2"></i>
                Store Admin
              </a>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 