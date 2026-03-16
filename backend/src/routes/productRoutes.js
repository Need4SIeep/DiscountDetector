const express = require('express');
const router = express.Router();
const { all, run, get, clearAll } = require('../models/database');
const { verifyToken, optionalVerifyToken } = require('../middleware/authMiddleware');

// ===== SPECIFIC ROUTES FIRST (more specific patterns) =====

// Clear all products - with confirmation token (ADMIN ONLY)
router.delete('/clear-all/confirm', verifyToken, async (req, res) => {
  try {
    const { confirmToken } = req.body;

    // Check if admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Simple confirmation - in production, you might want a time-based token or stronger verification
    if (confirmToken !== 'CONFIRM_CLEAR_ALL_PRODUCTS') {
      return res.status(403).json({ error: 'Invalid confirmation token' });
    }

    await clearAll();

    res.json({ 
      message: 'All products deleted successfully',
      deletedCount: 0  // We don't have a count from clearAll, but UI doesn't need it
    });
  } catch (error) {
    console.error('Error clearing all products:', error);
    res.status(500).json({ error: 'Failed to clear all products' });
  }
});

// Get statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await get(`
      SELECT 
        COUNT(*) as totalItems,
        COUNT(DISTINCT brand) as totalBrands,
        AVG(pricePerCapacity) as avgPricePerCapacity,
        MIN(price) as minPrice,
        MAX(price) as maxPrice,
        AVG(price) as avgPrice
      FROM products
    `);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ===== GENERIC ROUTES (less specific patterns) =====

// Get all products
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.order === 'desc' ? 'DESC' : 'ASC';

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR brand LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Validate sortBy to prevent SQL injection
    const validSortFields = ['name', 'brand', 'price', 'pricePerCapacity', 'purchaseDate', 'createdAt'];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: 'Invalid sort field' });
    }

    sql += ` ORDER BY ${sortBy} ${sortOrder}`;

    const products = await all(sql, params);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add new product (REQUIRES LOGIN)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, brand, price, quantity, capacity, unit, purchaseDate, notes } = req.body;

    if (!name || price === undefined || !unit || !purchaseDate) {
      return res.status(400).json({ error: 'Missing required fields: name, price, unit, purchaseDate' });
    }

    const qty = parseInt(quantity) || 1;
    const cap = parseFloat(capacity) || qty;
    const pricePerCapacity = qty > 0 && cap > 0 ? price / (qty * cap) : 0;

    const result = await run(
      `INSERT INTO products (name, brand, price, quantity, capacity, unit, purchaseDate, pricePerCapacity, notes, userId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, brand || '', price, qty, cap, String(unit).trim(), purchaseDate, pricePerCapacity, notes || '', req.user.id]
    );

    res.status(201).json({
      id: result.id,
      message: 'Product added successfully'
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product (REQUIRES LOGIN - owner or admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, price, quantity, capacity, unit, purchaseDate, notes } = req.body;

    const product = await get('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check ownership (owner or admin can edit)
    if (product.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'You can only edit your own products' });
    }

    const updatedQuantity = quantity !== undefined ? parseInt(quantity) : product.quantity || 1;
    const updatedCapacity = capacity !== undefined ? parseFloat(capacity) : product.capacity || updatedQuantity;
    const updatedPrice = price !== undefined ? price : product.price;
    const pricePerCapacity = updatedQuantity > 0 && updatedCapacity > 0 ? updatedPrice / (updatedQuantity * updatedCapacity) : 0;

    await run(
      `UPDATE products SET name = ?, brand = ?, price = ?, quantity = ?, capacity = ?, unit = ?, purchaseDate = ?, pricePerCapacity = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name || product.name,
        brand !== undefined ? brand : (product.brand || ''),
        updatedPrice,
        updatedQuantity,
        updatedCapacity,
        unit || product.unit || 'pcs',
        purchaseDate || product.purchaseDate,
        pricePerCapacity,
        notes !== undefined ? notes : (product.notes || ''),
        id
      ]
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete single product (REQUIRES LOGIN - owner or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const product = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check ownership (owner or admin can delete)
    if (product.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }

    await run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
