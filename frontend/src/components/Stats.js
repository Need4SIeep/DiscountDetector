import React, { useState, useEffect } from 'react';
import { productsAPI } from '../utils/api';
import './Stats.css';

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading statistics...</div>;
  if (!stats) return null;

  return (
    <div className="stats-container">
      <h2>Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalItems}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalBrands}</div>
          <div className="stat-label">Brands</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">€{(stats.avgPrice || 0).toFixed(2)}</div>
          <div className="stat-label">Avg Price</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">€{(stats.avgPricePerUnit || 0).toFixed(2)}</div>
          <div className="stat-label">Avg Price/Unit</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">€{(stats.minPrice || 0).toFixed(2)}</div>
          <div className="stat-label">Min Price</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">€{(stats.maxPrice || 0).toFixed(2)}</div>
          <div className="stat-label">Max Price</div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
