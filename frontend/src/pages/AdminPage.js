import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function AdminPage() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is admin
  const isAdmin = user && user.username === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch active stores
        const storesResponse = await fetch('http://localhost:3031/viewStores');
        const storesData = await storesResponse.json();
        setStores(storesData.filter(s => s.status === 'active'));

        // Fetch all products
        const productsResponse = await fetch('http://localhost:3031/viewProducts');
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username === 'admin' && password === 'admin') {
        login(username);
        navigate('/Admin/stores');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

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
    <div className="bg-white">
      {/* Hero Section with Login */}
      <section className="bg-light py-5 border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="fw-light mb-4" style={{ fontSize: '3rem', color: '#333' }}>
                GiftStore Admin
              </h1>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Welcome to the GiftStore administration panel. Manage stores, products, and monitor your gift marketplace with powerful tools and insights.
              </p>
              
              {!isAdmin ? (
                <div className="card border-0 shadow-sm" style={{ borderRadius: '0', maxWidth: '400px' }}>
                  <div className="card-header bg-white border-bottom p-4" style={{ borderRadius: '0' }}>
                    <div className="text-center">
                      <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                           style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-user-shield text-primary" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h4 className="fw-light mb-0" style={{ color: '#333' }}>
                        Admin Login
                      </h4>
                      <p className="text-muted small mb-0 mt-2">Enter your credentials to access the admin panel</p>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    {error && (
                      <div className="alert alert-danger border-0 mb-4" role="alert" style={{ borderRadius: '0' }}>
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    )}
                    
                    <form onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label fw-normal" style={{ color: '#333' }}>
                          Username
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0">
                            <i className="fas fa-user text-muted"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0"
                            id="username"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loginLoading}
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
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loginLoading}
                            style={{ borderRadius: '0' }}
                          />
                        </div>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-dark w-100"
                        disabled={loginLoading}
                        style={{ borderRadius: '0', padding: '0.75rem' }}
                      >
                        {loginLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing In...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-sign-in-alt me-2"></i>
                            Sign In
                          </>
                        )}
                      </button>
                    </form>
                    
                    <div className="text-center mt-4">
                      <div className="bg-light p-3" style={{ borderRadius: '0' }}>
                        <small className="text-muted">
                          <i className="fas fa-info-circle me-2"></i>
                          <strong>Demo Credentials:</strong><br/>
                          Username: <code>admin</code><br/>
                          Password: <code>admin</code>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex gap-3">
                  <Link to="/Admin/stores" className="btn btn-dark btn-lg" style={{ borderRadius: '0' }}>
                    <i className="fas fa-store me-2"></i>
                    Manage Stores
                  </Link>
                  <Link to="/Admin/add-store" className="btn btn-outline-dark btn-lg" style={{ borderRadius: '0' }}>
                    <i className="fas fa-plus me-2"></i>
                    Add Store
                  </Link>
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                     style={{ width: '200px', height: '200px' }}>
                  <i className="fas fa-gift text-muted" style={{ fontSize: '4rem' }}></i>
                </div>
                <h5 className="fw-light mb-3" style={{ color: '#333' }}>Administration Panel</h5>
                <p className="text-muted">Manage your marketplace with powerful admin tools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-light mb-3" style={{ fontSize: '2.5rem', color: '#333' }}>Admin Features</h2>
            <p className="text-muted lead fw-light">Powerful tools to manage your marketplace</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center" style={{ borderRadius: '0' }}>
                <div className="card-body p-4">
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-store text-primary" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h5 className="fw-normal mb-3" style={{ color: '#333' }}>Store Management</h5>
                  <p className="text-muted">
                    Add, edit, and manage all stores in the marketplace. Monitor store status and performance with comprehensive tools.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center" style={{ borderRadius: '0' }}>
                <div className="card-body p-4">
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-chart-line text-primary" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h5 className="fw-normal mb-3" style={{ color: '#333' }}>Analytics</h5>
                  <p className="text-muted">
                    View detailed analytics and insights about store performance and customer engagement with real-time data.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center" style={{ borderRadius: '0' }}>
                <div className="card-body p-4">
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-cog text-primary" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h5 className="fw-normal mb-3" style={{ color: '#333' }}>System Control</h5>
                  <p className="text-muted">
                    Control system settings, manage user permissions, and maintain platform security with advanced controls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-light mb-3" style={{ fontSize: '2.5rem', color: '#333' }}>Featured Products</h2>
            <p className="text-muted lead fw-light">Discover amazing products from our marketplace</p>
          </div>
          <div className="row g-4">
            {products.slice(0, 8).map(product => (
              <div key={product.productId} className="col-lg-3 col-md-4 col-sm-6">
                <Link 
                  to={`/product/${product.productId}`}
                  className="text-decoration-none"
                >
                  <div className="card product-card h-100 border-0 shadow-sm" style={{ borderRadius: '0' }}>
                    {product.images[0] && (
                      <div className="position-relative">
                        <img
                          src={`http://localhost:3031/productImages/${product.images[0]}`}
                          className="card-img-top"
                          alt={product.productName}
                          style={{ height: '250px', objectFit: 'cover' }}
                        />
                        <div className="position-absolute top-0 start-0 m-2">
                          <span className="badge bg-primary" style={{ borderRadius: '0' }}>
                            New Arrival
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="card-body d-flex flex-column p-4">
                      <div className="mb-2">
                        <small className="text-muted fw-light">Featured Product</small>
                      </div>
                      <h6 className="fw-normal mb-2" style={{ fontSize: '1rem', color: '#333' }}>
                        {product.productName}
                      </h6>
                      <p className="text-muted flex-grow-1 small">
                        {product.description ? 
                          (product.description.length > 80 ? 
                            product.description.substring(0, 80) + '...' : 
                            product.description
                          ) : 
                          'Amazing product from our featured collection'
                        }
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div className="h6 text-primary mb-0">
                          Rs. {product.price?.toLocaleString()}
                        </div>
                        <Link 
                          to={`/product/${product.productId}`}
                          className="btn btn-outline-dark btn-sm"
                          style={{ borderRadius: '0' }}
                        >
                          <i className="fas fa-eye me-1"></i>
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {products.length > 8 && (
            <div className="text-center mt-5">
              <Link to="/allProducts" className="btn btn-dark btn-lg" style={{ borderRadius: '0' }}>
                <i className="fas fa-box me-2"></i>
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stores Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-light mb-3" style={{ fontSize: '2.5rem', color: '#333' }}>Active Stores</h2>
            <p className="text-muted lead fw-light">Manage and monitor your marketplace stores</p>
          </div>
          <div className="row g-4">
            {stores.map(store => (
              <div key={store.storeId} className="col-lg-4 col-md-6">
                <Link 
                  to={`/${store.storeName}`}
                  className="text-decoration-none"
                >
                  <div className="card store-card h-100 border-0 shadow-sm" style={{ borderRadius: '0' }}>
                    {store.backgroundImage && (
                      <div className="position-relative">
                        <img
                          src={`http://localhost:3031/storeAssets/${store.backgroundImage}`}
                          className="card-img-top"
                          alt={store.storeName}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="position-absolute top-0 start-0 m-3">
                          <span className="badge bg-white text-dark" style={{ borderRadius: '0' }}>
                            {store.location}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        {store.propic && (
                          <img
                            src={`http://localhost:3031/storeAssets/${store.propic}`}
                            alt={store.storeName}
                            className="rounded-circle me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="flex-grow-1">
                          <h5 className="fw-normal mb-1" style={{ color: '#333' }}>{store.storeName}</h5>
                          <p className="text-muted small mb-0">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {store.location}
                          </p>
                        </div>
                      </div>
                      {store.description && (
                        <p className="text-muted small">
                          {store.description.length > 100 ? 
                            store.description.substring(0, 100) + '...' : 
                            store.description
                          }
                        </p>
                      )}
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div className="text-muted small">
                          <i className="fas fa-phone me-1"></i>
                          {store.tp || 'No contact'}
                        </div>
                        <Link 
                          to={`/${store.storeName}`}
                          className="btn btn-outline-dark btn-sm"
                          style={{ borderRadius: '0' }}
                        >
                          <i className="fas fa-external-link-alt me-1"></i>
                          Visit Store
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {stores.length > 0 && (
            <div className="text-center mt-5">
              <Link to="/Admin/stores" className="btn btn-dark btn-lg" style={{ borderRadius: '0' }}>
                <i className="fas fa-store me-2"></i>
                Manage All Stores
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-light mb-4" style={{ color: '#333' }}>Ready to Manage Your Marketplace?</h2>
          <p className="text-muted lead fw-light mb-4">
            Take control of your gift store platform and help local businesses grow with powerful admin tools.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/Admin/stores" className="btn btn-dark btn-lg" style={{ borderRadius: '0' }}>
              <i className="fas fa-store me-2"></i>
              Manage Stores
            </Link>
            <Link to="/Admin/add-store" className="btn btn-outline-dark btn-lg" style={{ borderRadius: '0' }}>
              <i className="fas fa-plus me-2"></i>
              Add New Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 