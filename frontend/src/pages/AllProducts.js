import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildApiUrl, getProductImageUrl } from '../apiConfig';

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(buildApiUrl('/viewProducts'));
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.storeName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesPrice = true;
      if (priceFilter === 'under-1000') {
        matchesPrice = product.price < 1000;
      } else if (priceFilter === '1000-5000') {
        matchesPrice = product.price >= 1000 && product.price <= 5000;
      } else if (priceFilter === '5000-10000') {
        matchesPrice = product.price > 5000 && product.price <= 10000;
      } else if (priceFilter === 'over-10000') {
        matchesPrice = product.price > 10000;
      }
      
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.productName.localeCompare(b.productName);
        case 'newest':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-light py-5 border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="fw-light mb-3" style={{ color: '#333' }}>
                Explore All Products
              </h1>
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                Discover amazing products from our curated collection of stores.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="d-flex align-items-center justify-content-lg-end">
                <span className="text-muted me-3">{filteredAndSortedProducts.length} products found</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mt-4">
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '0' }}
              />
            </div>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              style={{ borderRadius: '0' }}
            >
              <option value="all">All Prices</option>
              <option value="under-1000">Under Rs. 1,000</option>
              <option value="1000-5000">Rs. 1,000 - 5,000</option>
              <option value="5000-10000">Rs. 5,000 - 10,000</option>
              <option value="over-10000">Over Rs. 10,000</option>
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ borderRadius: '0' }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
          <div className="col-md-4">
            <button
              className="btn btn-outline-dark w-100"
              onClick={() => {
                setSearchTerm('');
                setPriceFilter('all');
                setSortBy('newest');
              }}
              style={{ borderRadius: '0' }}
            >
              <i className="fas fa-times me-2"></i>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-box fa-3x text-muted mb-3"></i>
            <h4 className="text-muted mb-3">No products found</h4>
            <p className="text-muted mb-4">
              {searchTerm || priceFilter !== 'all' 
                ? 'Try adjusting your search criteria.' 
                : 'No products are available at the moment.'
              }
            </p>
            {(searchTerm || priceFilter !== 'all') && (
              <button
                className="btn btn-outline-dark"
                onClick={() => {
                  setSearchTerm('');
                  setPriceFilter('all');
                  setSortBy('newest');
                }}
                style={{ borderRadius: '0' }}
              >
                <i className="fas fa-times me-2"></i>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {filteredAndSortedProducts.map(product => (
              <div key={product.productId} className="col-lg-3 col-md-4 col-sm-6">
                <div className="card h-100 border-0 shadow-sm product-card" style={{ borderRadius: '0' }}>
                  {product.images && product.images[0] && (
                    <div className="position-relative">
                      <img
                        src={getProductImageUrl(product.images[0])}
                        className="card-img-top"
                        alt={product.productName}
                        style={{ height: '250px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="badge bg-primary" style={{ borderRadius: '0' }}>
                          New Arrival
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <div className="mb-2">
                      <h6 className="card-title mb-1" style={{ color: '#333' }}>
                        {product.productName}
                      </h6>
                      <p className="text-muted small mb-2">
                        <i className="fas fa-store me-1"></i>
                        {product.storeName || 'Unknown Store'}
                      </p>
                    </div>
                    
                    <p className="card-text text-muted flex-grow-1 small">
                      {product.description ? 
                        (product.description.length > 80 ? 
                          product.description.substring(0, 80) + '...' : 
                          product.description
                        ) : 
                        'No description available'
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 