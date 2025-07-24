import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="homepage">
      {/* 01. Carousel Section */}
      <section className="carousel-section">
        <Carousel 
          showThumbs={false} 
          autoPlay 
          infiniteLoop 
          interval={5000}
          showStatus={false}
          showArrows={true}
          showIndicators={true}
        >
          <div className="carousel-slide">
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" 
              alt="Gift Collection"
            />
            <div className="carousel-content">
              <h2>Discover Perfect Gifts</h2>
              <p>Explore unique products from local stores</p>
              <Link to="/stores" className="btn btn-light btn-lg">Shop Now</Link>
            </div>
          </div>
          <div className="carousel-slide">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" 
              alt="Local Stores"
            />
            <div className="carousel-content">
              <h2>Support Local Businesses</h2>
              <p>Find amazing products from stores in your area</p>
              <Link to="/stores" className="btn btn-light btn-lg">Browse Stores</Link>
            </div>
          </div>
          <div className="carousel-slide">
            <img 
              src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" 
              alt="Special Occasions"
            />
            <div className="carousel-content">
              <h2>Perfect for Every Occasion</h2>
              <p>Birthdays, anniversaries, and special moments</p>
              <Link to="/stores" className="btn btn-light btn-lg">Find Gifts</Link>
            </div>
          </div>
        </Carousel>
      </section>

      {/* 02. Store List Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center mb-5">Our Featured Stores</h2>
          <div className="row g-4">
            {stores.map(store => (
              <div key={store.storeId} className="col-lg-4 col-md-6">
                <Link 
                  to={`/${store.storeName}`}
                  className="text-decoration-none"
                >
                  <div className="card store-card h-100">
                    {store.backgroundImage && (
                      <img
                        src={`http://localhost:3031/storeAssets/${store.backgroundImage}`}
                        className="card-img-top"
                        alt={store.storeName}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        {store.propic && (
                          <img
                            src={`http://localhost:3031/storeAssets/${store.propic}`}
                            alt={store.storeName}
                            className="rounded-circle me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <h5 className="card-title mb-1">{store.storeName}</h5>
                          <div className="text-warning">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <span className="text-muted ms-2">(4.5)</span>
                          </div>
                        </div>
                      </div>
                      <p className="card-text text-muted">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {store.location}
                      </p>
                      {store.description && (
                        <p className="card-text">{store.description}</p>
                      )}
                      <button className="btn btn-primary w-100">
                        <i className="fas fa-store me-2"></i>
                        View Store
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {stores.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-store fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No stores available</h4>
              <p className="text-muted">Check back soon for new stores!</p>
            </div>
          )}
        </div>
      </section>

      {/* 03. Featured Products Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center mb-5">Featured Products</h2>
          <div className="row g-4">
            {products.slice(0, 8).map(product => (
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
                        {product.description || 'Amazing product from our featured collection'}
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
          {products.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-gift fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No products available</h4>
              <p className="text-muted">Check back soon for new products!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, var(--primary-purple) 0%, var(--secondary-purple) 100%)' }}>
        <div className="container text-center text-white">
          <h2 className="mb-4">Ready to Start Shopping?</h2>
          <p className="lead mb-4">
            Join thousands of customers who have discovered amazing gifts through GiftStore.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/stores" className="btn btn-light btn-lg">
              <i className="fas fa-shopping-cart me-2"></i>
              Start Shopping
            </Link>
            {isAdmin && (
              <Link to="/Admin" className="btn btn-outline-light btn-lg">
                <i className="fas fa-cog me-2"></i>
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
