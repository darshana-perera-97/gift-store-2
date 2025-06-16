import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function StoreAdminPage() {
  const { storeId } = useParams();
  const nav = useNavigate();
  const [store] = useState(JSON.parse(localStorage.getItem('store')));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // if for some reason storeId mismatch, force back to login
    if (!store || store.storeId !== storeId) {
      localStorage.removeItem('store');
      return nav(`/store/${storeId}/admin/login`);
    }
    fetch(`http://localhost:3031/products/${storeId}`)
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error);
  }, [storeId, nav, store]);

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>{store.storeName} (Admin)</h1>
        <div>
          <button onClick={() => {
              localStorage.removeItem('store');
              nav(`/store/${storeId}/admin/login`);
            }}
          >
            Logout
          </button>
          <Link to={`/store/${storeId}/admin/add-product`}>
            <button style={{ marginLeft: 8 }}>+ Add Product</button>
          </Link>
        </div>
      </header>

      <h2>Your Products</h2>
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
              display: 'block',
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
              <h3 style={{ margin: '0 0 .5rem' }}>{p.productName}</h3>
              <p style={{ margin: 0 }}>Rs. {p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
