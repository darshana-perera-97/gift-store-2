import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function StoreAdminLogin() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handle = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3031/viewStores');
      const list = await res.json();
      const s = list.find(
        s => s.storeId === storeId &&
             s.email === email &&
             s.password === password &&
             s.status === 'active'
      );
      if (!s) {
        setErr('Invalid credentials or suspended');
        return;
      }
      // store in localStorage and go to admin dashboard
      localStorage.setItem('store', JSON.stringify(s));
      navigate(`/store/${storeId}/admin`);
    } catch {
      setErr('Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '100px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Admin Login for {storeId}</h2>
      <form onSubmit={handle}>
        <div>
          <label>Email</label><br/>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)} required
          />
        </div>
        <div>
          <label>Password</label><br/>
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)} required
          />
        </div>
        {err && <p style={{ color: 'red' }}>{err}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
