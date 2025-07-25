// src/pages/ProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product
        const productResponse = await fetch(`http://localhost:3031/product/${productId}`);
        const productData = await productResponse.json();
        setProduct(productData);

        // Fetch store info
        const storesResponse = await fetch('http://localhost:3031/viewStores');
        const storesData = await storesResponse.json();
        const currentStore = storesData.find(s => s.storeId === productData.storeId);
        setStore(currentStore);

        // Check if product is in favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(productId));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleOrder = async e => {
    e.preventDefault();
    setOrderLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:3031/orderProduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: qty,
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          storeEmail: store?.email || '',
          productName: product?.productName || '',
          storeName: store?.storeName || '',
          totalAmount: product?.price * qty
        }),
      });
      const body = await res.json();
      
      if (body.success) {
        setMessage('Order placed successfully! The store will contact you soon.');
        setQty(1);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setCustomerAddress('');
      } else {
        throw new Error(body.error || 'Order failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Could not place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(id => id !== productId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      // Add to favorites
      favorites.push(productId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-muted" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Product not found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container py-4">
      {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb bg-transparent p-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            {store && (
              <li className="breadcrumb-item">
                <Link to={`/${store.storeName}`} className="text-decoration-none text-muted">
                  {store.storeName}
                </Link>
            </li>
          )}
          <li className="breadcrumb-item active" aria-current="page">
              <span className="text-dark">{product.productName}</span>
          </li>
        </ol>
      </nav>

      <div className="row">
          {/* Product Image Gallery */}
        <div className="col-lg-6 mb-4">
            <div className="position-relative">
              {/* Main Image */}
              <div className="mb-3">
              {product.images && product.images.length > 0 ? (
                  <img
                    src={`http://localhost:3031/productImages/${product.images[selectedImage]}`}
                    alt={product.productName}
                    className="img-fluid w-100"
                    style={{ 
                      height: '500px', 
                      objectFit: 'cover',
                      border: '1px solid #e9ecef'
                    }}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light" 
                       style={{ height: '500px' }}>
                    <div className="text-center">
                      <i className="fas fa-image fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No images available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="row g-2">
                  {product.images.map((img, i) => (
                    <div key={i} className="col-3">
                      <img
                        src={`http://localhost:3031/productImages/${img}`}
                        alt={`${product.productName} ${i + 1}`}
                        className={`img-fluid cursor-pointer ${selectedImage === i ? 'border border-dark' : 'border'}`}
                        style={{ 
                          height: '80px', 
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedImage(i)}
                      />
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

          {/* Product Information */}
        <div className="col-lg-6">
            <div className="ps-lg-4">
              {/* Product Title */}
              <h1 className="fw-light mb-3" style={{ fontSize: '1.8rem', color: '#333' }}>
                {product.productName}
              </h1>
              
              {/* Pricing */}
              <div className="mb-4">
                <span className="h3 fw-bold" style={{ color: '#333' }}>
                  Rs. {product.price}
                </span>
              </div>

              {/* Product Description */}
              {product.description && (
                <div className="mb-4">
                  <h6 className="fw-normal mb-2" style={{ color: '#333' }}>Description</h6>
                  <p className="text-muted" style={{ lineHeight: '1.6' }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* What's Included */}
              {product.includes && product.includes.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-normal mb-2" style={{ color: '#333' }}>What's Included</h6>
                  <ul className="list-unstyled">
                    {product.includes.map((inc, i) => (
                      <li key={i} className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        <span className="text-muted">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-4">
                <h6 className="fw-normal mb-2" style={{ color: '#333' }}>Quantity</h6>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center border" style={{ width: 'fit-content' }}>
                    <button
                      className="btn btn-outline-dark"
                      style={{ borderRadius: '0', border: 'none' }}
                      onClick={() => setQty(Math.max(1, qty - 1))}
                    >
                      <i className="fas fa-minus" style={{ fontSize: '12px' }}></i>
                    </button>
                    <span className="px-3" style={{ minWidth: '50px', textAlign: 'center' }}>
                      {qty}
                    </span>
                    <button
                      className="btn btn-outline-dark"
                      style={{ borderRadius: '0', border: 'none' }}
                      onClick={() => setQty(qty + 1)}
                    >
                      <i className="fas fa-plus" style={{ fontSize: '12px' }}></i>
                    </button>
                  </div>
                  <small className="text-muted">Total: Rs. {product.price * qty}</small>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 mb-4">
                <button 
                  className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-dark'}`}
                  style={{ borderRadius: '0' }}
                  onClick={handleFavorite}
                >
                  <i className={`fas fa-heart ${isFavorite ? 'text-white' : ''}`}></i>
                  <span className="ms-2">{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                </button>
              </div>

              {/* Order Form */}
              <div className="border-top pt-4">
                <h6 className="fw-normal mb-3" style={{ color: '#333' }}>Place Order</h6>
                
                  {message && (
                  <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} mb-3`} role="alert">
                      <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleOrder}>
                  <div className="row g-3">
                    <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                        placeholder="Your Name"
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          required
                          disabled={orderLoading}
                        style={{ borderRadius: '0' }}
                        />
                      </div>
                    <div className="col-md-6">
                        <input
                          type="email"
                          className="form-control"
                        placeholder="Your Email"
                          value={customerEmail}
                          onChange={e => setCustomerEmail(e.target.value)}
                          required
                          disabled={orderLoading}
                        style={{ borderRadius: '0' }}
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                          type="tel"
                          className="form-control"
                        placeholder="Your Phone"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          required
                          disabled={orderLoading}
                        style={{ borderRadius: '0' }}
                        />
                      </div>
                    <div className="col-md-6">
                        <textarea
                          className="form-control"
                        placeholder="Your Address"
                        rows="1"
                          value={customerAddress}
                          onChange={e => setCustomerAddress(e.target.value)}
                          required
                          disabled={orderLoading}
                        style={{ borderRadius: '0' }}
                        ></textarea>
                    </div>
                    <div className="col-12">
                      <button 
                        type="submit" 
                        className="btn btn-dark w-100"
                        disabled={orderLoading}
                        style={{ borderRadius: '0' }}
                      >
                        {orderLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing Order...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-shopping-cart me-2"></i>
                            Order Now - Rs. {product.price * qty}
                          </>
                        )}
                      </button>
                    </div>
                    </div>
                  </form>
            </div>
          </div>
        </div>
      </div>

        {/* Store Information */}
      {store && (
          <div className="row mt-5">
          <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '0' }}>
                <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                      <div className="d-flex align-items-center mb-2">
                        <h6 className="fw-normal mb-0 me-3" style={{ color: '#333' }}>
                          {store.storeName}
                        </h6>
                        <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>
                          {store.status === 'active' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <div className="row text-muted" style={{ fontSize: '0.9rem' }}>
                        <div className="col-md-6">
                          <span>Location: {store.location}</span>
                        </div>
                        {store.email && (
                          <div className="col-md-6">
                            <span>Email: {store.email}</span>
                          </div>
                        )}
                      </div>
                    {store.description && (
                        <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.9rem' }}>
                          {store.description}
                        </p>
                    )}
                  </div>
                  <div className="col-md-4 text-md-end">
                    <Link 
                      to={`/${store.storeName}`} 
                        className="btn btn-dark"
                        style={{ borderRadius: '0' }}
                      >
                        Visit Store
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Details */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '0' }}>
              <div className="card-header bg-white border-bottom p-0">
                <ul className="nav nav-tabs border-0" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active border-0" style={{ borderRadius: '0' }}>
                      Product Details
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-8">
                    <h6 className="fw-normal mb-3" style={{ color: '#333' }}>Product Information</h6>
                    
                    <div className="row g-4">
                      <div className="col-md-6">
                        <h6 className="fw-normal mb-2" style={{ color: '#333' }}>Product Name</h6>
                        <p className="text-muted small">{product.productName}</p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="fw-normal mb-2" style={{ color: '#333' }}>Price</h6>
                        <p className="text-muted small">Rs. {product.price}</p>
                      </div>
                      {product.description && (
                        <div className="col-md-12">
                          <h6 className="fw-normal mb-2" style={{ color: '#333' }}>Description</h6>
                          <p className="text-muted small">{product.description}</p>
                        </div>
                      )}
                      {product.includes && product.includes.length > 0 && (
                        <div className="col-md-12">
                          <h6 className="fw-normal mb-2" style={{ color: '#333' }}>What's Included</h6>
                          <ul className="list-unstyled text-muted small">
                            {product.includes.map((inc, i) => (
                              <li key={i}>• {inc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {store && (
                        <div className="col-md-6">
                          <h6 className="fw-normal mb-2" style={{ color: '#333' }}>Store</h6>
                          <p className="text-muted small">{store.storeName}</p>
                        </div>
                      )}
                      {store && store.location && (
                        <div className="col-md-6">
                          <h6 className="fw-normal mb-2" style={{ color: '#333' }}>Location</h6>
                          <p className="text-muted small">{store.location}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-end">
                      <Link to="#" className="text-decoration-none text-muted small">
                        Report Product
                    </Link>
                    </div>
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
