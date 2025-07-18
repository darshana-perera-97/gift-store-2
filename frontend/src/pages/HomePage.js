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
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Discover Perfect Gifts
              </h1>
              <p className="lead mb-4">
                Explore unique products from local stores. Find the perfect gift for every occasion, 
                from birthdays to anniversaries, all in one place.
              </p>
              <div className="d-flex gap-3">
                <Link to={isAdmin ? "/admin/stores" : "/stores"} className="btn btn-light btn-lg">
                  <i className="fas fa-store me-2"></i>
                  {isAdmin ? 'Manage Stores' : 'Browse Stores'}
                </Link>
                {isAdmin && (
                  <Link to="/admin/add-store" className="btn btn-outline-light btn-lg">
                    <i className="fas fa-plus me-2"></i>
                    Add Your Store
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <i className="fas fa-gift" style={{ fontSize: '8rem', opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title">Why Choose GiftStore?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-store fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">Local Stores</h5>
                  <p className="card-text">
                    Support local businesses and discover unique products from stores in your area.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-gift fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">Unique Gifts</h5>
                  <p className="card-text">
                    Find one-of-a-kind gifts that you won't see in big box stores.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-shipping-fast fa-3x text-primary"></i>
                  </div>
                  <h5 className="card-title">Easy Shopping</h5>
                  <p className="card-text">
                    Browse multiple stores in one place and find exactly what you're looking for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="row g-4">
            {products.slice(0, 8).map(product => (
              <div key={product.productId} className="col-lg-3 col-md-4 col-sm-6">
                <Link 
                  to={`/store/${product.storeId}/product/${product.productId}`}
                  className="text-decoration-none"
                >
                  <div className="card product-card h-100">
                    {product.images[0] && (
                      <img
                        src={`http://localhost:3031/productImages/${product.images[0]}`}
                        className="card-img-top"
                        alt={product.productName}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text text-muted flex-grow-1">
                        {product.description || 'Amazing product from our featured collection'}
                      </p>
                      <div className="price">Rs. {product.price}</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {products.length > 8 && (
            <div className="text-center mt-4">
              <Link to={isAdmin ? "/admin/stores" : "/stores"} className="btn btn-outline-primary btn-lg">
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stores Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title">Our Featured Stores</h2>
          <div className="row g-4">
            {stores.map(store => (
              <div key={store.storeId} className="col-lg-4 col-md-6">
                <Link 
                  to={`/store/${store.storeId}`}
                  className="text-decoration-none"
                >
                  <div className="card store-card h-100">
                    {store.propic && (
                      <img
                        src={`http://localhost:3031/storeAssets/${store.propic}`}
                        className="card-img-top"
                        alt={store.storeName}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{store.storeName}</h5>
                      <p className="card-text text-muted">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {store.location}
                      </p>
                      {store.description && (
                        <p className="card-text">{store.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {stores.length > 0 && (
            <div className="text-center mt-4">
              <Link to={isAdmin ? "/admin/stores" : "/stores"} className="btn btn-primary btn-lg">
                <i className="fas fa-store me-2"></i>
                {isAdmin ? 'Manage All Stores' : 'Browse All Stores'}
              </Link>
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
            <Link to={isAdmin ? "/admin/stores" : "/stores"} className="btn btn-light btn-lg">
              <i className="fas fa-shopping-cart me-2"></i>
              {isAdmin ? 'Manage Stores' : 'Start Shopping'}
            </Link>
            {isAdmin && (
              <Link to="/admin/add-store" className="btn btn-outline-light btn-lg">
                <i className="fas fa-store me-2"></i>
                Add Your Store
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
