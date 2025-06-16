import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthProvider';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      login(username);
      navigate('/stores');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: 'auto' }}>
      <h2>Admin Login</h2>
      <div>
        <label>Username</label><br />
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <div style={{ marginTop: 12 }}>
        <label>Password</label><br />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" style={{ marginTop: 16 }}>Login</button>
    </form>
  );
}
