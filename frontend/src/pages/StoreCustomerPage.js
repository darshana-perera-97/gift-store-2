import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function StoreCustomerPage() {
  const { storeName } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load store data by storeName
        const storesResponse = await fetch("http://localhost:3031/viewStores");
        const allStores = await storesResponse.json();
        const currentStore = allStores.find((s) => s.storeName === storeName);
        
        if (!currentStore) {
          navigate("/");
          return;
        }
        
        setStore(currentStore);

        // Load store products
        const productsResponse = await fetch(`http://localhost:3031/products/${currentStore.storeId}`);
        const storeProducts = await productsResponse.json();
        setProducts(storeProducts);
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeName, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border loading-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Store not found. Redirecting to home...
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Store Banner */}
      {store.backgroundImage && (
        <div className="position-relative">
          <img
            src={`http://localhost:3031/storeAssets/${store.backgroundImage}`}
            alt="Store Banner"
            className="w-100"
            style={{ height: '300px', objectFit: 'cover' }}
          />
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.3 }}></div>
        </div>
      )}

      <div className="container mt-4">
        {/* Store Header */}
        <div className="row align-items-center mb-4">
          <div className="col-md-8">
            <div className="d-flex align-items-center">
              {store.propic && (
                <img
                  src={`http://localhost:3031/storeAssets/${store.propic}`}
                  alt={store.storeName}
                  className="rounded-circle me-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              )}
              <div>
                <h1 className="mb-1">{store.storeName}</h1>
                <p className="text-muted mb-2">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {store.location}
                </p>
                {store.description && (
                  <p className="mb-0">{store.description}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <Link 
              to={`/${storeName}/admin/login`} 
              className="btn btn-outline-primary"
            >
              <i className="fas fa-cog me-2"></i>
              Store Admin
            </Link>
          </div>
        </div>

        {/* Products Section */}
        <div className="row">
          <div className="col-12">
            <h2 className="section-title mb-4">Products</h2>
            
            {products.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">No products available</h4>
                <p className="text-muted">This store hasn't added any products yet.</p>
              </div>
            ) : (
              <div className="row g-4">
                {products.map((product) => (
                  <div key={product.productId} className="col-lg-3 col-md-4 col-sm-6">
                    <Link
                      to={`/product/${product.productId}`}
                      className="text-decoration-none"
                    >
                      <div className="card product-card h-100">
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
                            {product.description || 'Amazing product from this store'}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="price">Rs. {product.price}</div>
                            <button className="btn btn-outline-primary btn-sm">
                              <i className="fas fa-eye me-1"></i>
                              View Product
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Store Info Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Store Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Store Name:</strong> {store.storeName}</p>
                    <p><strong>Location:</strong> {store.location}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Status:</strong> 
                      <span className={`badge ms-2 ${store.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {store.status}
                      </span>
                    </p>
                    {store.description && (
                      <p><strong>Description:</strong> {store.description}</p>
                    )}
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
