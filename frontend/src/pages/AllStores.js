import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildApiUrl, getStoreImageUrl } from '../apiConfig';

export default function AllStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch(buildApiUrl('/viewStores'));
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || store.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(stores.map(store => store.location))].sort();

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-light py-5 border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="fw-light mb-3" style={{ color: '#333' }}>
                Discover Amazing Stores
              </h1>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                Explore our curated collection of stores and find unique products that match your style.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="d-flex align-items-center justify-content-lg-end">
                <span className="text-muted me-3">{filteredStores.length} stores found</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mt-4">
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '0' }}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{ borderRadius: '0' }}
            >
              <option value="all">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-outline-dark w-100"
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('all');
              }}
              style={{ borderRadius: '0' }}
            >
              <i className="fas fa-times me-2"></i>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Stores Grid */}
        {filteredStores.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-store fa-3x text-muted mb-3"></i>
            <h4 className="text-muted mb-3">No stores found</h4>
            <p className="text-muted mb-4">
              {searchTerm || locationFilter !== 'all' 
                ? 'Try adjusting your search criteria.' 
                : 'No stores are available at the moment.'
              }
            </p>
            {(searchTerm || locationFilter !== 'all') && (
              <button
                className="btn btn-outline-dark"
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('all');
                }}
                style={{ borderRadius: '0' }}
              >
                <i className="fas fa-times me-2"></i>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {filteredStores.map(store => (
              <div key={store.storeId} className="col-lg-4 col-md-6">
                <Link 
                  to={`/${store.storeName}`}
                  className="text-decoration-none"
                >
                  <div className="card store-card h-100 border-0" 
                       style={{ 
                         borderRadius: '0',
                         boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                         transition: 'all 0.3s ease'
                       }}>
                    {store.backgroundImage && (
                      <img
                        src={getStoreImageUrl(store.backgroundImage)}
                        className="card-img-top"
                        alt={store.storeName}
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        {store.propic && (
                          <img
                            src={getStoreImageUrl(store.propic)}
                            alt={store.storeName}
                            className="rounded-circle me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <h5 className="card-title mb-1 fw-normal" style={{ color: '#333' }}>{store.storeName}</h5>
                          <div className="text-warning">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <span className="text-muted ms-2">(4.5)</span>
                          </div>
                        </div>
                      </div>
                      <p className="card-text text-muted mb-3">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {store.location}
                      </p>
                      {store.description && (
                        <p className="card-text text-muted mb-3">{store.description}</p>
                      )}
                      <button className="btn btn-outline-dark w-100" style={{ borderRadius: '0' }}>
                        <i className="fas fa-store me-2"></i>
                        View Store
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 