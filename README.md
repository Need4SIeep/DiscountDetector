# Cost Tracker - Household Item Price Comparison Tool

A full-stack web application for tracking and comparing household item costs. Import your Excel data and access it from anywhere using a mobile-friendly web interface.

## Features

✅ **Excel Import** - Bulk import your household items from Excel  
✅ **Search & Filter** - Find products by name or brand  
✅ **Smart Sorting** - Sort by price, price per unit, purchase date, etc.  
✅ **Price Calculations** - Automatic price per unit and price per mL calculations  
✅ **Statistics Dashboard** - View trends and averages  
✅ **Mobile Friendly** - Fully responsive design for mobile phones  
✅ **Self-Hosted** - Deploy to cloud or run locally  

## Project Structure

```
Online_Costtracking/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── index.js           # Main server
│   │   ├── models/
│   │   │   └── database.js    # SQLite setup
│   │   └── routes/
│   │       ├── productRoutes.js
│   │       └── uploadRoutes.js
│   ├── package.json
│   └── .env
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExcelUpload.js
│   │   │   ├── ProductList.js
│   │   │   └── Stats.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 14+ and npm
- Excel file with your data

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The API will run on `http://localhost:5000`

### Frontend Setup

1. In a new terminal, navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Excel Format

Your Excel file should have these columns:

| Article | Brand | Price | Quantity | Unit | PurchaseDate | Notes |
|---------|-------|-------|----------|------|--------------|-------|
| Shampoo | Dove  | 4.99  | 500      | mL   | 2024-03-01   | Sale  |
| Milk    | AH    | 1.89  | 1        | L    | 2024-03-16   |       |

**Required columns:** Article, Price, Quantity, Unit  
**Optional columns:** Brand, PurchaseDate, Notes

## API Endpoints

### Products
- `GET /api/products` - Get all products (supports search, sort)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/stats/summary` - Get statistics

### Upload
- `POST /api/upload/excel` - Upload Excel file

## Query Parameters

### Search & Sort
```
GET /api/products?search=milk&sortBy=pricePerUnit&order=asc
```

**sortBy options:** name, brand, price, pricePerUnit, purchaseDate, createdAt  
**order:** asc or desc

## Deployment Options

### Option 1: Railway (Recommended for beginners)

1. Push to GitHub
2. Connect on railway.app
3. Set environment variables
4. Deploy

### Option 2: Vercel + Backend Service

**Frontend:** Deploy with Vercel  
**Backend:** Deploy with Railway/Render

### Option 3: Self-Hosted (Local Network)

1. Run both backend and frontend
2. Access via your computer's local IP
3. Share IP on home network

## Database

The application uses **SQLite** for easy storage without external dependencies.

Database file: `backend/data/costtracker.db`

### Schema

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  price REAL,
  quantity REAL,
  unit TEXT,
  purchaseDate TEXT,
  pricePerUnit REAL,
  pricePerML REAL,
  notes TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
)
```

## Configuration

### Backend (.env)
```
PORT=5000
NODE_ENV=development
```

## Troubleshooting

**"Port 5000 already in use"**
- Change PORT in `.env` file

**"CORS errors"**
- Make sure frontend proxy is set correctly in `frontend/package.json`

**"Excel import fails"**
- Verify column names match exactly (case-sensitive in some cases)
- Check that data is in proper format

## Future Enhancements

- User authentication & login
- Multiple price history tracking
- Wishlist/favorite items
- Barcode scanning
- Receipt photo upload
- API integrations with store prices
- Export to PDF/CSV

## License

MIT

## Support

For issues or feature requests, please check the code or modify as needed!
