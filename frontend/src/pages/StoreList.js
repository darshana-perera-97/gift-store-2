import React, { useState, useEffect } from 'react';
import StoreModal from '../components/StoreModal';

export default function StoreList() {
  const [stores, setStores]     = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  const fetchStores = async () => {
    try {
      const res = await fetch('http://localhost:3031/viewStores');
      const data = await res.json();
      setStores(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div>
      <h2>All Stores</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
        gap: 16
      }}>
        {stores.map(s => (
          <div
            key={s.storeId}
            onClick={() => setSelectedStore(s)}
            style={{
              border: '1px solid #ccc',
              padding: 12,
              cursor: 'pointer'
            }}
          >
            <h3>{s.storeName}</h3>
            <p><strong>Location:</strong> {s.location}</p>
            <p><strong>Status:</strong> {s.status}</p>
          </div>
        ))}
      </div>

      {selectedStore && (
        <StoreModal
          store={selectedStore}
          onClose={() => {
            setSelectedStore(null);
            fetchStores();
          }}
        />
      )}
    </div>
  );
}
