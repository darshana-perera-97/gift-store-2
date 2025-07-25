import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';

export default function StoreSettings() {
  const { storeName } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [storeData, setStoreData] = useState(null);
  const [activeSection, setActiveSection] = useState('general');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`/api/store/${storeName}/admin/verify`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          navigate(`/${storeName}/admin/login`);
          return;
        }

        const data = await response.json();
        if (!data.isAdmin) {
          navigate(`/${storeName}/admin/login`);
          return;
        }

        // Fetch store data
        const storeResponse = await fetch(`/api/store/${storeName}`);
        if (storeResponse.ok) {
          const storeInfo = await storeResponse.json();
          setStoreData(storeInfo);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate(`/${storeName}/admin/login`);
      }
    };

    checkAuth();
  }, [storeName, navigate]);

  const handleLogout = () => {
    logout();
    navigate(`/${storeName}/admin/login`);
  };

  const handleUpdateStoreInfo = async (formData) => {
    try {
      const response = await fetch(`/api/store/${storeName}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Store information updated successfully!');
        // Refresh store data
        const storeResponse = await fetch(`/api/store/${storeName}`);
        if (storeResponse.ok) {
          const storeInfo = await storeResponse.json();
          setStoreData(storeInfo);
        }
      } else {
        alert('Failed to update store information.');
      }
    } catch (error) {
      console.error('Error updating store info:', error);
      alert('Error updating store information.');
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`/api/store/${storeName}/admin/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        alert('Password changed successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to change password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password.');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading store settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-cog me-2"></i>
                Store Settings
              </h5>
            </div>
            <div className="list-group list-group-flush">
              <button
                className={`list-group-item list-group-item-action ${activeSection === 'general' ? 'active' : ''}`}
                onClick={() => setActiveSection('general')}
              >
                <i className="fas fa-store me-2"></i>
                General Settings
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeSection === 'images' ? 'active' : ''}`}
                onClick={() => setActiveSection('images')}
              >
                <i className="fas fa-images me-2"></i>
                Store Images
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeSection === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveSection('notifications')}
              >
                <i className="fas fa-bell me-2"></i>
                Notifications
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeSection === 'security' ? 'active' : ''}`}
                onClick={() => setActiveSection('security')}
              >
                <i className="fas fa-shield-alt me-2"></i>
                Security
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          {activeSection === 'general' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="fas fa-store me-2"></i>
                  General Settings
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleUpdateStoreInfo({
                    name: formData.get('name'),
                    description: formData.get('description'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                  });
                }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Store Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        defaultValue={storeData?.name || ''}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        defaultValue={storeData?.email || ''}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        defaultValue={storeData?.phone || ''}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        defaultValue={storeData?.address || ''}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="4"
                        defaultValue={storeData?.description || ''}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-save me-2"></i>
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'images' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="fas fa-images me-2"></i>
                  Store Images
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="card-title">Profile Picture</h6>
                        <div className="mb-3">
                          <img
                            src={storeData?.profileImage || '/default-store.png'}
                            alt="Store Profile"
                            className="img-fluid rounded"
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                          />
                        </div>
                        <input type="file" className="form-control" accept="image/*" />
                        <button className="btn btn-outline-primary btn-sm mt-2">
                          <i className="fas fa-upload me-2"></i>
                          Upload New Image
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body text-center">
                        <h6 className="card-title">Background Image</h6>
                        <div className="mb-3">
                          <img
                            src={storeData?.backgroundImage || '/default-background.png'}
                            alt="Store Background"
                            className="img-fluid rounded"
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                          />
                        </div>
                        <input type="file" className="form-control" accept="image/*" />
                        <button className="btn btn-outline-primary btn-sm mt-2">
                          <i className="fas fa-upload me-2"></i>
                          Upload New Image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="fas fa-bell me-2"></i>
                  Notification Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                      <label className="form-check-label" htmlFor="emailNotifications">
                        Email notifications for new orders
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="smsNotifications" />
                      <label className="form-check-label" htmlFor="smsNotifications">
                        SMS notifications for new orders
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="lowStockAlerts" defaultChecked />
                      <label className="form-check-label" htmlFor="lowStockAlerts">
                        Low stock alerts
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary">
                      <i className="fas fa-save me-2"></i>
                      Save Notification Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="fas fa-shield-alt me-2"></i>
                  Security Settings
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleChangePassword(
                    formData.get('currentPassword'),
                    formData.get('newPassword')
                  );
                }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="currentPassword"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="newPassword"
                        required
                        minLength="6"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        required
                        minLength="6"
                      />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-key me-2"></i>
                        Change Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(`/${storeName}/admin`)}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Dashboard
            </button>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 