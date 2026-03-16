import React, { useState } from 'react';
import './App.css';
import ExcelUpload from './components/ExcelUpload';
import ComparisonSearch from './components/ComparisonSearch';
import ProductList from './components/ProductList';
import Auth from './components/Auth';
import AddProductModal from './components/AddProductModal';
import { productsAPI } from './utils/api';
import { useAuth } from './context/AuthContext';

function App() {
  const { isLoggedIn, isAdmin, loading, isGuest } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showProductList, setShowProductList] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshTrigger(refreshTrigger + 1);
    setImportOpen(false);
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

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Auth />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>💰 Cost Tracker</h1>
          <p className="subtitle">Find out if the deal is real!</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Main Comparison Search */}
          <ComparisonSearch key={refreshTrigger} />

          {/* Toggle to show all products */}
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${!showProductList && !importOpen ? 'active' : ''}`}
              onClick={() => {
                setShowProductList(false);
                setImportOpen(false);
              }}
            >
              🔍 Price Comparison
            </button>
            <button 
              className={`toggle-btn ${showProductList ? 'active' : ''}`}
              onClick={() => {
                setShowProductList(true);
                setImportOpen(false);
              }}
            >
              📋 All Products
            </button>
            
            {/* Add Product button - visible to all authenticated users except guests */}
            {!isGuest && (
              <button 
                className="toggle-btn add-btn"
                onClick={() => setShowAddProductModal(true)}
                title="Add a single product entry"
              >
                ➕ Add Product
              </button>
            )}

            {/* Import Data button - admin only */}
            {isAdmin && (
              <button 
                className={`toggle-btn ${importOpen ? 'active' : ''}`}
                onClick={() => setImportOpen(!importOpen)}
                title="Upload Excel file with product data (Admin only)"
              >
                📥 Import Data
              </button>
            )}

            {isAdmin && importOpen && (
              <button 
                className="toggle-btn clear-btn"
                onClick={() => setShowClearConfirm(true)}
                title="Delete all products from database (Admin only)"
              >
                🗑️ Clear All
              </button>
            )}
          </div>

          {/* Import Section */}
          {importOpen && (
            <ExcelUpload onUploadSuccess={handleUploadSuccess} />
          )}

          {/* All Products List */}
          {showProductList && (
            <ProductList key={`products-${refreshTrigger}`} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Discount Detector © 2026</p>
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

      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onProductAdded={() => {
          setRefreshTrigger(refreshTrigger + 1);
        }}
      />
    </div>
  );
}

export default App;
