// src/pages/AddProduct.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function AddProduct() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [productName, setName] = useState('');
  const [description, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [includes, setIncludes] = useState(['']);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [storeInfo, setStoreInfo] = useState(null);

  useEffect(() => {
    // Fetch store information to display store name
    const fetchStoreInfo = async () => {
      try {
        const res = await fetch('http://localhost:3031/viewStores');
        const stores = await res.json();
        const store = stores.find(s => s.storeId === storeId);
        if (store) {
          setStoreInfo(store);
        }
      } catch (error) {
        console.error('Error fetching store info:', error);
      }
    };

    fetchStoreInfo();
  }, [storeId]);

  const handleIncludeChange = (idx, val) => {
    const arr = [...includes];
    arr[idx] = val;
    setIncludes(arr);
  };

  const addInclude = () => setIncludes([...includes, '']);

  const removeInclude = (idx) => {
    if (includes.length > 1) {
      const arr = includes.filter((_, i) => i !== idx);
      setIncludes(arr);
    }
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setImages(files);
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData();
    form.append('storeId', storeId);
    form.append('productName', productName);
    form.append('description', description);
    form.append('price', price);
    includes.filter(inc => inc.trim()).forEach(i => form.append('includes', i));
    images.slice(0, 5).forEach(img => form.append('images', img));

    try {
      const res = await fetch('http://localhost:3031/addProduct', {
        method: 'POST',
        body: form,
      });
      const body = await res.json();
      if (!body.success) throw new Error(body.error || 'Failed to add product');
      navigate(`/store/${storeId}/admin`);
    } catch (err) {
      console.error(err);
      setError('Could not add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="section-title mb-0">
            <i className="fas fa-plus me-2 text-success"></i>
            Add New Product
          </h1>
          <p className="text-muted mt-2">
            {storeInfo ? `Adding product to ${storeInfo.storeName}` : 'Add a new product to your store'}
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to={`/store/${storeId}/admin`} className="btn btn-outline-secondary">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">
                <i className="fas fa-box me-2"></i>
                Product Information
              </h4>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">
                    <i className="fas fa-tag me-2"></i>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    value={productName}
                    onChange={e => setName(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter product name"
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    <i className="fas fa-align-left me-2"></i>
                    Description *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows="4"
                    value={description}
                    onChange={e => setDesc(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Describe your product..."
                  />
                </div>

                {/* Price */}
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    <i className="fas fa-rupee-sign me-2"></i>
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Includes */}
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-list me-2"></i>
                    What's Included
                  </label>
                  {includes.map((inc, i) => (
                    <div key={i} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={inc}
                        onChange={e => handleIncludeChange(i, e.target.value)}
                        disabled={loading}
                        placeholder={`Include item ${i + 1}`}
                      />
                      {includes.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeInclude(i)}
                          disabled={loading}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={addInclude}
                    disabled={loading}
                  >
                    <i className="fas fa-plus me-1"></i>
                    Add Include Item
                  </button>
                </div>

                {/* Images */}
                <div className="mb-4">
                  <label htmlFor="images" className="form-label">
                    <i className="fas fa-images me-2"></i>
                    Product Images (Max 5)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                  <div className="form-text">
                    <i className="fas fa-info-circle me-1"></i>
                    Select up to 5 images. Supported formats: JPG, PNG, GIF
                  </div>
                  {images.length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Selected {images.length} image(s)
                      </small>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-success flex-grow-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Add Product
                      </>
                    )}
                  </button>
                  <Link
                    to={`/store/${storeId}/admin`}
                    className="btn btn-outline-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          {(productName || description || price) && (
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="fas fa-eye me-2"></i>
                  Preview
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    {images.length > 0 && (
                      <img
                        src={URL.createObjectURL(images[0])}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <div className="col-md-8">
                    <h5>{productName || 'Product Name'}</h5>
                    <p className="text-muted">{description || 'Product description will appear here...'}</p>
                    {price && (
                      <h6 className="text-primary">Rs. {price}</h6>
                    )}
                    {includes.filter(inc => inc.trim()).length > 0 && (
                      <div>
                        <small className="text-muted">Includes:</small>
                        <ul className="list-unstyled">
                          {includes.filter(inc => inc.trim()).map((inc, i) => (
                            <li key={i}><i className="fas fa-check text-success me-1"></i>{inc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
