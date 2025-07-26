import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../apiConfig';

const districts = [
  'Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya',
  'Galle','Matara','Hambantota','Jaffna','Kilinochchi','Mannar',
  'Vavuniya','Mullaitivu','Batticaloa','Ampara','Trincomalee',
  'Kurunegala','Puttalam','Anuradhapura','Polonnaruwa','Badulla',
  'Monaragala','Ratnapura','Kegalle'
];

export default function AddStore() {
  const [form, setForm] = useState({
    storeName: '',
    location: '',
    email: '',
    password: '',
    tp: '',
    status: 'active',
    description: '',
    propic: null,
    backgroundImage: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = e => {
    const { name, files } = e.target;
    setForm(f => ({ ...f, [name]: files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    for (let key in form) {
      if (form[key] != null) data.append(key, form[key]);
    }

    try {
      const res = await fetch(buildApiUrl('/createStore'), {
        method: 'POST',
        body: data
      });
      
      if (res.ok) {
        navigate('/stores');
      } else {
        setError('Failed to create store. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h3 className="mb-0">
                <i className="fas fa-store me-2"></i>
                Add New Store
              </h3>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Store Name */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="storeName" className="form-label">
                      <i className="fas fa-store me-2"></i>
                      Store Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="storeName"
                      name="storeName"
                      value={form.storeName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Location */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="location" className="form-label">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Location *
                    </label>
                    <select
                      className="form-select"
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">-- Select District --</option>
                      {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Email */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Password */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Password *
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Telephone */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="tp" className="form-label">
                      <i className="fas fa-phone me-2"></i>
                      Telephone *
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="tp"
                      name="tp"
                      value={form.tp}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="status" className="form-label">
                      <i className="fas fa-toggle-on me-2"></i>
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="col-12 mb-3">
                    <label htmlFor="description" className="form-label">
                      <i className="fas fa-align-left me-2"></i>
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Tell us about your store..."
                      disabled={loading}
                    />
                  </div>

                  {/* Profile Picture */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="propic" className="form-label">
                      <i className="fas fa-image me-2"></i>
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="propic"
                      name="propic"
                      accept="image/*"
                      onChange={handleFile}
                      disabled={loading}
                    />
                    <div className="form-text">Recommended size: 400x400 pixels</div>
                  </div>

                  {/* Background Image */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="backgroundImage" className="form-label">
                      <i className="fas fa-image me-2"></i>
                      Background Image
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="backgroundImage"
                      name="backgroundImage"
                      accept="image/*"
                      onChange={handleFile}
                      disabled={loading}
                    />
                    <div className="form-text">Recommended size: 1200x400 pixels</div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-md-2"
                    onClick={() => navigate('/stores')}
                    disabled={loading}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Store...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i>
                        Create Store
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
  );
}
