# Cost Tracker - Quick Start Guide

## 🚀 Starting the Application

You have a complete full-stack application ready to run. Follow these steps:

### Step 1: Start the Backend Server

**Open PowerShell/Command Prompt and run:**

```powershell
cd "C:\Users\marti\OneDrive\Bureaublad\Personal_Docs\Financials\Online_Costtracking\backend"
npm run dev
```

You should see:
```
Server running on port 5000
Visit http://localhost:5000/api/health to check status
```

**Leave this terminal open!**

---

### Step 2: Start the Frontend Application

**Open a NEW PowerShell/Command Prompt window and run:**

```powershell
cd "C:\Users\marti\OneDrive\Bureaublad\Personal_Docs\Financials\Online_Costtracking\frontend"
npm start
```

Wait a moment... your browser should automatically open to:
```
http://localhost:3000
```

---

## 📋 Using the Application

### Main Feature: Price Comparison

This is now the **primary way** to use Cost Tracker:

1. **Search for a product**
   - Enter product name (e.g., "Milk", "Shampoo")
   - Click "Search"

2. **Enter your current offer (optional)**
   - Brand/Store (e.g., "AH", "Albert Heijn")
   - Price paid (€)
   - Quantity/Size
   - Unit of measure

3. **See comparison results**
   - All your historical purchases ranked by price
   - Cheapest first = best deal
   - See potential savings %
   - Details: brand, purchase date, total price, size

**Example:**
```
Search for: "Milk"
↓
Shows all your milk purchases ranked by €/L
↓
Enter: AH, €1.89, 1, L
↓
Compare to history + see if it's a good deal!
```

### Secondary: View All Products

Not finding what you need? Browse everything:

1. Click "📋 All Products" tab
2. Search by name or brand
3. Sort by price, unit cost, date, etc.
4. Delete items if needed

### Import Excel Data

1. Click **📥 Import** button (bottom-right corner)
2. A dialog pops up
3. Select `.xlsx` Excel file
4. Click "Import Excel"
5. See confirmation of imported items
6. Start comparing!

**Excel Format:** See [EXCEL_TEMPLATE.md](EXCEL_TEMPLATE.md)

---

## 🔍 Common URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Main application (React) |
| `http://localhost:5000/api/health` | API health check |
| `http://localhost:5000/api/products` | All products (JSON) |
| `http://localhost:5000/api/products/stats/summary` | Statistics (JSON) |

---

## 📁 Database Location

Your data is stored in a local SQLite database:
```
backend/data/costtracker.db
```

This file persists between restarts, so your data is safe!

---

## 🛑 Stopping the Application

1. **Backend:** Press `CTRL + C` in the backend terminal
2. **Frontend:** Press `CTRL + C` in the frontend terminal
3. Close the terminals

---

## ⚙️ Troubleshooting

### "Port 5000 already in use"
- Another application is using port 5000
- Edit `backend/.env` and change PORT to 5001
- Restart backend

### "Port 3000 already in use"
- Try using a different port with frontend:
```powershell
SET PORT=3001 && npm start
```

### "Cannot find module 'express'"
- Ensure you ran `npm install` in the backend folder
- Delete `backend/node_modules` folder
- Run `npm install` again

### "CORS error when uploading Excel"
- Make sure the backend is running on port 5000
- Check that frontend proxy is set in `frontend/package.json`

### Excel import shows "No file uploaded"
- Make sure you selected a file
- File must be `.xlsx` or `.xls` format

---

## 📱 Mobile Access

Once running, you can access from another device on your network:

1. Find your computer's IP address:
   - Windows: Run `ipconfig` in PowerShell, look for IPv4 address (e.g., 192.168.1.100)

2. From your phone on same WiFi:
   - Visit: `http://192.168.1.100:3000` (replace IP address)
   - The app is fully mobile-responsive!

---

## 🌐 Next: Deploy to Cloud

When ready to deploy online:

### Option 1: Railway (Easy - ~5 mins)
1. Push code to GitHub
2. Connect at railway.app
3. Deploy both backend and frontend

### Option 2: Vercel + Backend Service
- Frontend on Vercel
- Backend on Railway/Render

### Option 3: Keep running locally
- Run background and access via local network

---

## 📖 Additional Documentation

- [README.md](README.md) - Full project documentation
- [EXCEL_TEMPLATE.md](EXCEL_TEMPLATE.md) - Excel import guidelines

---

**Need help?** Check the code files in the project - everything is heavily commented!

Enjoy tracking those costs! 💰
