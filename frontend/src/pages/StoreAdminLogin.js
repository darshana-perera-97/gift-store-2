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
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0 mt-5">
            <div className="card-header bg-success text-white text-center py-4">
              <h3 className="mb-0">
                <i className="fas fa-store me-2"></i>
                Store Admin Login
              </h3>
              {storeInfo && (
                <p className="mb-0 mt-2">
                  <i className="fas fa-building me-1"></i>
                  {storeInfo.storeName}
                </p>
              )}
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="fas fa-envelope me-2"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter your store email"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock me-2"></i>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter your password"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Login to Store
                    </>
                  )}
                </button>
              </form>
              
              <div className="text-center mt-4">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Store: {storeName}
                </small>
              </div>
              
              <hr className="my-4" />
              
              <div className="text-center">
                <Link to={`/${storeName}`} className="btn btn-outline-secondary btn-sm">
                  <i className="fas fa-arrow-left me-1"></i>
                  Back to Store
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
