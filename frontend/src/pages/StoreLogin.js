// src/pages/StoreLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StoreLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3031/viewStores');
      const stores = await res.json();
      const store = stores.find(
        s => s.email === email && s.password === password && s.status === 'active'
      );
      if (!store) {
        setError('Invalid credentials or store suspended');
        return;
      }
      localStorage.setItem('store', JSON.stringify(store));
      navigate(`/store/${store.storeId}`);
    } catch (err) {
      console.error(err);
      setError('Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Store Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br/>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label><br/>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
