import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../apiConfig';

const districts = [
  'Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya',
  'Galle','Matara','Hambantota','Jaffna','Kilinochchi','Mannar',
  'Vavuniya','Mullaitivu','Batticaloa','Ampara','Trincomalee',
  'Kurunegala','Puttalam','Anuradhapura','Polonnaruwa','Badulla',
  'Monaragala','Ratnapura','Kegalle'
];

export default function StoreRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    location: '',
    businessType: '',
    description: '',
    website: '',
    socialMedia: '',
    yearsInBusiness: '',
    products: '',
    targetAudience: '',
    reasonToJoin: '',
    // Store creation fields
    tp: '',
    propic: null,
    backgroundImage: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Prepare FormData for file uploads
      const data = new FormData();
      for (let key in formData) {
        if (formData[key] != null) {
          data.append(key, formData[key]);
        }
      }

      // Send store request to backend API
      const response = await fetch(buildApiUrl('/storeRequest'), {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        // Navigate to success page
        navigate('/storeRequest/success');
      } else {
        setMessage(result.error || 'There was an error submitting your request. Please try again.');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('There was an error submitting your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb bg-transparent p-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <span className="text-dark">Store Request</span>
            </li>
          </ol>
        </nav>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <h1 className="fw-light mb-3" style={{ color: '#333' }}>Request Store Access</h1>
              <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Join our platform and start selling your products to customers looking for unique gifts and items.
              </p>
            </div>

            {message && (
              <div className={`alert ${message.includes('Thank you') ? 'alert-success' : 'alert-danger'} mb-4`} role="alert">
                <i className={`fas ${message.includes('Thank you') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                {message}
              </div>
            )}

            <div className="card border-0 shadow-sm" style={{ borderRadius: '0' }}>
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Store Information */}
                    <div className="col-12">
                      <h5 className="fw-normal mb-3" style={{ color: '#333' }}>
                        <i className="fas fa-store me-2 text-muted"></i>
                        Store Information
                      </h5>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="storeName" className="form-label fw-normal" style={{ color: '#333' }}>
                        Store Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="storeName"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '0' }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="ownerName" className="form-label fw-normal" style={{ color: '#333' }}>
                        Owner Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '0' }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label fw-normal" style={{ color: '#333' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '0' }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label fw-normal" style={{ color: '#333' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '0' }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="tp" className="form-label fw-normal" style={{ color: '#333' }}>
                        Telephone *
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="tp"
                        name="tp"
                        value={formData.tp}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '0' }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="location" className="form-label fw-normal" style={{ color: '#333' }}>
                        Location *
                      </label>
                      <select
                        className="form-select"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '0' }}
                      >
                        <option value="">-- Select District --</option>
                        {districts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>



                    <div className="col-md-6">
                      <label htmlFor="businessType" className="form-label fw-normal" style={{ color: '#333' }}>
                        Business Type *
                      </label>
                      <select
                        className="form-select"
                        id="businessType"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                        style={{ borderRadius: '0' }}
                      >
                        <option value="">Select Business Type</option>
                        <option value="Retail Store">Retail Store</option>
                        <option value="Online Store">Online Store</option>
                        <option value="Handmade/Crafts">Handmade/Crafts</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Fashion & Accessories">Fashion & Accessories</option>
                        <option value="Home & Garden">Home & Garden</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Books & Media">Books & Media</option>
                        <option value="Health & Beauty">Health & Beauty</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>



                    <div className="col-12">
                      <label htmlFor="description" className="form-label fw-normal" style={{ color: '#333' }}>
                        Business Description *
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your business, products, and what makes you unique..."
                        style={{ borderRadius: '0' }}
                      ></textarea>
                    </div>

                    {/* Store Images */}
                    <div className="col-12">
                      <h5 className="fw-normal mb-3 mt-4" style={{ color: '#333' }}>
                        <i className="fas fa-images me-2 text-muted"></i>
                        Store Images
                      </h5>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="propic" className="form-label fw-normal" style={{ color: '#333' }}>
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="propic"
                        name="propic"
                        accept="image/*"
                        onChange={handleFile}
                        style={{ borderRadius: '0' }}
                      />
                      <div className="form-text text-muted">Recommended size: 400x400 pixels</div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="backgroundImage" className="form-label fw-normal" style={{ color: '#333' }}>
                        Background Image
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="backgroundImage"
                        name="backgroundImage"
                        accept="image/*"
                        onChange={handleFile}
                        style={{ borderRadius: '0' }}
                      />
                      <div className="form-text text-muted">Recommended size: 1200x400 pixels</div>
                    </div>

                    {/* Additional Information */}
                    <div className="col-12">
                      <h5 className="fw-normal mb-3 mt-4" style={{ color: '#333' }}>
                        <i className="fas fa-info-circle me-2 text-muted"></i>
                        Additional Information
                      </h5>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="website" className="form-label fw-normal" style={{ color: '#333' }}>
                        Website (if any)
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com"
                        style={{ borderRadius: '0' }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="socialMedia" className="form-label fw-normal" style={{ color: '#333' }}>
                        Social Media Handles
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="socialMedia"
                        name="socialMedia"
                        value={formData.socialMedia}
                        onChange={handleChange}
                        placeholder="Instagram, Facebook, etc."
                        style={{ borderRadius: '0' }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="yearsInBusiness" className="form-label fw-normal" style={{ color: '#333' }}>
                        Years in Business
                      </label>
                      <select
                        className="form-select"
                        id="yearsInBusiness"
                        name="yearsInBusiness"
                        value={formData.yearsInBusiness}
                        onChange={handleChange}
                        style={{ borderRadius: '0' }}
                      >
                        <option value="">Select Years</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="6-10 years">6-10 years</option>
                        <option value="More than 10 years">More than 10 years</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="targetAudience" className="form-label fw-normal" style={{ color: '#333' }}>
                        Target Audience
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="targetAudience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        placeholder="Who are your customers?"
                        style={{ borderRadius: '0' }}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="products" className="form-label fw-normal" style={{ color: '#333' }}>
                        Products/Services You Plan to Sell
                      </label>
                      <textarea
                        className="form-control"
                        id="products"
                        name="products"
                        rows="2"
                        value={formData.products}
                        onChange={handleChange}
                        placeholder="Describe the main products or services you want to sell on our platform..."
                        style={{ borderRadius: '0' }}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label htmlFor="reasonToJoin" className="form-label fw-normal" style={{ color: '#333' }}>
                        Why do you want to join our platform? *
                      </label>
                      <textarea
                        className="form-control"
                        id="reasonToJoin"
                        name="reasonToJoin"
                        rows="3"
                        value={formData.reasonToJoin}
                        onChange={handleChange}
                        required
                        placeholder="Tell us why you want to join GiftStore and what you hope to achieve..."
                        style={{ borderRadius: '0' }}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Link to="/" className="btn btn-outline-dark me-md-2" style={{ borderRadius: '0' }}>
                          Cancel
                        </Link>
                        <button 
                          type="submit" 
                          className="btn btn-dark"
                          disabled={loading}
                          style={{ borderRadius: '0' }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>
                              Submit Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 