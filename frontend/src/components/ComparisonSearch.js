import React, { useState } from 'react';
import axios from 'axios';
import './ComparisonSearch.css';

function ComparisonSearch() {
  const [searchName, setSearchName] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('1');
  const [currentCapacity, setCurrentCapacity] = useState('');
  const [currentUnit, setCurrentUnit] = useState('L');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) {
      setError('Please enter a product name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/products', {
        params: { search: searchName }
      });
      
      // Auto-detect unit from results if available
      if (response.data.length > 0) {
        const firstUnit = response.data[0].unit;
        setCurrentUnit(firstUnit);
      }
      
      setResults(response.data);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to search for products');
    } finally {
      setLoading(false);
    }
  };

  const calculateCurrentPricePerCapacity = () => {
    if (currentQuantity && currentCapacity && currentPrice) {
      const qty = parseFloat(currentQuantity);
      const cap = parseFloat(currentCapacity);
      if (qty > 0 && cap > 0) {
        return (parseFloat(currentPrice) / (qty * cap)).toFixed(4);
      }
    }
    return 0;
  };

  const sortedResults = [...results].sort((a, b) => {
    const priceA = a.pricePerCapacity || 0;
    const priceB = b.pricePerCapacity || 0;
    return priceA - priceB;
  });

  return (
    <div className="comparison-search-container">
      <div className="search-section">
        <h2>🔍 Product Price Comparison</h2>
        <p className="subtitle">Search for a product and compare prices across your purchases</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Product name (e.g., 'Milk', 'Shampoo')"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
            />
            <button type="submit" disabled={loading} className="search-btn">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Current Purchase Section */}
      {hasSearched && (
        <div className="current-purchase-section">
          <h3>� Compare Your Current Deal</h3>
          <div className="input-grid">
            <div className="input-group">
              <label>Price (€) *</label>
              <input
                type="number"
                placeholder="0.00"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                step="0.01"
                required
              />
            </div>
            <div className="input-group">
              <label>Quantity (items) *</label>
              <input
                type="number"
                placeholder="1"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                step="0.01"
                required
              />
            </div>
            <div className="input-group">
              <label>Capacity (per item) *</label>
              <input
                type="number"
                placeholder="e.g., 1 for 1L, 0.6 for 600mL"
                value={currentCapacity}
                onChange={(e) => setCurrentCapacity(e.target.value)}
                step="0.01"
                required
              />
            </div>
            <div className="input-group">
              <label>Unit *</label>
              <select value={currentUnit} onChange={(e) => setCurrentUnit(e.target.value)}>
                <option value="pcs">pieces</option>
                <option value="g">grams (g)</option>
                <option value="kg">kilograms (kg)</option>
                <option value="mL">milliliters (mL)</option>
                <option value="L">liters (L)</option>
                <option value="oz">ounces (oz)</option>
                <option value="rolls">rolls</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && (
        <div className="results-section">
          <h3>📊 Historical Prices</h3>
          
          {/* Unit Warning */}
          {sortedResults.length > 0 && currentUnit && (
            <div className="unit-info">
              💡 Comparing <strong>{currentUnit}</strong> products only. Found <strong>{sortedResults.length}</strong> entries in {sortedResults[0].unit}.
            </div>
          )}

          {sortedResults.length === 0 ? (
            <div className="no-results">
              No previous purchases found for "{searchName}". 
              {currentPrice && currentQuantity && currentCapacity && (
                <p style={{ marginTop: '10px', fontSize: '14px' }}>
                  ✓ You can save this new price by importing it via Excel or adding manually.
                </p>
              )}
            </div>
          ) : (
            <div className="comparison-grid">
              {sortedResults.map((product, index) => {
                const isCurrentBetter = currentPrice && currentQuantity && currentCapacity &&
                  (parseFloat(currentPrice) / (parseFloat(currentQuantity) * parseFloat(currentCapacity))) < product.pricePerCapacity;
                
                return (
                  <div key={product.id} className={`comparison-card ${isCurrentBetter ? 'highlight-better' : ''}`}>
                    <div className="card-rank">#{index + 1}</div>
                    
                    <div className="card-header">
                      {product.brand && <div className="brand">{product.brand}</div>}
                      <div className="date">{new Date(product.purchaseDate).toLocaleDateString('nl-NL')}</div>
                    </div>

                    <div className="price-per-unit">
                      <div className="label">Price per {product.unit}</div>
                      <div className="value">€{product.pricePerCapacity.toFixed(4)}</div>
                    </div>

                    <div className="details">
                      <div className="detail">
                        <span className="detail-label">Total Price:</span>
                        <span className="detail-value">€{product.price.toFixed(2)}</span>
                      </div>
                      <div className="detail">
                        <span className="detail-label">Size:</span>
                        <span className="detail-value">{product.quantity} × {product.capacity} {product.unit}</span>
                      </div>
                      {product.notes && (
                        <div className="detail">
                          <span className="detail-label">Notes:</span>
                          <span className="detail-value">{product.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    {isCurrentBetter && (
                      <div className="better-price-badge">✓ Better than this!</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {sortedResults.length > 0 && currentPrice && currentQuantity && currentCapacity && (
            <div className="price-comparison-summary">
              {(() => {
                const currentPricePerCapacity = parseFloat(currentPrice) / (parseFloat(currentQuantity) * parseFloat(currentCapacity));
                const bestPrice = Math.min(...sortedResults.map(p => p.pricePerCapacity));
                const isBetter = currentPricePerCapacity < bestPrice;
                const percentDiff = Math.abs(((currentPricePerCapacity - bestPrice) / bestPrice) * 100);
                const bestPriceProduct = sortedResults.find(p => p.pricePerCapacity === bestPrice);

                return (
                  <div>
                    <p className="comparison-text">
                      Your current price is <strong>€{currentPricePerCapacity.toFixed(4)}/{currentUnit}</strong>. 
                      The best price in our database is <strong>€{bestPrice.toFixed(4)}/{sortedResults[0].unit}</strong>.
                    </p>
                    {isBetter ? (
                      <p className="comparison-highlight better">
                        ✨ Your current deal is <strong>{percentDiff.toFixed(1)}% better</strong>, get it while you can!
                      </p>
                    ) : (
                      <p className="comparison-highlight worse">
                        📅 On <strong>{new Date(bestPriceProduct.purchaseDate).toLocaleDateString('nl-NL')}</strong> the price was <strong>{percentDiff.toFixed(1)}% lower</strong>, perhaps it's better to wait for another sale.
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ComparisonSearch;
