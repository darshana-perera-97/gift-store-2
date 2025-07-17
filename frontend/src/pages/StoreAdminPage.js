import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function StoreAdminPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store] = useState(JSON.parse(localStorage.getItem('store')));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if for some reason storeId mismatch, force back to login
    if (!store || store.storeId !== storeId) {
      localStorage.removeItem('store');
      return navigate(`/store/${storeId}/admin/login`);
    }
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3031/products/${storeId}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [storeId, navigate, store]);

  const handleLogout = () => {
    localStorage.removeItem('store');
    navigate(`/store/${storeId}/admin/login`);
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
    <div className="container mt-4">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="section-title mb-0">
            <i className="fas fa-store me-2 text-success"></i>
            {store.storeName} - Admin Dashboard
          </h1>
          <p className="text-muted mt-2">
            Manage your store products and settings
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="d-flex gap-2 justify-content-md-end">
            <button 
              onClick={handleLogout}
              className="btn btn-outline-danger"
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </button>
            <Link to={`/store/${storeId}/admin/add-product`} className="btn btn-success">
              <i className="fas fa-plus me-2"></i>
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Store Info Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-2">
                  {store.propic && (
                    <img
                      src={`http://localhost:3031/storeAssets/${store.propic}`}
                      alt={store.storeName}
                      className="img-fluid rounded"
                      style={{ maxHeight: '100px', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="col-md-8">
                  <h5 className="card-title mb-1">{store.storeName}</h5>
                  <p className="card-text text-muted mb-1">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {store.location}
                  </p>
                  {store.description && (
                    <p className="card-text mb-0">{store.description}</p>
                  )}
                </div>
                <div className="col-md-2 text-md-end">
                  <span className="badge bg-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">
              <i className="fas fa-box me-2"></i>
              Your Products ({products.length})
            </h2>
            <Link to={`/store/${storeId}/admin/add-product`} className="btn btn-primary btn-sm">
              <i className="fas fa-plus me-1"></i>
              Add New Product
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-box fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">No products yet</h4>
          <p className="text-muted mb-4">
            Start by adding your first product to showcase in your store.
          </p>
          <Link to={`/store/${storeId}/admin/add-product`} className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {products.map(product => (
            <div key={product.productId} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card h-100 product-card">
                {product.images[0] && (
                  <img
                    src={`http://localhost:3031/productImages/${product.images[0]}`}
                    className="card-img-top"
                    alt={product.productName}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.productName}</h5>
                  <p className="card-text text-muted flex-grow-1">
                    {product.description || 'No description available'}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h6 text-primary mb-0">Rs. {product.price}</span>
                    <Link 
                      to={`/store/${storeId}/product/${product.productId}`}
                      className="btn btn-outline-primary btn-sm"
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

      {/* Quick Actions */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="fas fa-tools me-2"></i>
                Quick Actions
              </h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <Link to={`/store/${storeId}/admin/add-product`} className="btn btn-success w-100">
                    <i className="fas fa-plus me-2"></i>
                    Add New Product
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to={`/store/${storeId}`} className="btn btn-outline-primary w-100">
                    <i className="fas fa-store me-2"></i>
                    View Public Store
                  </Link>
                </div>
                <div className="col-md-4">
                  <button onClick={handleLogout} className="btn btn-outline-danger w-100">
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
