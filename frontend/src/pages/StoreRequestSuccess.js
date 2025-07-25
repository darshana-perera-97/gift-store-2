import React from 'react';
import { Link } from 'react-router-dom';

export default function StoreRequestSuccess() {
  return (
    <div className="bg-white">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <div className="mb-4">
                <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <h1 className="fw-light mb-3" style={{ color: '#333' }}>Thank You!</h1>
              <p className="text-muted" style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                Your store request has been successfully submitted.
              </p>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: '0' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="fas fa-users text-primary mb-3" style={{ fontSize: '3rem' }}></i>
                  <h3 className="fw-light mb-3" style={{ color: '#333' }}>Our Sales Team Will Contact You Soon</h3>
                  <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    We've received your store request and our dedicated sales team will review your application within 24-48 hours. 
                    You can expect a call or email from us soon to discuss the next steps.
                  </p>
                </div>

                <div className="row g-4 mb-5">
                  <div className="col-md-4">
                    <div className="text-center">
                      <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-clock text-primary" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h6 className="fw-normal mb-2" style={{ color: '#333' }}>Quick Response</h6>
                      <p className="text-muted small">We'll get back to you within 24-48 hours</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-phone text-primary" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h6 className="fw-normal mb-2" style={{ color: '#333' }}>Personal Contact</h6>
                      <p className="text-muted small">Our team will call or email you directly</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center">
                      <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-rocket text-primary" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <h6 className="fw-normal mb-2" style={{ color: '#333' }}>Quick Setup</h6>
                      <p className="text-muted small">Get your store up and running fast</p>
                    </div>
                  </div>
                </div>

                <div className="bg-light p-4 mb-4" style={{ borderRadius: '0' }}>
                  <h6 className="fw-normal mb-3" style={{ color: '#333' }}>
                    <i className="fas fa-info-circle me-2 text-primary"></i>
                    What Happens Next?
                  </h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Our sales team will review your application
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      We'll contact you to discuss your business needs
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      We'll guide you through the store setup process
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      You'll receive your store credentials and access
                    </li>
                    <li>
                      <i className="fas fa-check text-success me-2"></i>
                      Start selling your products on our platform!
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <p className="text-muted mb-4">
                    Have questions? Feel free to contact us at{' '}
                    <a href="mailto:ds.perera.1997@gmail.com" className="text-decoration-none">
                      ds.perera.1997@gmail.com
                    </a>
                  </p>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Link to="/" className="btn btn-outline-dark me-md-2" style={{ borderRadius: '0' }}>
                      <i className="fas fa-home me-2"></i>
                      Back to Home
                    </Link>
                    <Link to="/stores" className="btn btn-dark" style={{ borderRadius: '0' }}>
                      <i className="fas fa-store me-2"></i>
                      Browse Stores
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 