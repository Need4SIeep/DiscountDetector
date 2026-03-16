import React, { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './ProductList.css';

function ProductList() {
  const { isAdmin, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    brand: '',
    price: '',
    quantity: '',
    capacity: '',
    unit: '',
    purchaseDate: '',
    notes: ''
  });

  // Fetch products when search or sort changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      brand: product.brand || '',
      price: product.price,
      quantity: product.quantity || 1,
      capacity: product.capacity || 1,
      unit: product.unit || 'pcs',
      purchaseDate: product.purchaseDate,
      notes: product.notes || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id) => {
    try {
      await productsAPI.update(id, editForm);
      setProducts(products.map(p => 
        p.id === id ? { ...p, ...editForm } : p
      ));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update product');
      console.error(err);
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

  const canEditProduct = (product) => {
    return isAdmin || (user && product.userId === user.id);
  };

  return (
    <div className="product-list-container">
      <h2>📋 All Products</h2>

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
        {products.map((product) => 
          editingId === product.id ? (
            // Edit Mode
            <div key={product.id} className="product-card editing">
              <div className="product-header">
                <h3>Edit Product</h3>
              </div>
              <div className="edit-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Brand"
                    value={editForm.brand}
                    onChange={(e) => setEditForm({...editForm, brand: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    step="0.01"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Capacity"
                    step="0.01"
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({...editForm, capacity: e.target.value})}
                  />
                  <select
                    value={editForm.unit}
                    onChange={(e) => setEditForm({...editForm, unit: e.target.value})}
                  >
                    <option value="pcs">pieces</option>
                    <option value="g">grams (g)</option>
                    <option value="kg">kilograms (kg)</option>
                    <option value="mL">milliliters (mL)</option>
                    <option value="L">liters (L)</option>
                    <option value="oz">ounces (oz)</option>
                    <option value="rolls">rolls</option>
                  </select>
                </div>
                <div className="form-row">
                  <input
                    type="date"
                    value={editForm.purchaseDate}
                    onChange={(e) => setEditForm({...editForm, purchaseDate: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Notes"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  />
                </div>
                <div className="form-actions">
                  <button className="btn-save" onClick={() => handleSaveEdit(product.id)}>
                    💾 Save
                  </button>
                  <button className="btn-cancel" onClick={handleCancelEdit}>
                    ✕ Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // View Mode
            <div key={product.id} className="product-card">
              <div className="product-header">
                <h3>{product.name}</h3>
                <div className="product-actions">
                  {canEditProduct(product) && (
                    <>
                      <button 
                        onClick={() => handleEdit(product)} 
                        className="edit-btn"
                        title="Edit this product"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="delete-btn"
                        title="Delete this product"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
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
          )
        )}
      </div>
    </div>
  );
}

export default ProductList;
