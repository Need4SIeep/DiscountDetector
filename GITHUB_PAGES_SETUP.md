# GitHub Pages Deployment Guide

GitHub Pages can host your **frontend** (React build) for free, but it's **static hosting only** - it cannot run your Node.js backend.

## Setup Overview

✅ **What works on GitHub Pages:**
- React frontend (compiled to static files)
- Auto-deploys on every `git push`
- Free custom domain support
- HTTPS included

❌ **What doesn't work on GitHub Pages:**
- Node.js backend (requires a server)
- Database operations (needs external storage)
- File uploads/processing

## Two-Step Solution

### Step 1: Frontend on GitHub Pages ✅ (Within GitHub)

The repository already includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
1. Automatically builds your React app when you push to `main`
2. Deploys it to GitHub Pages
3. Makes it available at: `https://need4sleep.github.io/DiscountDetector/`

**To enable GitHub Pages:**

1. Go to **GitHub repo Settings → Pages**
2. Under "Build and deployment":
   - Source: Select **GitHub Actions**
   - The workflow will run automatically on next push

3. The site will be live at: `https://need4sleep.github.io/DiscountDetector/`

### Step 2: Backend Hosting ⚠️ (Cannot be within GitHub)

The backend Node.js server **must** run somewhere. Your options:

**Option A: Free Tier Services (No Additional Account if using same email)**
- Railway.app (very easy, similar structure to this repo)
- Render.com 
- Replit.com (with auto-deployment from GitHub)

**Option B: Keep Running Locally**
- Keep backend on your own machine
- Frontend on GitHub Pages talks to backend via API
- Only works while your laptop is on and connected

**Option C: Use Services You Already Have**
- AWS (if you have an account)
- Google Cloud (free tier)
- Microsoft Azure (free tier)

## Configuration

The frontend is pre-configured to connect to an API backend. Update the backend URL:

**File: `frontend/.env`**
```
REACT_APP_API_URL=http://localhost:5000
```

Change to your backend URL:
- Local: `http://localhost:5000`
- Remote: `https://your-backend-url.com`

## How It Works

```
User Phone
    ↓
Browser: https://need4sleep.github.io/DiscountDetector/ (GitHub Pages)
    ↓
React App (static files)
    ↓
API Call: https://your-backend-api.com/api/products
    ↓
Backend Server (Node.js) - Must be hosted elsewhere
    ↓
SQLite Database
```

## Testing After Setup

1. **Frontend builds and deploys:**
   - Go to GitHub Actions tab in your repo
   - Check that the `Build and Deploy to GitHub Pages` workflow completed
   - Visit: `https://need4sleep.github.io/DiscountDetector/`

2. **Frontend connects to backend:**
   - Update `REACT_APP_API_URL` in `frontend/.env`
   - Test search and import features
   - Data saves to backend database

## Recommended: Use Railway for Backend

Since you wanted to stay "within GitHub," the closest option is **Railway**:
- Connects directly to your GitHub repo
- Auto-deploys when you push
- Free tier includes backend hosting
- No additional login needed (sign in with GitHub)

**To deploy backend to Railway:**
1. Go to railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your DiscountDetector repo
4. Railway auto-detects it's a Node.js project
5. Configure environment variables
6. Get your backend URL
7. Update `REACT_APP_API_URL` in frontend `.env`

This way:
- ✅ Frontend: GitHub Pages (within GitHub)
- ✅ Backend: Railway (one-click from GitHub)
- ✅ Database: Included with Railway
- ✅ All git-based (push = auto-deploy)

## Summary

**Within GitHub only:** Frontend works perfectly on GitHub Pages
**Backend must go somewhere else:** Railway recommended (easiest GitHub integration)

Would you like me to create a Railway deployment guide to complete the setup?
