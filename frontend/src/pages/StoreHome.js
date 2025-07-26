// src/pages/StoreHome.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { buildApiUrl, getStoreImageUrl, getProductImageUrl } from '../apiConfig';

export default function StoreHome() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(JSON.parse(localStorage.getItem('store')));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!store || store.storeId !== storeId) {
      // Mismatch: log out
      localStorage.removeItem('store');
      navigate('/store/login');
      return;
    }
    fetch(buildApiUrl(`/products/${storeId}`))
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error);
  }, [storeId, store, navigate]);

  return (
    <div style={{ padding: 24 }}>
      <button onClick={() => { localStorage.removeItem('store'); navigate('/store/login'); }}>
        Logout
      </button>

      <h1>{store.storeName}</h1>
      <p><strong>Location:</strong> {store.location}</p>
      <p>{store.description}</p>
      {store.backgroundImage && (
        <img
          src={getStoreImageUrl(store.backgroundImage)}
          alt="bg"
          style={{ maxWidth: '100%', marginBottom: 16 }}
        />
      )}
      {store.propic && (
        <img
          src={`/storeAssets/${store.propic}`}
          alt="logo"
          style={{ width: 100, borderRadius: '50%' }}
        />
      )}

      <hr/>

      <Link to={`/store/${storeId}/add-product`}>+ Add New Product</Link>
      <h2>Your Products</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {products.map(p => (
          <div
            key={p.productId}
            style={{
              border: '1px solid #ccc',
              padding: 8,
              width: 200,
              textAlign: 'center',
            }}
          >
            <Link to={`/store/${storeId}/product/${p.productId}`}>
              {p.images[0] && (
                <img
                  src={getProductImageUrl(p.images[0])}
                  alt={p.productName}
                  style={{ width: '100%', height: 100, objectFit: 'cover' }}
                />
              )}
              <h3>{p.productName}</h3>
            </Link>
            <p>Rs. {p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
