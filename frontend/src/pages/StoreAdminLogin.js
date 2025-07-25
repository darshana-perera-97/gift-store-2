import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function StoreAdminLogin() {
  const { storeName } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [storeInfo, setStoreInfo] = useState(null);

  useEffect(() => {
    // Fetch store information to display store name
    const fetchStoreInfo = async () => {
      try {
        const res = await fetch('http://localhost:3031/viewStores');
        const stores = await res.json();
        const store = stores.find(s => s.storeName === storeName);
        if (store) {
          setStoreInfo(store);
        }
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };

    fetchStoreInfo();
  }, [storeName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3031/viewStores');
      const list = await res.json();
      const store = list.find(
        s => s.storeName === storeName &&
             s.email === email &&
             s.password === password &&
             s.status === 'active'
      );
      
      if (!store) {
        setError('Invalid credentials or store is suspended');
        return;
      }
      
      // Store in localStorage and go to admin dashboard
      localStorage.setItem('store', JSON.stringify(store));
      navigate(`/${storeName}/admin`);
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-light py-5 border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="fw-light mb-4" style={{ fontSize: '3rem', color: '#333' }}>
                Store Admin Panel
              </h1>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Access your store's administration dashboard to manage products, view orders, and monitor your business performance.
              </p>
              
              <div className="card border-0 shadow-sm" style={{ borderRadius: '0', maxWidth: '450px' }}>
                <div className="card-header bg-white border-bottom p-4" style={{ borderRadius: '0' }}>
                  <div className="text-center">
                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                         style={{ width: '60px', height: '60px' }}>
                      <i className="fas fa-store text-primary" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <h4 className="fw-light mb-0" style={{ color: '#333' }}>
                      Store Admin Login
                    </h4>
                    {storeInfo && (
                      <p className="text-muted small mb-0 mt-2">
                        <i className="fas fa-building me-1"></i>
                        {storeInfo.storeName}
                      </p>
                    )}
                    <p className="text-muted small mb-0 mt-2">Enter your credentials to access your store dashboard</p>
                  </div>
                </div>
                <div className="card-body p-4">
                  {error && (
                    <div className="alert alert-danger border-0 mb-4" role="alert" style={{ borderRadius: '0' }}>
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-normal" style={{ color: '#333' }}>
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="fas fa-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-start-0"
                          id="email"
                          placeholder="Enter your store email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          style={{ borderRadius: '0' }}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-normal" style={{ color: '#333' }}>
                        Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="fas fa-lock text-muted"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control border-start-0"
                          id="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          style={{ borderRadius: '0' }}
                        />
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-dark w-100"
                      disabled={loading}
                      style={{ borderRadius: '0', padding: '0.75rem' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In to Store
                        </>
                      )}
                    </button>
                  </form>
                  
                  <div className="text-center mt-4">
                    <div className="bg-light p-3" style={{ borderRadius: '0' }}>
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-2"></i>
                        <strong>Store:</strong> {storeName}
                      </small>
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <Link to={`/${storeName}`} className="btn btn-outline-dark btn-sm" style={{ borderRadius: '0' }}>
                      <i className="fas fa-arrow-left me-2"></i>
                      Back to Store
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                     style={{ width: '200px', height: '200px' }}>
                  <i className="fas fa-store text-muted" style={{ fontSize: '4rem' }}></i>
                </div>
                <h5 className="fw-light mb-3" style={{ color: '#333' }}>Store Administration</h5>
                <p className="text-muted">Manage your products, orders, and store settings</p>
                
                {storeInfo && (
                  <div className="mt-4">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '0', maxWidth: '300px', margin: '0 auto' }}>
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center">
                          {storeInfo.propic && (
                            <img
                              src={`http://localhost:3031/storeAssets/${storeInfo.propic}`}
                              alt={storeInfo.storeName}
                              className="rounded-circle me-3"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <h6 className="fw-normal mb-1" style={{ color: '#333' }}>{storeInfo.storeName}</h6>
                            <p className="text-muted small mb-0">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {storeInfo.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
