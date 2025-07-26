import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildApiUrl, getStoreImageUrl } from '../apiConfig';

export default function PublicStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await fetch(buildApiUrl('/viewStores'));
      const data = await res.json();
      // Only show active stores for public view
      const activeStores = data.filter(store => store.status === 'active');
      setStores(activeStores);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Filter stores based on search term
  const filteredStores = stores.filter(store => {
    return store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (store.description && store.description.toLowerCase().includes(searchTerm.toLowerCase()));
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
          <h1 className="section-title mb-0">Discover Amazing Stores</h1>
          <p className="text-muted mt-2">
            Explore our curated collection of local stores offering unique gifts and products
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to="/home" className="btn btn-outline-primary">
            <i className="fas fa-gift me-2"></i>
            Browse Products
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      {stores.length > 1 && (
        <div className="row mb-4">
          <div className="col-md-8 mx-auto">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search stores by name, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="btn btn-outline-secondary"
                onClick={fetchStores}
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Count */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="text-center">
            <h5 className="text-muted">
              {filteredStores.length} {filteredStores.length === 1 ? 'Store' : 'Stores'} Available
            </h5>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-store fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">No stores found</h4>
          <p className="text-muted">
            {searchTerm 
              ? 'Try adjusting your search criteria.' 
              : 'No stores are currently available. Please check back later.'
            }
          </p>
          {searchTerm && (
            <button 
              className="btn btn-outline-primary mt-3"
              onClick={() => setSearchTerm('')}
            >
              <i className="fas fa-times me-2"></i>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="row g-4">
          {filteredStores.map(store => (
            <div key={store.storeId} className="col-lg-4 col-md-6">
              <div className="card h-100 store-card">
                {store.propic && (
                  <img
                    src={getStoreImageUrl(store.propic)}
                    className="card-img-top"
                    alt={store.storeName}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{store.storeName}</h5>
                  <p className="card-text text-muted mb-2">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {store.location}
                  </p>
                  {store.description && (
                    <p className="card-text flex-grow-1">{store.description}</p>
                  )}
                  <div className="mt-auto">
                    <Link 
                      to={`/store/${store.storeId}`}
                      className="btn btn-primary w-100"
                    >
                      <i className="fas fa-store me-2"></i>
                      Visit Store
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Section */}
      {stores.length > 0 && (
        <section className="py-5 mt-5" style={{ background: 'linear-gradient(135deg, var(--primary-purple) 0%, var(--secondary-purple) 100%)' }}>
          <div className="container text-center text-white">
            <h2 className="mb-4">Can't Find What You're Looking For?</h2>
            <p className="lead mb-4">
              Browse our product catalog to discover amazing gifts from all our stores.
            </p>
            <Link to="/home" className="btn btn-light btn-lg">
              <i className="fas fa-gift me-2"></i>
              Browse All Products
            </Link>
          </div>
        </section>
      )}
    </div>
  );
} 