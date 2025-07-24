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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border loading-spinner" role="status">
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
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          {store && (
            <li className="breadcrumb-item">
              <Link to={`/${store.storeName}`}>{store.storeName}</Link>
            </li>
          )}
          <li className="breadcrumb-item active" aria-current="page">
            {product.productName}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Images */}
        <div className="col-lg-6 mb-4">
          <div className="card">
            <div className="card-body p-0">
              {product.images && product.images.length > 0 ? (
                <div className="row g-2 p-3">
                  {product.images.map((img, i) => (
                    <div key={i} className="col-6">
                      <img
                        src={`http://localhost:3031/productImages/${img}`}
                        alt={`${product.productName} ${i + 1}`}
                        className="img-fluid rounded"
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-image fa-3x text-muted"></i>
                  <p className="text-muted mt-2">No images available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title mb-3">{product.productName}</h1>
              
              <div className="mb-3">
                <span className="h3 text-primary">Rs. {product.price}</span>
              </div>

              {product.description && (
                <div className="mb-4">
                  <h5>Description</h5>
                  <p className="text-muted">{product.description}</p>
                </div>
              )}

              {product.includes && product.includes.length > 0 && (
                <div className="mb-4">
                  <h5>What's Included</h5>
                  <ul className="list-unstyled">
                    {product.includes.map((inc, i) => (
                      <li key={i} className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Order Form */}
              <div className="card bg-light">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Place Order
                  </h5>
                </div>
                <div className="card-body">
                  {message && (
                    <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
                      <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleOrder}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="quantity" className="form-label">
                          <i className="fas fa-hashtag me-2"></i>
                          Quantity
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="quantity"
                          min="1"
                          value={qty}
                          onChange={e => setQty(parseInt(e.target.value))}
                          required
                          disabled={orderLoading}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          <i className="fas fa-calculator me-2"></i>
                          Total
                        </label>
                        <div className="form-control-plaintext">
                          Rs. {product.price * qty}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="customerName" className="form-label">
                          <i className="fas fa-user me-2"></i>
                          Your Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="customerName"
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          required
                          disabled={orderLoading}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="customerEmail" className="form-label">
                          <i className="fas fa-envelope me-2"></i>
                          Your Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="customerEmail"
                          value={customerEmail}
                          onChange={e => setCustomerEmail(e.target.value)}
                          required
                          disabled={orderLoading}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="customerPhone" className="form-label">
                          <i className="fas fa-phone me-2"></i>
                          Your Phone
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="customerPhone"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          required
                          disabled={orderLoading}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="customerAddress" className="form-label">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          Your Address
                        </label>
                        <textarea
                          className="form-control"
                          id="customerAddress"
                          rows="2"
                          value={customerAddress}
                          onChange={e => setCustomerAddress(e.target.value)}
                          required
                          disabled={orderLoading}
                        ></textarea>
                      </div>
                    </div>

                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        disabled={orderLoading}
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
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      {store && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-store me-2"></i>
                  Store Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h6>{store.storeName}</h6>
                    <p className="text-muted mb-0">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {store.location}
                    </p>
                    {store.description && (
                      <p className="text-muted mb-0 mt-2">{store.description}</p>
                    )}
                  </div>
                  <div className="col-md-4 text-md-end">
                    <Link 
                      to={`/${store.storeName}`} 
                      className="btn btn-outline-primary"
                    >
                      <i className="fas fa-store me-2"></i>
                      View Store
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
