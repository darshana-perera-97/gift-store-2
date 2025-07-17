import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export default function Footer() {
  const { user } = useContext(AuthContext);
  const isAdmin = user && user.username === 'admin';

  return (
    <footer className="footer mt-auto">
      {/* Main Footer Content */}
      <div className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4">
            {/* Brand Section */}
            <div className="col-lg-4 col-md-6">
              <div className="mb-4">
                <h4 className="fw-bold mb-3">
                  <i className="fas fa-gift me-2 text-primary"></i>
                  GiftStore
                </h4>
                <p className="text-light mb-4">
                  Your gateway to discovering amazing gifts from local stores. 
                  We connect customers with unique products and support local businesses 
                  in growing their online presence.
                </p>
                <div className="social-links">
                  <a href="#" className="btn btn-outline-light btn-sm me-2" title="Facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="btn btn-outline-light btn-sm me-2" title="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="btn btn-outline-light btn-sm me-2" title="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="btn btn-outline-light btn-sm me-2" title="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Customer Links */}
            <div className="col-lg-2 col-md-6">
              <h6 className="fw-bold mb-3 text-primary">For Customers</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="text-light text-decoration-none">
                    <i className="fas fa-home me-2"></i>Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/home" className="text-light text-decoration-none">
                    <i className="fas fa-gift me-2"></i>Browse Products
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/stores" className="text-light text-decoration-none">
                    <i className="fas fa-store me-2"></i>Browse Stores
                  </Link>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light text-decoration-none">
                    <i className="fas fa-star me-2"></i>Featured Gifts
                  </a>
                </li>
              </ul>
            </div>

            {/* Store Owner Links */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold mb-3 text-success">For Store Owners</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/admin" className="text-light text-decoration-none">
                    <i className="fas fa-user-shield me-2"></i>Admin Login
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/admin/add-store" className="text-light text-decoration-none">
                    <i className="fas fa-plus me-2"></i>Add Your Store
                  </Link>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light text-decoration-none">
                    <i className="fas fa-handshake me-2"></i>Partner Program
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-light text-decoration-none">
                    <i className="fas fa-chart-line me-2"></i>Analytics
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold mb-3 text-info">Contact & Support</h6>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-envelope me-2 mt-1 text-info"></i>
                    <div>
                      <small className="text-muted d-block">Email Support</small>
                      <a href="mailto:support@giftstore.com" className="text-light text-decoration-none">
                        support@giftstore.com
                      </a>
                    </div>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-phone me-2 mt-1 text-info"></i>
                    <div>
                      <small className="text-muted d-block">Phone Support</small>
                      <a href="tel:+15551234567" className="text-light text-decoration-none">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>
                </li>
                <li className="mb-3">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-map-marker-alt me-2 mt-1 text-info"></i>
                    <div>
                      <small className="text-muted d-block">Headquarters</small>
                      <span className="text-light">Gift Store HQ, City</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex align-items-start">
                    <i className="fas fa-clock me-2 mt-1 text-info"></i>
                    <div>
                      <small className="text-muted d-block">Support Hours</small>
                      <span className="text-light">Mon-Fri: 9AM-6PM</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-primary py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-3 mb-lg-0">
              <h6 className="text-white mb-2">
                <i className="fas fa-envelope me-2"></i>
                Stay Updated
              </h6>
              <p className="text-white-50 mb-0">
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
                />
                <button className="btn btn-light" type="button">
                  <i className="fas fa-paper-plane me-2"></i>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-darker py-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-2 mb-md-0">
              <p className="mb-0 text-muted">
                © 2024 GiftStore. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex flex-wrap justify-content-md-end gap-3">
                <a href="#" className="text-muted text-decoration-none small">
                  Privacy Policy
                </a>
                <a href="#" className="text-muted text-decoration-none small">
                  Terms of Service
                </a>
                <a href="#" className="text-muted text-decoration-none small">
                  Cookie Policy
                </a>
                <a href="#" className="text-muted text-decoration-none small">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Access (only for admin users) */}
      {isAdmin && (
        <div className="bg-warning py-2">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <small className="text-dark">
                  <i className="fas fa-user-shield me-2"></i>
                  Admin Mode: Quick access to management tools
                </small>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="d-flex gap-2 justify-content-md-end">
                  <Link to="/admin/stores" className="btn btn-sm btn-outline-dark">
                    <i className="fas fa-store me-1"></i>
                    Manage Stores
                  </Link>
                  <Link to="/admin/add-store" className="btn btn-sm btn-outline-dark">
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