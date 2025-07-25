import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export default function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user && user.username === 'admin';

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm border-bottom">
      <div className="container">
        {/* Brand/Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ fontSize: '1.5rem', fontWeight: '400' }}>
          <div className="d-flex align-items-center justify-content-center me-2" 
               style={{ 
                 width: '40px', 
                 height: '40px', 
                 backgroundColor: '#333',
                 borderRadius: '0'
               }}>
            <i className="fas fa-gift text-white" style={{ fontSize: '1.2rem' }}></i>
          </div>
          <span style={{ color: '#333' }}>GiftStore</span>
        </Link>
        
        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          style={{ padding: '0.5rem' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navigation Menu */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          {/* Main Navigation Links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link d-flex align-items-center ${isActive('/') ? 'active' : ''}`} 
                to="/"
                onClick={() => setIsMenuOpen(false)}
                style={{ 
                  padding: '0.75rem 1rem',
                  fontWeight: '300',
                  fontSize: '0.95rem'
                }}
              >
                <i className="fas fa-home me-2" style={{ fontSize: '0.9rem' }}></i>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link d-flex align-items-center ${isActive('/allStores') ? 'active' : ''}`} 
                to="/allStores"
                onClick={() => setIsMenuOpen(false)}
                style={{ 
                  padding: '0.75rem 1rem',
                  fontWeight: '300',
                  fontSize: '0.95rem'
                }}
              >
                <i className="fas fa-store me-2" style={{ fontSize: '0.9rem' }}></i>
                All Stores
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link d-flex align-items-center ${isActive('/allProducts') ? 'active' : ''}`} 
                to="/allProducts"
                onClick={() => setIsMenuOpen(false)}
                style={{ 
                  padding: '0.75rem 1rem',
                  fontWeight: '300',
                  fontSize: '0.95rem'
                }}
              >
                <i className="fas fa-gift me-2" style={{ fontSize: '0.9rem' }}></i>
                All Products
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link 
                  className={`nav-link d-flex align-items-center ${isActive('/admin') ? 'active' : ''}`} 
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ 
                    padding: '0.75rem 1rem',
                    fontWeight: '300',
                    fontSize: '0.95rem'
                  }}
                >
                  <i className="fas fa-cog me-2" style={{ fontSize: '0.9rem' }}></i>
                  Admin
                </Link>
              </li>
            )}
          </ul>
          
          {/* Right Side Navigation */}
          <ul className="navbar-nav">
            {/* User Menu */}
            {user ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle d-flex align-items-center" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ 
                    padding: '0.75rem 1rem',
                    fontWeight: '300',
                    fontSize: '0.95rem'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center me-2" 
                       style={{ 
                         width: '32px', 
                         height: '32px', 
                         backgroundColor: '#f8f9fa',
                         borderRadius: '0'
                       }}>
                    <i className="fas fa-user text-muted" style={{ fontSize: '0.8rem' }}></i>
                  </div>
                  <span style={{ color: '#333' }}>{user.username}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm" style={{ borderRadius: '0', minWidth: '200px' }}>
                  {isAdmin && (
                    <>
                      <li>
                        <Link className="dropdown-item d-flex align-items-center" to="/admin" onClick={() => setIsMenuOpen(false)}>
                          <i className="fas fa-tachometer-alt me-2" style={{ fontSize: '0.8rem' }}></i>
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item d-flex align-items-center" to="/admin/stores" onClick={() => setIsMenuOpen(false)}>
                          <i className="fas fa-store me-2" style={{ fontSize: '0.8rem' }}></i>
                          Manage Stores
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item d-flex align-items-center" to="/admin/add-store" onClick={() => setIsMenuOpen(false)}>
                          <i className="fas fa-plus me-2" style={{ fontSize: '0.8rem' }}></i>
                          Add Store
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider my-2" /></li>
                    </>
                  )}
                  <li>
                    <Link className="dropdown-item d-flex align-items-center" to="/favorites" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-heart me-2" style={{ fontSize: '0.8rem' }}></i>
                      Favorites
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center" to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-user-cog me-2" style={{ fontSize: '0.8rem' }}></i>
                      Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-2" /></li>
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center text-danger" 
                      onClick={handleLogout}
                      style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                    >
                      <i className="fas fa-sign-out-alt me-2" style={{ fontSize: '0.8rem' }}></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link 
                  className="nav-link d-flex align-items-center" 
                  to="/storeRequest"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ 
                    padding: '0.75rem 1rem',
                    fontWeight: '300',
                    fontSize: '0.95rem'
                  }}
                >
                  <i className="fas fa-plus me-2" style={{ fontSize: '0.9rem' }}></i>
                  Add Store
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
} 