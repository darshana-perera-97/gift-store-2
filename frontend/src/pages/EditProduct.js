import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { buildApiUrl, getProductImageUrl } from '../apiConfig';

export default function EditProduct() {
  const { storeName, productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [store, setStore] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    status: 'live',
    includes: ['']
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch store info
        const storeRes = await fetch(buildApiUrl('/viewStores'));
        const stores = await storeRes.json();
        const foundStore = stores.find(s => s.storeName === storeName);
        if (foundStore) {
          setStore(foundStore);
        }

        // Fetch product info
        const productRes = await fetch(buildApiUrl(`/products/${foundStore.storeId}`));
        const products = await productRes.json();
        const foundProduct = products.find(p => p.productId === productId);
        if (foundProduct) {
          setProduct(foundProduct);
          setFormData({
            productName: foundProduct.productName || '',
            description: foundProduct.description || '',
            price: foundProduct.price || '',
            status: foundProduct.status || 'live',
            includes: foundProduct.includes || ['']
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeName, productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIncludeChange = (idx, val) => {
    const arr = [...formData.includes];
    arr[idx] = val;
    setFormData(prev => ({
      ...prev,
      includes: arr
    }));
  };

  const addInclude = () => {
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, '']
    }));
  };

  const removeInclude = (idx) => {
    if (formData.includes.length > 1) {
      const arr = formData.includes.filter((_, i) => i !== idx);
      setFormData(prev => ({
        ...prev,
        includes: arr
      }));
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
    setSaving(true);
    setError('');

    try {
      const form = new FormData();
      form.append('productId', productId);
      form.append('productName', formData.productName);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('status', formData.status);
      formData.includes.filter(inc => inc.trim()).forEach(i => form.append('includes', i));
      images.slice(0, 5).forEach(img => form.append('images', img));

      const res = await fetch(buildApiUrl('/updateProduct'), {
        method: 'POST',
        body: form,
      });
      
      const body = await res.json();
      if (!body.success) throw new Error(body.error || 'Failed to update product');
      
      navigate(`/${storeName}/manage`);
    } catch (err) {
      console.error(err);
      setError('Could not update product. Please try again.');
    } finally {
      setSaving(false);
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
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Product not found
        </div>
        <Link to={`/${storeName}/manage`} className="btn btn-primary">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Store Management
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="section-title mb-0">
            <i className="fas fa-edit me-2 text-primary"></i>
            Edit Product
          </h1>
          <p className="text-muted mt-2">
            {store ? `Editing product in ${store.storeName}` : 'Update product details'}
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to={`/${storeName}/manage`} className="btn btn-outline-secondary">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Management
          </Link>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
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
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                    disabled={saving}
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
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    disabled={saving}
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
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    disabled={saving}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Status */}
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    <i className="fas fa-toggle-on me-2"></i>
                    Status *
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={saving}
                  >
                    <option value="live">Live</option>
                    <option value="out of stock">Out of Stock</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Includes */}
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-list me-2"></i>
                    What's Included
                  </label>
                  {formData.includes.map((inc, i) => (
                    <div key={i} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={inc}
                        onChange={e => handleIncludeChange(i, e.target.value)}
                        disabled={saving}
                        placeholder={`Include item ${i + 1}`}
                      />
                      {formData.includes.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeInclude(i)}
                          disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
                  />
                  <div className="form-text">
                    <i className="fas fa-info-circle me-1"></i>
                    Select new images to replace existing ones. Leave empty to keep current images.
                  </div>
                  {images.length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Selected {images.length} new image(s)
                      </small>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating Product...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Update Product
                      </>
                    )}
                  </button>
                  <Link
                    to={`/${storeName}/manage`}
                    className="btn btn-outline-secondary"
                    disabled={saving}
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Current Product Preview */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-eye me-2"></i>
                Current Product
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  {product.images[0] && (
                    <img
                      src={getProductImageUrl(product.images[0])}
                      alt={product.productName}
                      className="img-fluid rounded"
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="col-md-8">
                  <h5>{product.productName}</h5>
                  <p className="text-muted">{product.description}</p>
                  <h6 className="text-primary">Rs. {product.price}</h6>
                  <span className={`badge ${formData.status === 'live' ? 'bg-success' : formData.status === 'out of stock' ? 'bg-danger' : 'bg-secondary'}`}>
                    {product.status || 'live'}
                  </span>
                  {product.includes && product.includes.length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted">Includes:</small>
                      <ul className="list-unstyled">
                        {product.includes.map((inc, i) => (
                          <li key={i}><i className="fas fa-check text-success me-1"></i>{inc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 