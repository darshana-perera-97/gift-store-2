import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function StoreCustomerPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 1) load this store
    fetch("http://localhost:3031/viewStores")
      .then((r) => r.json())
      .then((all) => {
        const s = all.find((s) => s.storeId === storeId);
        if (!s) return navigate("/"); // invalid storeId → home
        setStore(s);
      });

    // 2) load its products
    fetch(`http://localhost:3031/products/${storeId}`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, [storeId, navigate]);

  if (!store) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: 24 }}>
      {/* Store banner */}
      {store.backgroundImage && (
        <img
          src={`http://localhost:3031/storeAssets/${store.backgroundImage}`}
          alt="Banner"
          style={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            marginBottom: 16,
          }}
        />
      )}
      <h1>{store.storeName}</h1>
      <p>{store.description}</p>

      <Link to={`/store/${storeId}/admin/login`} style={{ float: "right" }}>
        Store Admin Login
      </Link>

      <h2>Products</h2>
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
            to={`/store/${storeId}/product/${p.productId}`}
            style={{
              display: "block",
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
              <h3 style={{ margin: "0 0 .5rem" }}>{p.productName}</h3>
              <p style={{ margin: 0 }}>Rs. {p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
