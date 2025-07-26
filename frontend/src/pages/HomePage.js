import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { buildApiUrl, buildAssetUrl } from '../config';

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
        const storesResponse = await fetch(buildApiUrl('/viewStores'));
        const storesData = await storesResponse.json();
        setStores(storesData.filter(s => s.status === 'active'));

        // Fetch all products
        const productsResponse = await fetch(buildApiUrl('/viewProducts'));
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
        <div className="spinner-border text-muted" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage bg-white">
      {/* 01. Minimalistic Hero Carousel */}
      <section className="hero-carousel-section" style={{ backgroundColor: '#f8f9fa' }}>
        <Carousel 
          showThumbs={false} 
          autoPlay 
          infiniteLoop 
          interval={6000}
          showStatus={false}
          showArrows={true}
          showIndicators={true}
          stopOnHover={true}
          swipeable={true}
          emulateTouch={true}
          className="minimal-carousel"
        >
          <div className="carousel-slide-minimal">
            <div className="container">
              <div className="row align-items-center min-vh-75">
                <div className="col-lg-6">
                  <div className="hero-content text-start">
                    <h1 className="fw-light mb-4" style={{ 
                      fontSize: '3rem', 
                      color: '#333',
                      lineHeight: '1.2'
                    }}>
                      Discover Perfect Gifts
                    </h1>
                    <p className="text-muted mb-4" style={{ 
                      fontSize: '1.1rem', 
                      lineHeight: '1.6',
                      fontWeight: '300'
                    }}>
                      Explore unique products from local stores and find the perfect gift for every occasion. From handmade crafts to premium items, discover treasures that tell a story.
                    </p>
                    <Link to="/allStores" className="btn btn-dark btn-lg" style={{ 
                      borderRadius: '0',
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      fontWeight: '300'
                    }}>
                      Shop Now
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-image-container">
                    <img 
                      src="https://img.freepik.com/free-vector/gift-boxes-collection_23-2148534847.jpg?w=800&t=st=1703123456~exp=1703124056~hmac=1234567890abcdef" 
                      alt="Gift Collection"
                      className="img-fluid"
                      style={{ 
                        borderRadius: '0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://img.freepik.com/free-vector/gift-boxes-collection_23-2148534847.jpg?w=800&t=st=1703123456~exp=1703124056~hmac=1234567890abcdef';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="carousel-slide-minimal">
            <div className="container">
              <div className="row align-items-center min-vh-75">
                <div className="col-lg-6">
                  <div className="hero-content text-start">
                    <h1 className="fw-light mb-4" style={{ 
                      fontSize: '3rem', 
                      color: '#333',
                      lineHeight: '1.2'
                    }}>
                      Support Local Businesses
                    </h1>
                    <p className="text-muted mb-4" style={{ 
                      fontSize: '1.1rem', 
                      lineHeight: '1.6',
                      fontWeight: '300'
                    }}>
                      Find amazing products from stores in your area and help local businesses grow. Every purchase supports your community and brings unique offerings to your doorstep.
                    </p>
                    <Link to="/allStores" className="btn btn-dark btn-lg" style={{ 
                      borderRadius: '0',
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      fontWeight: '300'
                    }}>
                      Browse Stores
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-image-container">
                    <img 
                      src="https://img.freepik.com/free-vector/online-shopping-concept-illustration_114360-1081.jpg?w=800&t=st=1703123456~exp=1703124056~hmac=1234567890abcdef" 
                      alt="Local Stores"
                      className="img-fluid"
                      style={{ 
                        borderRadius: '0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://img.freepik.com/free-vector/online-shopping-concept-illustration_114360-1081.jpg?w=800&t=st=1703123456~exp=1703124056~hmac=1234567890abcdef';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="carousel-slide-minimal">
            <div className="container">
              <div className="row align-items-center min-vh-75">
                <div className="col-lg-6">
                  <div className="hero-content text-start">
                    <h1 className="fw-light mb-4" style={{ 
                      fontSize: '3rem', 
                      color: '#333',
                      lineHeight: '1.2'
                    }}>
                      Perfect for Every Occasion
                    </h1>
                    <p className="text-muted mb-4" style={{ 
                      fontSize: '1.1rem', 
                      lineHeight: '1.6',
                      fontWeight: '300'
                    }}>
                      Birthdays, anniversaries, and special moments - find the perfect gift for every celebration. Our curated collection ensures you'll always find something meaningful.
                    </p>
                    <Link to="/allStores" className="btn btn-dark btn-lg" style={{ 
                      borderRadius: '0',
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      fontWeight: '300'
                    }}>
                      Find Gifts
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-image-container">
                    <img 
                      src="https://img.freepik.com/free-vector/gift-shop-concept-illustration_114360-1082.jpg?w=800&t=st=1703123456~exp=1703124056~hmac=1234567890abcdef" 
                      alt="Special Occasions"
                      className="img-fluid"
                      style={{ 
                        borderRadius: '0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://img.freepik.com/free-vector/gift-shop-concept-illustration_114360-1082.jpg?w=800&t=st=1703123456~exp=1703124056~hmac=1234567890abcdef';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="carousel-slide-minimal">
            <div className="container">
              <div className="row align-items-center min-vh-75">
                <div className="col-lg-6">
                  <div className="hero-content text-start">
                    <h1 className="fw-light mb-4" style={{ 
                      fontSize: '3rem', 
                      color: '#333',
                      lineHeight: '1.2'
                    }}>
                      Handcrafted Excellence
                    </h1>
                    <p className="text-muted mb-4" style={{ 
                      fontSize: '1.1rem', 
                      lineHeight: '1.6',
                      fontWeight: '300'
                    }}>
                      Discover artisanal products crafted with care and attention to detail. Each item tells a story of creativity and passion, making your gifts truly special.
                    </p>
                    <Link to="/stores" className="btn btn-dark btn-lg" style={{ 
                      borderRadius: '0',
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      fontWeight: '300'
                    }}>
                      Explore Crafts
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-image-container">
                    <img 
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                      alt="Handcrafted Products"
                      className="img-fluid"
                      style={{ 
                        borderRadius: '0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x600/f8f9fa/666666?text=Handcrafted+Products';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="carousel-slide-minimal">
            <div className="container">
              <div className="row align-items-center min-vh-75">
                <div className="col-lg-6">
                  <div className="hero-content text-start">
                    <h1 className="fw-light mb-4" style={{ 
                      fontSize: '3rem', 
                      color: '#333',
                      lineHeight: '1.2'
                    }}>
                      Sustainable Shopping
                    </h1>
                    <p className="text-muted mb-4" style={{ 
                      fontSize: '1.1rem', 
                      lineHeight: '1.6',
                      fontWeight: '300'
                    }}>
                      Choose eco-friendly and sustainable products that make a positive impact. Support businesses that care about our planet while finding beautiful gifts.
                    </p>
                    <Link to="/stores" className="btn btn-dark btn-lg" style={{ 
                      borderRadius: '0',
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      fontWeight: '300'
                    }}>
                      Shop Sustainable
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-image-container">
                    <img 
                      src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                      alt="Sustainable Products"
                      className="img-fluid"
                      style={{ 
                        borderRadius: '0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x600/f8f9fa/666666?text=Sustainable+Products';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel>
      </section>

      {/* 02. Store List Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-light" style={{ fontSize: '2.5rem', color: '#333' }}>Our Featured Stores</h2>
          <div className="row g-4">
            {stores.slice(0, 3).map(store => (
              <div key={store.storeId} className="col-lg-4 col-md-6">
                <Link 
                  to={`/${store.storeName}`}
                  className="text-decoration-none"
                >
                  <div className="card store-card h-100 border-0 shadow-sm" style={{ borderRadius: '0' }}>
                    {store.backgroundImage && (
                      <img
                        src={buildAssetUrl('/storeAssets', store.backgroundImage)}
                        className="card-img-top"
                        alt={store.storeName}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        {store.propic && (
                          <img
                            src={buildAssetUrl('/storeAssets', store.propic)}
                            alt={store.storeName}
                            className="rounded-circle me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <h5 className="card-title mb-1 fw-normal" style={{ color: '#333' }}>{store.storeName}</h5>
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
                      <p className="card-text text-muted mb-3">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {store.location}
                      </p>
                      {store.description && (
                        <p className="card-text text-muted mb-3">{store.description}</p>
                      )}
                      <button className="btn btn-outline-dark w-100" style={{ borderRadius: '0' }}>
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
              <h4 className="text-muted fw-light">No stores available</h4>
              <p className="text-muted">Check back soon for new stores!</p>
            </div>
          )}
          {stores.length > 3 && (
            <div className="text-center mt-5">
              <Link to="/allStores" className="btn btn-outline-dark btn-lg" style={{ borderRadius: '0' }}>
                <i className="fas fa-arrow-right me-2"></i>
                View All Stores
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 03. Featured Products Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-light mb-3" style={{ fontSize: '2.5rem', color: '#333' }}>Featured Products</h2>
            <p className="text-muted lead fw-light">Discover amazing gifts from our curated collection</p>
          </div>
          <div className="row g-4">
            {products.slice(0, 8).map(product => (
              <div key={product.productId} className="col-lg-3 col-md-4 col-sm-6">
                <Link 
                  to={`/product/${product.productId}`}
                  className="text-decoration-none"
                >
                  <div className="card product-card h-100 border-0" 
                       style={{ 
                         borderRadius: '0',
                         transition: 'all 0.3s ease',
                         overflow: 'hidden',
                         boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                         border: '1px solid rgba(0,0,0,0.05)'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'translateY(-4px)';
                         e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'translateY(0)';
                         e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
                       }}>
                    <div className="position-relative">
                    {product.images[0] && (
                      <img
                        src={buildAssetUrl('/productImages', product.images[0])}
                        className="card-img-top"
                        alt={product.productName}
                          style={{ 
                            height: '280px', 
                            objectFit: 'cover',
                            transition: 'transform 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        />
                      )}
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge bg-primary" style={{ 
                          fontSize: '10px', 
                          borderRadius: '0',
                          backgroundColor: '#007bff',
                          padding: '4px 8px'
                        }}>
                          New Arrival
                        </span>
                      </div>
                      <div className="position-absolute top-0 end-0 m-3">
                        <div className="bg-white d-flex align-items-center justify-content-center shadow-sm"
                             style={{ 
                               width: '32px', 
                               height: '32px',
                               borderRadius: '0'
                             }}>
                          <i className="fas fa-heart text-muted" style={{ fontSize: '12px' }}></i>
                        </div>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column p-4">
                      <div className="mb-2">
                        <small className="text-muted fw-light">Uniqlo</small>
                      </div>
                      <h6 className="card-title fw-normal mb-2" style={{ 
                        fontSize: '1rem', 
                        color: '#333',
                        lineHeight: '1.4'
                      }}>
                        {product.productName}
                      </h6>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div>
                          <span className="fw-bold" style={{ color: '#333' }}>Rs. {product.price}</span>
                        </div>
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
              <h4 className="text-muted fw-light mb-2">No products available</h4>
              <p className="text-muted">Check back soon for new products!</p>
            </div>
          )}
          {products.length > 8 && (
            <div className="text-center mt-5">
              <Link to="/allProducts" className="btn btn-outline-dark btn-lg" style={{ borderRadius: '0' }}>
                <i className="fas fa-arrow-right me-2"></i>
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-4 fw-light" style={{ color: '#333' }}>Ready to Start Shopping?</h2>
          <p className="lead mb-4 fw-light text-muted">
            Join thousands of customers who have discovered amazing gifts through GiftStore.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/stores" className="btn btn-dark btn-lg" style={{ borderRadius: '0' }}>
              <i className="fas fa-shopping-cart me-2"></i>
              Start Shopping
            </Link>
            {isAdmin && (
              <Link to="/Admin" className="btn btn-outline-dark btn-lg" style={{ borderRadius: '0' }}>
                <i className="fas fa-cog me-2"></i>
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Store Registration Banner */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h3 className="fw-light mb-3" style={{ color: '#333' }}>
                <i className="fas fa-store me-2 text-muted"></i>
                Own a Store? Join Our Platform
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Expand your business reach and connect with customers looking for unique products. 
                Join our growing community of local stores and start selling online today.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/storeRequest" className="btn btn-outline-dark btn-lg" style={{ borderRadius: '0' }}>
                <i className="fas fa-plus me-2"></i>
                Request Store Access
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
