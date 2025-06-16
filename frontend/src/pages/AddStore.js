import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const data = new FormData();
    for (let key in form) {
      if (form[key] != null) data.append(key, form[key]);
    }

    try {
      const res = await fetch('http://localhost:3031/createStore', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        alert('Store created!');
        navigate('/stores');
      } else {
        alert('Failed to create');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Add Store</h2>
      <div>
        <label>Store Name</label><br />
        <input
          name="storeName"
          value={form.storeName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Location</label><br />
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        >
          <option value="">-- select district --</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Email</label><br />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password</label><br />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Telephone</label><br />
        <input
          name="tp"
          value={form.tp}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Status</label><br />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div>
        <label>Description</label><br />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Profile Pic</label><br />
        <input
          type="file"
          name="propic"
          accept="image/*"
          onChange={handleFile}
        />
      </div>
      <div>
        <label>Background Image</label><br />
        <input
          type="file"
          name="backgroundImage"
          accept="image/*"
          onChange={handleFile}
        />
      </div>
      <button type="submit" style={{ marginTop: 12 }}>
        Create Store
      </button>
    </form>
  );
}
