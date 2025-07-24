import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';
import StoreEditModal from '../components/StoreEditModal';

export default function StoreList() {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
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

  useEffect(() => {
    fetchStores();
  }, []);

  // Filter stores based on search term and status
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
    return matchesSearch && matchesStatus;
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
            <i className="fas fa-store me-2 text-primary"></i>
            Store Management
          </h1>
          <p className="text-muted mt-2">
            Manage all stores in the system - {stores.length} total stores
          </p>
        </div>
        <div className="col-md-6 text-md-end">
          <div className="d-flex gap-2 justify-content-md-end">
            <Link to="/Admin" className="btn btn-outline-secondary">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Admin
            </Link>
            <Link to="/Admin/add-store" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Add New Store
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm text-center h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-store fa-2x text-primary me-3"></i>
                <div>
                  <h3 className="mb-0 text-primary">{stores.length}</h3>
                  <small className="text-muted">Total Stores</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm text-center h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-check-circle fa-2x text-success me-3"></i>
                <div>
                  <h3 className="mb-0 text-success">
                    {stores.filter(s => s.status === 'active').length}
                  </h3>
                  <small className="text-muted">Active Stores</small>
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
                    {stores.filter(s => s.status === 'pending').length}
                  </h3>
                  <small className="text-muted">Pending Stores</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm text-center h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-pause-circle fa-2x text-secondary me-3"></i>
                <div>
                  <h3 className="mb-0 text-secondary">
                    {stores.filter(s => s.status === 'inactive').length}
                  </h3>
                  <small className="text-muted">Inactive Stores</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="col-lg-3">
              <button 
                className="btn btn-outline-primary w-100"
                onClick={fetchStores}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Table */}
      {filteredStores.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="fas fa-store fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">No stores found</h4>
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
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">
              <i className="fas fa-list me-2"></i>
              Store List ({filteredStores.length} stores)
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Store</th>
                    <th>Location</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Created</th>
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
                            <small className="text-muted">ID: {store.storeId}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <i className="fas fa-map-marker-alt text-muted me-2"></i>
                          {store.location}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div><i className="fas fa-envelope text-muted me-2"></i>{store.email}</div>
                          {store.tp && (
                            <div><i className="fas fa-phone text-muted me-2"></i>{store.tp}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getStatusBadge(store.status)}
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
                                  onClick={() => handleStatusChange(store.storeId, 'active')}
                                  disabled={store.status === 'active'}
                                >
                                  <i className="fas fa-check text-success me-2"></i>
                                  Activate
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => handleStatusChange(store.storeId, 'inactive')}
                                  disabled={store.status === 'inactive'}
                                >
                                  <i className="fas fa-pause text-warning me-2"></i>
                                  Deactivate
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => handleStatusChange(store.storeId, 'suspended')}
                                  disabled={store.status === 'suspended'}
                                >
                                  <i className="fas fa-ban text-danger me-2"></i>
                                  Suspend
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date().toLocaleDateString()}
                        </small>
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
                            className="btn btn-sm btn-outline-info"
                            title="View Store"
                            target="_blank"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          <Link 
                            to={`/${store.storeName}/admin/login`}
                            className="btn btn-sm btn-outline-success"
                            title="Store Admin"
                            target="_blank"
                          >
                            <i className="fas fa-cog"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Store Edit Modal */}
      {showEditModal && selectedStore && (
        <StoreEditModal
          store={selectedStore}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStore(null);
            fetchStores();
          }}
        />
      )}
    </div>
  );
}
