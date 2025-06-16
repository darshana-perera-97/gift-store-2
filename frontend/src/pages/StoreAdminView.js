// src/pages/StoreAdminView.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StoreAdminView({ store }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3031/products/${store.storeId}`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, [store.storeId]);

  const logout = () => {
    localStorage.removeItem("store");
    navigate("/store/login");
  };

  return (
    <div style={{ padding: 24 }}>
      <button onClick={logout}>Logout</button>
      <h1>{store.storeName} (Admin)</h1>

      <p>
        <strong>Location:</strong> {store.location}
      </p>
      {store.backgroundImage && (
        <img
          src={`http://localhost:3031/storeAssets/${store.backgroundImage}`}
          alt="bg"
          style={{ maxWidth: "100%", margin: "1rem 0" }}
        />
      )}
      {store.propic && (
        <img
          src={`http://localhost:3031/storeAssets/${store.propic}`}
          alt="logo"
          style={{ width: 80, borderRadius: "50%" }}
        />
      )}
      <p>{store.description}</p>

      <hr style={{ margin: "2rem 0" }} />

      <Link to={`/store/${store.storeId}/add-product`}>+ Add New Product</Link>

      <h2>Your Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
          gap: 16,
        }}
      >
        {products.map((p) => (
          <Link
            key={p.productId}
            to={`/store/${store.storeId}/product/${p.productId}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #ddd",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {p.images[0] && (
              <img
                src={`http://localhost:3031/productImages/${p.images[0]}`}
                alt={p.productName}
                style={{ width: "100%", height: 120, objectFit: "cover" }}
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
