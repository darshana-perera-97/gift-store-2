import React, { useState, useEffect } from 'react';
import { buildApiUrl, getStoreImageUrl } from '../apiConfig';

export default function StoreModal({ store, onClose }) {
  const [info, setInfo]       = useState(store);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(buildApiUrl(`/products/${store.storeId}`))
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error);
  }, [store.storeId]);

  const toggleStatus = async () => {
    const newStatus = info.status === 'active' ? 'suspended' : 'active';
    const res = await fetch(buildApiUrl('/changeStatus'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId: store.storeId, status: newStatus })
    });
    if (res.ok) {
      const { store: updated } = await res.json();
      setInfo(updated);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', padding: 24, width: 500,
        maxHeight: '90vh', overflowY: 'auto', position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 8, right: 8,
            fontSize: 18, border: 'none', background: 'transparent'
          }}
        >×</button>

        <h3>{info.storeName}</h3>
        <p><strong>Location:</strong> {info.location}</p>
        <p><strong>Email:</strong> {info.email}</p>
        <p><strong>TP:</strong> {info.tp}</p>
        <p>
          <strong>Status:</strong> {info.status}{' '}
          <button onClick={toggleStatus}>
            {info.status === 'active' ? 'Suspend' : 'Activate'}
          </button>
        </p>
        <p>
          <strong>Password:</strong>{' '}
          <input type="password" readOnly value={info.password} />
        </p>
        <p><strong>Description:</strong> {info.description}</p>

        {info.propic && (
          <img
            src={getStoreImageUrl(info.propic)}
            alt="profile"
            style={{ maxWidth: 100, marginRight: 12 }}
          />
        )}
        {info.backgroundImage && (
          <img
            src={getStoreImageUrl(info.backgroundImage)}
            alt="background"
            style={{ maxWidth: 100 }}
          />
        )}

        <h4 style={{ marginTop: 24 }}>Products</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))',
          gap: 12
        }}>
          {products.map(p => (
            <div key={p.productId} style={{
              border: '1px solid #ddd',
              padding: 8,
              textAlign: 'center'
            }}>
              <h5 style={{ margin: 0 }}>{p.productName}</h5>
              <p style={{ fontSize: 12, margin: '4px 0' }}>
                ₹{p.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
