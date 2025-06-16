// src/pages/StoreCustomerView.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function StoreCustomerView({ storeId }) {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // load store details
    fetch('http://localhost:3031/viewStores')
      .then(r => r.json())
      .then(all => all.find(s => s.storeId === storeId))
      .then(setStore)
      .catch(console.error);

    // load this store’s products
    fetch(`http://localhost:3031/products/${storeId}`)
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error);
  }, [storeId]);

  if (!store) return <p>Loading…</p>;

  return (
    <div style={{ padding: 24 }}>
      {/* banner */}
      {store.backgroundImage && (
        <img
          src={`http://localhost:3031/storeAssets/${store.backgroundImage}`}
          alt="banner"
          style={{
            width: '100%',
            height: 300,
            objectFit: 'cover',
            marginBottom: 16
          }}
        />
      )}

      {/* basic info */}
      <h1>{store.storeName}</h1>
      <p>{store.description}</p>

      <hr style={{ margin: '2rem 0' }} />

      {/* products */}
      <h2>Products</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
        gap: 16
      }}>
        {products.map(p => (
          <Link
            key={p.productId}
            to={`/store/${storeId}/product/${p.productId}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #ddd',
              borderRadius: 8,
              overflow: 'hidden'
            }}
          >
            {p.images[0] && (
              <img
                src={`http://localhost:3031/productImages/${p.images[0]}`}
                alt={p.productName}
                style={{ width: '100%', height: 120, objectFit: 'cover' }}
              />
            )}
            <div style={{ padding: 8 }}>
              <h3>{p.productName}</h3>
              <p>Rs. {p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
