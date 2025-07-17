import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export default function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Check if user is admin
  const isAdmin = user && user.username === 'admin';

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-gift me-2"></i>
          GiftStore
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                to="/"
              >
                <i className="fas fa-home me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/home') ? 'active' : ''}`} 
                to="/home"
              >
                <i className="fas fa-gift me-1"></i>
                Browse Products
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/stores') ? 'active' : ''}`} 
                to="/stores"
              >
                <i className="fas fa-store me-1"></i>
                Browse Stores
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/admin/stores') ? 'active' : ''}`} 
                  to="/admin/stores"
                >
                  <i className="fas fa-cog me-1"></i>
                  Manage Stores
                </Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle d-flex align-items-center" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user-circle me-1"></i>
                  <span>{user.username}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  {isAdmin && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/admin/stores">
                          <i className="fas fa-store me-2"></i>
                          Manage Stores
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/add-store">
                          <i className="fas fa-plus me-2"></i>
                          Add Store
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                    </>
                  )}
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={logout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  <i className="fas fa-user-shield me-1"></i>
                  Admin Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
} 