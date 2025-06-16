// src/pages/ProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductPage() {
  const { storeId, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3031/product/${productId}`)
      .then(r => r.json())
      .then(setProduct)
      .catch(console.error);
  }, [productId]);

  const handleOrder = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3031/orderProduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: qty,
          customerName,
          customerEmail,
        }),
      });
      const body = await res.json();
      if (body.success) {
        setMessage('Order placed! Check your email for confirmation.');
        setQty(1);
        setCustomerName('');
        setCustomerEmail('');
      } else {
        throw new Error(body.error || 'Order failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Could not place order.');
    }
  };

  if (!product) return <p>Loading…</p>;

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: 'auto' }}>
      <h1>{product.productName}</h1>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {product.images.map((img, i) => (
          <img
            key={i}
            src={`http://localhost:3031/productImages/${img}`}
            alt={`${product.productName} ${i}`}
            style={{ width: 150, height: 150, objectFit: 'cover' }}
          />
        ))}
      </div>
      <p>{product.description}</p>
      <ul>
        {product.includes.map((inc, i) => (
          <li key={i}>{inc}</li>
        ))}
      </ul>
      <p><strong>Price:</strong> Rs. {product.price}</p>

      <hr/>

      <h2>Place Order</h2>
      <form onSubmit={handleOrder}>
        <div>
          <label>Quantity</label><br/>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={e => setQty(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Your Name</label><br/>
          <input
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Your Email</label><br/>
          <input
            type="email"
            value={customerEmail}
            onChange={e => setCustomerEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Order Now</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
