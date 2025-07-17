import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';
import StoreModal from '../components/StoreModal';

export default function StoreList() {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
                         store.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
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

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
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
          <h1 className="section-title mb-0">Store Management</h1>
          <p className="text-muted mt-2">
            Manage all stores in the system
          </p>
        </div>
        <div className="col-md-6 text-md-end">
          <Link to="/admin/add-store" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Add New Store
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search stores by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
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
        <div className="col-md-3">
          <button 
            className="btn btn-outline-secondary w-100"
            onClick={fetchStores}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary">{stores.length}</h5>
              <p className="card-text">Total Stores</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-success">
                {stores.filter(s => s.status === 'active').length}
              </h5>
              <p className="card-text">Active Stores</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-warning">
                {stores.filter(s => s.status === 'pending').length}
              </h5>
              <p className="card-text">Pending Stores</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-secondary">
                {stores.filter(s => s.status === 'inactive').length}
              </h5>
              <p className="card-text">Inactive Stores</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-store fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">No stores found</h4>
          <p className="text-muted">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria.' 
              : 'No stores have been added yet.'
            }
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredStores.map(store => (
            <div key={store.storeId} className="col-lg-4 col-md-6">
              <div className="card h-100">
                {store.propic && (
                  <img
                    src={`http://localhost:3031/storeAssets/${store.propic}`}
                    className="card-img-top"
                    alt={store.storeName}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{store.storeName}</h5>
                    {getStatusBadge(store.status)}
                  </div>
                  <p className="card-text text-muted">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {store.location}
                  </p>
                  {store.description && (
                    <p className="card-text">{store.description}</p>
                  )}
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">ID: {store.storeId}</small>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedStore(store)}
                    >
                      <i className="fas fa-edit me-1"></i>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Store Modal */}
      {selectedStore && (
        <StoreModal
          store={selectedStore}
          onClose={() => {
            setSelectedStore(null);
            fetchStores();
          }}
        />
      )}
    </div>
  );
}
