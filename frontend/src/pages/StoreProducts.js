// src/pages/StoreProducts.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function StoreProducts() {
  const { storeId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3031/products/${storeId}`)
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error);
  }, [storeId]);

  return (
    <div style={{ padding: 24 }}>
      <h2>All Products</h2>
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
                  src={`http://localhost:3031/productImages/${p.images[0]}`}
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
