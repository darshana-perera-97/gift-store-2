import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function HomePage() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // fetch active stores
    fetch('http://localhost:3031/viewStores')
      .then(res => res.json())
      .then(data => setStores(data.filter(s => s.status === 'active')))
      .catch(console.error);

    // fetch all products
    // you may need to add a GET /viewProducts endpoint in your backend
    fetch('http://localhost:3031/viewProducts')
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Marketplace</h1>
          <p>Discover the best products from local stores</p>
        </div>
      </section>

      {/* Promo Carousel */}
      <section className="promo-carousel">
        <Carousel autoPlay infiniteLoop showThumbs={false}>
          <div><img src="http://localhost:3031/assets/promo1.jpg" alt="Promo 1" /></div>
          <div><img src="http://localhost:3031/assets/promo2.jpg" alt="Promo 2" /></div>
          <div><img src="http://localhost:3031/assets/promo3.jpg" alt="Promo 3" /></div>
        </Carousel>
      </section>

      {/* Featured Products */}
      <section className="section">
        <h2>Featured Products</h2>
        <div className="card-grid">
          {products.slice(0, 8).map(p => (
            <Link
              key={p.productId}
              to={`/store/${p.storeId}/product/${p.productId}`}
              className="card"
            >
              {p.images[0] && (
                <div className="card-image">
                  <img
                    src={`http://localhost:3031/productImages/${p.images[0]}`}
                    alt={p.productName}
                  />
                </div>
              )}
              <div className="card-body">
                <h3>{p.productName}</h3>
                <p>Rs. {p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stores */}
      <section className="section">
        <h2>Our Stores</h2>
        <div className="card-grid">
          {stores.map(s => (
            <Link key={s.storeId} to={`/store/${s.storeId}`} className="card">
              {s.propic && (
                <div className="card-image">
                  <img
                    src={`http://localhost:3031/storeAssets/${s.propic}`}
                    alt={s.storeName}
                  />
                </div>
              )}
              <div className="card-body">
                <h3>{s.storeName}</h3>
                <p>{s.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
