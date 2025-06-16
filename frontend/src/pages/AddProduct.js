// src/pages/AddProduct.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [productName, setName] = useState('');
  const [description, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [includes, setIncludes] = useState(['']);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleIncludeChange = (idx, val) => {
    const arr = [...includes];
    arr[idx] = val;
    setIncludes(arr);
  };
  const addInclude = () => setIncludes([...includes, '']);

  const handleImageChange = e => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const form = new FormData();
    form.append('storeId', storeId);
    form.append('productName', productName);
    form.append('description', description);
    form.append('price', price);
    includes.forEach(i => form.append('includes', i));
    images.slice(0, 5).forEach(img => form.append('images', img));

    try {
      const res = await fetch('http://localhost:3031/addProduct', {
        method: 'POST',
        body: form,
      });
      const body = await res.json();
      if (!body.success) throw new Error(body.error || 'Failed');
      navigate(`/store/${storeId}`);
    } catch (err) {
      console.error(err);
      setError('Could not add product');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 24 }}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label><br/>
          <input
            value={productName}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label><br/>
          <textarea
            value={description}
            onChange={e => setDesc(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Price (Rs.)</label><br/>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Includes</label><br/>
          {includes.map((inc, i) => (
            <div key={i}>
              <input
                value={inc}
                onChange={e => handleIncludeChange(i, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addInclude}>
            + Add Line
          </button>
        </div>

        <div>
          <label>Images (max 5)</label><br/>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
