# Testing on Your Phone

This guide explains how to test the Cost Tracker application on your phone from the GitHub repository.

## Quick Start (Local Network Testing)

### 1. Clone the Repository
```bash
git clone https://github.com/Need4SIeep/DiscountDetector.git
cd DiscountDetector
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3. Start the Application

**Terminal 1 - Start Backend (port 5000):**
```bash
cd backend
npm start
```

Expected output:
```
Server running on port 5000
Visit http://localhost:5000/api/health to check status
```

**Terminal 2 - Start Frontend (port 3000):**
```bash
cd frontend
npm start
```

The frontend will automatically open at `http://localhost:3000`

### 4. Access from Your Phone

On your **phone's browser**, navigate to:
```
http://YOUR_COMPUTER_IP:3000
```

**To find your computer's IP address:**

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (usually something like `192.168.x.x`)

**Mac/Linux:**
```bash
ifconfig
```

### Example:
If your IP is `192.168.1.100`, open on your phone:
```
http://192.168.1.100:3000
```

## Features to Test

### 1. Excel Import
- Click the **📤 Upload Excel** button (bottom-right)
- Select the test file or create your own using [EXCEL_TEMPLATE.md](EXCEL_TEMPLATE.md)
- Required columns: Article, Price, Quantity, Capacity, Unit, PurchaseDate

### 2. Price Comparison
- Use the search box to find a product
- Enter your current offer (Price, Quantity, Capacity, Unit)
- See how your deal compares to historical prices
- The app will show if you found a better deal or if you should wait

### 3. Clear All Database
- Click the **🗑️ Clear All** button
- Confirm the deletion (can't be undone!)
- All products will be removed

### 4. View All Products
- Click **📋 All Products** tab
- See all products in the database
- Search and sort by different criteria

## Troubleshooting

### Can't Connect from Phone
- [ ] Check both are on the same WiFi network
- [ ] Check computer IP address with `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- [ ] Check backend is running on port 5000
- [ ] Check frontend is running on port 3000
- [ ] Try `http://` instead of `https://`

### Port Already in Use
If port 3000 or 5000 is in use, change them:

**Backend (edit `backend/src/index.js`):**
```javascript
const PORT = process.env.PORT || 5000;  // Change 5000 to another port
```

**Frontend (edit `frontend/src/index.js`):**
```javascript
PORT=3001 npm start  // Use different port
```

### Database Issues
The SQLite database is stored at `backend/data/costtracker.db`

To reset:
```bash
rm backend/data/costtracker.db
# Restart backend - it will create a fresh database
npm start
```

## Testing Data

Use this sample Excel data to test the app:

| Article | Brand | Price | Quantity | Capacity | Unit | PurchaseDate | Notes |
|---------|-------|-------|----------|----------|------|--------------|-------|
| Milk | AH | 1.89 | 1 | 1 | L | 2024-03-16 | Full fat |
| Shampoo | Dove | 4.99 | 1 | 500 | mL | 2024-03-10 | Moisturizing |
| Toilet Paper | Sappo | 12.50 | 8 | 4 | rolls | 2024-03-15 | 8 packs |

## Performance Notes

- **First Load**: May take 10-15 seconds as dependencies install
- **Database**: Uses local SQLite file-based storage (no external DB needed)
- **Mobile**: Fully responsive - works great on phones!
- **Offline**: Works completely offline once loaded (except for new imports)

## Next Steps

- [ ] Test with your own Excel data
- [ ] Try different search queries
- [ ] Test price comparisons with multiple entries
- [ ] Test the import with missing fields
- [ ] Export your local database for backup

For full documentation, see:
- [README.md](README.md) - Project overview
- [EXCEL_TEMPLATE.md](EXCEL_TEMPLATE.md) - How to format Excel data
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical details
