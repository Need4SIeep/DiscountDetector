const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const { run, all } = require('../models/database');

const upload = multer({ storage: multer.memoryStorage() });

// Helper function to find column value case-insensitively with whitespace handling
const findColumnValue = (row, possibleNames) => {
  const rowKeys = Object.keys(row);
  
  for (const name of possibleNames) {
    // Try exact match
    if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
      return row[name];
    }
    
    // Try case-insensitive and whitespace-insensitive match
    const key = rowKeys.find(k => 
      k.trim().toLowerCase() === name.toLowerCase() ||
      k.toLowerCase() === name.toLowerCase()
    );
    
    if (key && row[key] !== undefined && row[key] !== null && row[key] !== '') {
      return row[key];
    }
  }
  return null;
};

// Helper function to get all column names for debugging
const getColumnNames = (row) => {
  return Object.keys(row).map(k => `"${k}"`).join(', ');
};

// Parse Excel file and insert into database
router.post('/excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`📊 Excel file parsed: ${data.length} rows found`);
    console.log(`📋 Column names in first row: ${getColumnNames(data[0] || {})}`);

    if (data.length === 0) {
      return res.status(400).json({ error: 'Excel file is empty' });
    }

    // Map Excel columns to database fields with flexible naming
    let insertedCount = 0;
    let errors = [];
    let debugInfo = [];

    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];
        
        // Skip completely empty rows
        if (Object.values(row).every(v => v === undefined || v === null || v === '')) {
          continue;
        }

        // Flexible column matching
        const name = findColumnValue(row, ['Article', 'Artikel', 'Name', 'Product', 'Item']) || findColumnValue(row, ['artikelen', 'artikel', 'naam', 'name']);
        const brand = findColumnValue(row, ['Brand', 'Merk', 'Store', 'Winkel']) || '';
        const priceStr = findColumnValue(row, ['Price', 'Prijs', 'Cost', 'Kosten', 'prijs']);
        const quantityStr = findColumnValue(row, ['Quantity', 'Aantal', 'Amount', 'Count', 'aantal', 'stuks']) || '1';
        const capacityStr = findColumnValue(row, ['Capacity', 'Size', 'Content', 'Inhoud', 'Grootte']);
        const unitStr = findColumnValue(row, ['Unit', 'Eenheid', 'UOM', 'Measure', 'Maat', 'eenheid']);
        const purchaseDateStr = findColumnValue(row, ['PurchaseDate', 'AankoopdatumDate', 'Date', 'Datum', 'datum']);
        const notes = findColumnValue(row, ['Notes', 'Opmerkingen', 'Comments', 'Remarks']) || '';

        // Debug first row
        if (i === 0) {
          console.log(`🔍 Row 1 parsing:
  - Product: "${name}" 
  - Brand: "${brand}"
  - Price raw: "${priceStr}"
  - Quantity raw: "${quantityStr}"
  - Capacity raw: "${capacityStr}"
  - Unit raw: "${unitStr}"
  - Date raw: "${purchaseDateStr}"`);
        }

        // Validate required fields
        if (!name || name === '') {
          errors.push(`Row ${i + 2}: Missing product name`);
          continue;
        }

        if (!priceStr || !unitStr) {
          errors.push(`Row ${i + 2}: Missing Price or Unit`);
          continue;
        }

        // Purchase date is now required
        if (!purchaseDateStr) {
          errors.push(`Row ${i + 2}: Missing PurchaseDate (required!)`);
          continue;
        }

        const price = parseFloat(priceStr);
        const quantity = parseInt(quantityStr) || 1;
        const capacity = parseFloat(capacityStr) || parseFloat(quantityStr) || 1;
        const unit = String(unitStr).trim();

        if (isNaN(price)) {
          errors.push(`Row ${i + 2}: Price "${priceStr}" is not a valid number`);
          continue;
        }

        if (isNaN(capacity)) {
          errors.push(`Row ${i + 2}: Capacity "${capacityStr}" is not a valid number`);
          continue;
        }

        // Calculate derived value: price per unit of capacity
        const pricePerCapacity = quantity > 0 && capacity > 0 ? price / (quantity * capacity) : 0;

        await run(
          `INSERT INTO products (name, brand, price, quantity, capacity, unit, purchaseDate, pricePerCapacity, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [name, brand, price, quantity, capacity, unit, purchaseDateStr, pricePerCapacity, notes]
        );
        insertedCount++;
      } catch (err) {
        console.error(`❌ Error inserting row ${i + 2}:`, err);
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    console.log(`✅ Upload complete: ${insertedCount} inserted, ${errors.length} errors`);

    res.json({
      message: 'Excel file processed',
      inserted: insertedCount,
      total: data.length,
      errors: errors.length > 0 ? errors : undefined,
      debug: process.env.NODE_ENV === 'development' ? { columnNames: getColumnNames(data[0] || {}) } : undefined
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Failed to upload Excel file', details: error.message });
  }
});

module.exports = router;
