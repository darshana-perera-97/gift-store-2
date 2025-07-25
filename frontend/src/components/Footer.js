import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export default function Footer() {
  const { user } = useContext(AuthContext);
  const isAdmin = user && user.username === 'admin';

  return (
    <footer className="footer mt-auto bg-white border-top">
      {/* Main Footer Content */}
      <div className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* Brand Section */}
            <div className="col-lg-4 col-md-6">
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="d-flex align-items-center justify-content-center me-2" 
                       style={{ 
                         width: '40px', 
                         height: '40px', 
                         backgroundColor: '#333',
                         borderRadius: '0'
                       }}>
                    <i className="fas fa-gift text-white" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                  <h5 className="fw-light mb-0" style={{ color: '#333' }}>GiftStore</h5>
                </div>
                <p className="text-muted mb-4" style={{ lineHeight: '1.6', fontSize: '0.9rem' }}>
                  Your gateway to discovering amazing gifts from local stores. 
                  We connect customers with unique products and support local businesses 
                  in growing their online presence.
                </p>
                <div className="social-links">
                  <a href="#" className="d-inline-flex align-items-center justify-content-center me-3" 
                     style={{ 
                       width: '36px', 
                       height: '36px', 
                       border: '1px solid #e9ecef',
                       color: '#666',
                       textDecoration: 'none',
                       transition: 'all 0.2s ease'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.backgroundColor = '#f8f9fa';
                       e.target.style.color = '#333';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.backgroundColor = 'transparent';
                       e.target.style.color = '#666';
                     }}
                     title="Facebook">
                    <i className="fab fa-facebook-f" style={{ fontSize: '0.9rem' }}></i>
                  </a>
                  <a href="#" className="d-inline-flex align-items-center justify-content-center me-3" 
                     style={{ 
                       width: '36px', 
                       height: '36px', 
                       border: '1px solid #e9ecef',
                       color: '#666',
                       textDecoration: 'none',
                       transition: 'all 0.2s ease'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.backgroundColor = '#f8f9fa';
                       e.target.style.color = '#333';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.backgroundColor = 'transparent';
                       e.target.style.color = '#666';
                     }}
                     title="Twitter">
                    <i className="fab fa-twitter" style={{ fontSize: '0.9rem' }}></i>
                  </a>
                  <a href="#" className="d-inline-flex align-items-center justify-content-center me-3" 
                     style={{ 
                       width: '36px', 
                       height: '36px', 
                       border: '1px solid #e9ecef',
                       color: '#666',
                       textDecoration: 'none',
                       transition: 'all 0.2s ease'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.backgroundColor = '#f8f9fa';
                       e.target.style.color = '#333';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.backgroundColor = 'transparent';
                       e.target.style.color = '#666';
                     }}
                     title="Instagram">
                    <i className="fab fa-instagram" style={{ fontSize: '0.9rem' }}></i>
                  </a>
                  <a href="#" className="d-inline-flex align-items-center justify-content-center" 
                     style={{ 
                       width: '36px', 
                       height: '36px', 
                       border: '1px solid #e9ecef',
                       color: '#666',
                       textDecoration: 'none',
                       transition: 'all 0.2s ease'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.backgroundColor = '#f8f9fa';
                       e.target.style.color = '#333';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.backgroundColor = 'transparent';
                       e.target.style.color = '#666';
                     }}
                     title="LinkedIn">
                    <i className="fab fa-linkedin-in" style={{ fontSize: '0.9rem' }}></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Customer Links */}
            <div className="col-lg-2 col-md-6">
              <h6 className="fw-normal mb-3" style={{ color: '#333', fontSize: '0.9rem' }}>For Customers</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="text-decoration-none text-muted" 
                        style={{ fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) => e.target.style.color = '#333'}
                        onMouseLeave={(e) => e.target.style.color = '#666'}>
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/stores" className="text-decoration-none text-muted" 
                        style={{ fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) => e.target.style.color = '#333'}
                        onMouseLeave={(e) => e.target.style.color = '#666'}>
                    Browse Stores
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/products" className="text-decoration-none text-muted" 
                        style={{ fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) => e.target.style.color = '#333'}
                        onMouseLeave={(e) => e.target.style.color = '#666'}>
                    Browse Products
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/favorites" className="text-decoration-none text-muted" 
                        style={{ fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) => e.target.style.color = '#333'}
                        onMouseLeave={(e) => e.target.style.color = '#666'}>
                    Favorites
                  </Link>
                </li>
              </ul>
            </div>

            {/* Store Owner Links */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-normal mb-3" style={{ color: '#333', fontSize: '0.9rem' }}>For Store Owners</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/admin" className="text-decoration-none text-muted" 
                        style={{ fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) => e.target.style.color = '#333'}
                        onMouseLeave={(e) => e.target.style.color = '#666'}>
                    Admin Login
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/admin/add-store" className="text-decoration-none text-muted" 
                        style={{ fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                        onMouseEnter={(e) => e.target.style.color = '#333'}
                        onMouseLeave={(e) => e.target.style.color = '#666'}>
                    Add Your Store
                  </Link>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted" 
                     style={{ fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                     onMouseEnter={(e) => e.target.style.color = '#333'}
                     onMouseLeave={(e) => e.target.style.color = '#666'}>
                    Partner Program
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted" 
                     style={{ fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                     onMouseEnter={(e) => e.target.style.color = '#333'}
                     onMouseLeave={(e) => e.target.style.color = '#666'}>
                    Analytics
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-normal mb-3" style={{ color: '#333', fontSize: '0.9rem' }}>Contact & Support</h6>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-envelope me-2 mt-1 text-muted" style={{ fontSize: '0.8rem' }}></i>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Email Support</small>
                      <a href="mailto:support@giftstore.com" className="text-decoration-none text-muted" 
                         style={{ fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                         onMouseEnter={(e) => e.target.style.color = '#333'}
                         onMouseLeave={(e) => e.target.style.color = '#666'}>
                        support@giftstore.com
                      </a>
                    </div>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-phone me-2 mt-1 text-muted" style={{ fontSize: '0.8rem' }}></i>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Phone Support</small>
                      <a href="tel:+15551234567" className="text-decoration-none text-muted" 
                         style={{ fontSize: '0.85rem', transition: 'color 0.2s ease' }}
                         onMouseEnter={(e) => e.target.style.color = '#333'}
                         onMouseLeave={(e) => e.target.style.color = '#666'}>
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-map-marker-alt me-2 mt-1 text-muted" style={{ fontSize: '0.8rem' }}></i>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Headquarters</small>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>Gift Store HQ, City</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-start">
                    <i className="fas fa-clock me-2 mt-1 text-muted" style={{ fontSize: '0.8rem' }}></i>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Support Hours</small>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>Mon-Fri: 9AM-6PM</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-top py-4" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-3 mb-lg-0">
              <h6 className="fw-normal mb-2" style={{ color: '#333', fontSize: '0.95rem' }}>
                Stay Updated
              </h6>
              <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                Get the latest updates on new stores and featured products
              </p>
            </div>
            <div className="col-lg-6">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  aria-label="Email for newsletter"
                  style={{ borderRadius: '0', border: '1px solid #e9ecef', fontSize: '0.9rem' }}
                />
                <button className="btn btn-dark" type="button" style={{ borderRadius: '0', fontSize: '0.9rem' }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-top py-3" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-2 mb-md-0">
              <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
                © 2024 GiftStore. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex flex-wrap justify-content-md-end gap-3">
                <a href="#" className="text-decoration-none text-muted" 
                   style={{ fontSize: '0.8rem', transition: 'color 0.2s ease' }}
                   onMouseEnter={(e) => e.target.style.color = '#333'}
                   onMouseLeave={(e) => e.target.style.color = '#666'}>
                  Privacy Policy
                </a>
                <a href="#" className="text-decoration-none text-muted" 
                   style={{ fontSize: '0.8rem', transition: 'color 0.2s ease' }}
                   onMouseEnter={(e) => e.target.style.color = '#333'}
                   onMouseLeave={(e) => e.target.style.color = '#666'}>
                  Terms of Service
                </a>
                <a href="#" className="text-decoration-none text-muted" 
                   style={{ fontSize: '0.8rem', transition: 'color 0.2s ease' }}
                   onMouseEnter={(e) => e.target.style.color = '#333'}
                   onMouseLeave={(e) => e.target.style.color = '#666'}>
                  Cookie Policy
                </a>
                <a href="#" className="text-decoration-none text-muted" 
                   style={{ fontSize: '0.8rem', transition: 'color 0.2s ease' }}
                   onMouseEnter={(e) => e.target.style.color = '#333'}
                   onMouseLeave={(e) => e.target.style.color = '#666'}>
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Access (only for admin users) */}
      {isAdmin && (
        <div className="border-top py-3" style={{ backgroundColor: '#fff3cd', borderColor: '#ffeaa7' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                  <i className="fas fa-user-shield me-2"></i>
                  Admin Mode: Quick access to management tools
                </small>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="d-flex gap-2 justify-content-md-end">
                  <Link to="/admin/stores" className="btn btn-sm btn-outline-dark" style={{ borderRadius: '0', fontSize: '0.8rem' }}>
                    <i className="fas fa-store me-1"></i>
                    Manage Stores
                  </Link>
                  <Link to="/admin/add-store" className="btn btn-sm btn-outline-dark" style={{ borderRadius: '0', fontSize: '0.8rem' }}>
                    <i className="fas fa-plus me-1"></i>
                    Add Store
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
} 