import React, { useState } from 'react';
import { productsAPI } from '../utils/api';
import './AddProductModal.css';

function AddProductModal({ isOpen, onClose, onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    quantity: '1',
    capacity: '',
    unit: 'L',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setError('Product name is required');
        setLoading(false);
        return;
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError('Price must be greater than 0');
        setLoading(false);
        return;
      }
      if (!formData.capacity || parseFloat(formData.capacity) <= 0) {
        setError('Capacity must be greater than 0');
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 1,
        capacity: parseFloat(formData.capacity)
      };

      await productsAPI.create(submitData);

      // Reset form and close modal
      setFormData({
        name: '',
        brand: '',
        price: '',
        quantity: '1',
        capacity: '',
        unit: 'L',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setError('');
      
      onProductAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Add New Product</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Olive Oil"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Optional"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (€) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="1"
                min="1"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Capacity (Size) *</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 500"
                step="0.1"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Unit *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="L">Liters (L)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="g">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="pieces">Pieces</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Purchase Date *</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes (optional)"
              rows="2"
              disabled={loading}
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? '⏳ Adding...' : '✓ Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
