import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';

export default function LandingPage() {
  const { user } = useContext(AuthContext);
  const isAdmin = user && user.username === 'admin';

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4">
                Welcome to GiftStore
              </h1>
              <p className="lead mb-4">
                Your gateway to discovering amazing gifts from local stores. 
                Whether you're shopping for a special occasion or just browsing, 
                we've got you covered.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/stores" className="btn btn-light btn-lg">
                  <i className="fas fa-store me-2"></i>
                  Browse Stores
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="btn btn-outline-light btn-lg">
                    <i className="fas fa-user-shield me-2"></i>
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <i className="fas fa-gift" style={{ fontSize: '12rem', opacity: 0.2 }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title">Get Started</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-search fa-3x text-primary"></i>
                  </div>
                  <h4 className="card-title mb-3">Discover Stores</h4>
                  <p className="card-text text-muted mb-4">
                    Explore our curated collection of local stores offering unique gifts and products.
                  </p>
                  <Link to="/stores" className="btn btn-primary">
                    <i className="fas fa-arrow-right me-2"></i>
                    Start Exploring
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-store fa-3x text-success"></i>
                  </div>
                  <h4 className="card-title mb-3">For Store Owners</h4>
                  <p className="card-text text-muted mb-4">
                    Want to showcase your store? Join our platform and reach more customers.
                  </p>
                  <Link to="/admin" className="btn btn-success">
                    <i className="fas fa-plus me-2"></i>
                    Add Your Store
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-info-circle fa-3x text-info"></i>
                  </div>
                  <h4 className="card-title mb-3">About GiftStore</h4>
                  <p className="card-text text-muted mb-4">
                    Learn more about our mission to connect local businesses with customers.
                  </p>
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={() => document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' })}
                  >
                    <i className="fas fa-info me-2"></i>
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="section-title text-start">About GiftStore</h2>
              <p className="lead mb-4">
                We believe in the power of local businesses and the unique products they offer. 
                Our platform connects customers with amazing local stores, making gift shopping 
                easier and more meaningful.
              </p>
              <div className="row g-3">
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    <span>Local Business Support</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    <span>Unique Products</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    <span>Easy Shopping</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    <span>Secure Platform</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Local Store" 
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, var(--primary-purple) 0%, var(--secondary-purple) 100%)' }}>
        <div className="container text-center text-white">
          <h2 className="mb-4">Ready to Start Shopping?</h2>
          <p className="lead mb-4">
            Join thousands of customers who have discovered amazing gifts through GiftStore.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/stores" className="btn btn-light btn-lg">
              <i className="fas fa-shopping-cart me-2"></i>
              Browse Stores
            </Link>
            {isAdmin && (
              <Link to="/admin" className="btn btn-outline-light btn-lg">
                <i className="fas fa-user-shield me-2"></i>
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
} 