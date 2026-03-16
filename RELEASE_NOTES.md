# New Features & Improvements

## ✨ What's New

### 1. **Price Comparison (New Main Feature)**
- Search for any product by name
- See all historical purchases of that product
- Compare prices across different purchases
- Auto-detect unit from your data
- See potential savings percentage

### 2. **Improved Excel Import**
- Now has a small button (bottom-right corner)
- Opens in a modal dialog instead of taking up space
- Better error handling for different column names
- Flexible column name recognition (handles both English and Dutch names)

### 3. **Removed Statistics**
- Removed the dashboard statistics (they weren't very useful)
- More focus on the main comparison feature

### 4. **Better Unit Support**
- Properly handles different units of measure (L, mL, g, kg, pcs, rolls, etc.)
- Fixed issue where all units were being converted to "pcs"
- Units are now preserved correctly from your Excel data
- Shows info about which unit you're comparing

## 🎯 How to Use the New Features

### Price Comparison (Main Feature)

1. **Search for a product:**
   - Type the product name (e.g., "Milk", "Shampoo")
   - Click "Search"

2. **Enter current store offer (optional):**
   - Brand/Store name
   - Price (€)
   - Quantity
   - Unit of measure

3. **See results:**
   - All previous purchases ranked by price (cheapest first)
   - Your current offer compared to history
   - Potential savings percentage
   - Details: brand, date, size, notes

### Import Excel (Improved)

1. Click the **📥 Import** button (bottom-right)
2. A dialog opens
3. Select your Excel file
4. Click "Import Excel"
5. Done! Your data is added to the database

### View All Products

- Use the "📋 All Products" toggle
- Search and filter all items in your database
- Delete individual products

## 📊 Unit Support

Supports all common units:
- **Volume:** L (liters), mL (milliliters)
- **Weight:** g (grams), kg (kilograms)
- **Pieces:** pcs (pieces), rolls, oz (ounces)
- **Any custom unit:** Just type what you need

## 🛠️ Technical Improvements

- Better column name recognition (case-insensitive)
- Units properly preserved during import
- Unit auto-detection in comparison
- Improved error messages
- Fixed unit matching in calculations
