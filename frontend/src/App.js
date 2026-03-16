import React, { useState } from 'react';
import './App.css';
import ExcelUpload from './components/ExcelUpload';
import ComparisonSearch from './components/ComparisonSearch';
import ProductList from './components/ProductList';
import { productsAPI } from './utils/api';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showProductList, setShowProductList] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await productsAPI.clearAll('CONFIRM_CLEAR_ALL_PRODUCTS');
      setShowClearConfirm(false);
      setRefreshTrigger(refreshTrigger + 1);
    } catch (error) {
      console.error('Error clearing products:', error);
      alert('Failed to clear products. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>💰 Cost Tracker</h1>
          <p className="subtitle">Find the best prices for your daily shopping</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Main Comparison Search */}
          <ComparisonSearch key={refreshTrigger} />

          {/* Toggle to show all products */}
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${!showProductList ? 'active' : ''}`}
              onClick={() => setShowProductList(false)}
            >
              🔍 Price Comparison
            </button>
            <button 
              className={`toggle-btn ${showProductList ? 'active' : ''}`}
              onClick={() => setShowProductList(true)}
            >
              📋 All Products
            </button>
            <button 
              className="toggle-btn clear-btn"
              onClick={() => setShowClearConfirm(true)}
              title="Delete all products from database"
            >
              🗑️ Clear All
            </button>
          </div>

          {/* All Products List */}
          {showProductList && (
            <ProductList key={`products-${refreshTrigger}`} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Cost Tracker © 2024 - Smart shopping made easy</p>
      </footer>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => !isClearing && setShowClearConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>⚠️ Clear All Products?</h2>
            <p>This will delete all products from the database. This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowClearConfirm(false)}
                disabled={isClearing}
              >
                Cancel
              </button>
              <button 
                className="btn-danger" 
                onClick={handleClearAll}
                disabled={isClearing}
              >
                {isClearing ? '⏳ Clearing...' : '🗑️ Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Button - Fixed Position */}
      <ExcelUpload onUploadSuccess={handleUploadSuccess} />
    </div>
  );
}

export default App;
