import React, { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search, sortBy, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productsAPI.getAll({
        search,
        sortBy,
        order: sortOrder
      });
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  return (
    <div className="product-list-container">
      <h2>Products</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="name">Name</option>
          <option value="brand">Brand</option>
          <option value="price">Price</option>
          <option value="pricePerCapacity">Price per Unit</option>
          <option value="purchaseDate">Purchase Date</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="sort-button"
        >
          {sortOrder === 'asc' ? '↑' : '↓'} Sort
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {products.length === 0 && !loading && (
        <div className="no-products">No products found. Import an Excel file to get started.</div>
      )}

      <div className="products-table">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <h3>{product.name}</h3>
              <button onClick={() => handleDelete(product.id)} className="delete-btn">✕</button>
            </div>
            <div className="product-details">
              {product.brand && <p><strong>Brand:</strong> {product.brand}</p>}
              <p><strong>Price:</strong> €{product.price.toFixed(2)}</p>
              <p><strong>Size:</strong> {product.quantity} × {product.capacity || product.quantity} {product.unit}</p>
              <p><strong>Price per {product.unit}:</strong> €{(product.pricePerCapacity || product.pricePerUnit || 0).toFixed(4)}</p>
              {product.purchaseDate && (
                <p><strong>Purchase Date:</strong> {new Date(product.purchaseDate).toLocaleDateString()}</p>
              )}
              {product.notes && <p><strong>Notes:</strong> {product.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
