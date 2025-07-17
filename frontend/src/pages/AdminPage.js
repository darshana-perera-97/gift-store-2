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
        navigate('/admin/stores');
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
    <div className="admin-page">
      {/* Hero Section with Login */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                GiftStore Admin
              </h1>
              <p className="lead mb-4">
                Welcome to the GiftStore administration panel. Manage stores, products, and monitor your gift marketplace.
              </p>
              
              {!isAdmin ? (
                <div className="card shadow-lg border-0">
                  <div className="card-header bg-primary text-white text-center py-3">
                    <h4 className="mb-0">
                      <i className="fas fa-user-shield me-2"></i>
                      Admin Login
                    </h4>
                  </div>
                  <div className="card-body p-4">
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    )}
                    
                    <form onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          <i className="fas fa-user me-2"></i>
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          disabled={loginLoading}
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
                          disabled={loginLoading}
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={loginLoading}
                      >
                        {loginLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Logging in...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-sign-in-alt me-2"></i>
                            Login
                          </>
                        )}
                      </button>
                    </form>
                    
                    <div className="text-center mt-3">
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        Demo credentials: admin / admin
                      </small>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex gap-3">
                  <Link to="/admin/stores" className="btn btn-light btn-lg">
                    <i className="fas fa-store me-2"></i>
                    Manage Stores
                  </Link>
                  <Link to="/admin/add-store" className="btn btn-outline-light btn-lg">
                    <i className="fas fa-plus me-2"></i>
                    Add Store
                  </Link>
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <i className="fas fa-gift" style={{ fontSize: '8rem', opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title">Admin Features</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-store fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">Store Management</h5>
                  <p className="card-text">
                    Add, edit, and manage all stores in the marketplace. Monitor store status and performance.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-chart-line fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">Analytics</h5>
                  <p className="card-text">
                    View detailed analytics and insights about store performance and customer engagement.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-cog fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">System Control</h5>
                  <p className="card-text">
                    Control system settings, manage user permissions, and maintain platform security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="row g-4">
            {products.slice(0, 8).map(product => (
              <div key={product.productId} className="col-lg-3 col-md-4 col-sm-6">
                <Link 
                  to={`/store/${product.storeId}/product/${product.productId}`}
                  className="text-decoration-none"
                >
                  <div className="card product-card h-100">
                    {product.images[0] && (
                      <img
                        src={`http://localhost:3031/productImages/${product.images[0]}`}
                        className="card-img-top"
                        alt={product.productName}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text text-muted flex-grow-1">
                        {product.description || 'Amazing product from our featured collection'}
                      </p>
                      <div className="price">Rs. {product.price}</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {products.length > 8 && (
            <div className="text-center mt-4">
              <Link to="/admin/stores" className="btn btn-outline-primary btn-lg">
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stores Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title">Active Stores</h2>
          <div className="row g-4">
            {stores.map(store => (
              <div key={store.storeId} className="col-lg-4 col-md-6">
                <Link 
                  to={`/store/${store.storeId}`}
                  className="text-decoration-none"
                >
                  <div className="card store-card h-100">
                    {store.propic && (
                      <img
                        src={`http://localhost:3031/storeAssets/${store.propic}`}
                        className="card-img-top"
                        alt={store.storeName}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{store.storeName}</h5>
                      <p className="card-text text-muted">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {store.location}
                      </p>
                      {store.description && (
                        <p className="card-text">{store.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {stores.length > 0 && (
            <div className="text-center mt-4">
              <Link to="/admin/stores" className="btn btn-primary btn-lg">
                <i className="fas fa-store me-2"></i>
                Manage All Stores
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, var(--primary-purple) 0%, var(--secondary-purple) 100%)' }}>
        <div className="container text-center text-white">
          <h2 className="mb-4">Ready to Manage Your Marketplace?</h2>
          <p className="lead mb-4">
            Take control of your gift store platform and help local businesses grow.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/admin/stores" className="btn btn-light btn-lg">
              <i className="fas fa-store me-2"></i>
              Manage Stores
            </Link>
            <Link to="/admin/add-store" className="btn btn-outline-light btn-lg">
              <i className="fas fa-plus me-2"></i>
              Add New Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 