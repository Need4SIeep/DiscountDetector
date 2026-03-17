# Data Persistence Guide

## Current Issue
Your application loses all data (users, products) after server restarts because:
- **Locally**: Data should persist in `/backend/data/costtracker.db` ✓
- **On Railway**: File system is ephemeral (temporary) - all data is deleted on restart ✗

## Solutions

### Option 1: Use Railway PostgreSQL (Recommended for Production)
Railway provides managed PostgreSQL that automatically persists across restarts.

**Steps:**
1. Go to your Railway project: https://railway.app/project
2. Click "+ New"  → Select "PostgreSQL"
3. Railway will create a database and set environment variables
4. We can migrate the SQLite schema to PostgreSQL

### Option 2: Use Railway Volumes (Free, Simple)
Mount a persistent volume to Railway so the SQLite database persists.

**Setup Instructions:**
1. In your Railway project settings
2. Add a volume mount: `/app/backend/data` → persistent storage
3. This keeps your SQLite database across restarts

### Option 3: Local Development (Already Works)
Your local SQLite database persists in:
```
backend/data/costtracker.db
```

This file will NOT be in git (it's in `.gitignore`), so each local environment has its own data.

## Testing Persistence

### Check if data persists locally:
```bash
cd backend
node src/index.js
# Wait for startup, then Ctrl+C to stop

node src/index.js
# Should say: "✓ Database file found, loading existing data"
```

### Check locally stored data:
```bash
node setup-admin.js list
# Shows all users - should persist between restarts
```

## Recommended Path Forward

1. **For now (development)**: Use Railway with added volume mount
   - Simple, free, keeps data persistent
   - Can be set up via Railway Dashboard

2. **Later (production)**: Migrate to PostgreSQL
   - More reliable, scalable
   - Better for multi-user production apps
   - We can help migrate the schema

## Questions?

Run this to see the database status at startup:
```bash
cd backend
npm start
# Look for lines showing if database file was found
```

If you want to proceed with either option, let me know and I'll help set it up!
