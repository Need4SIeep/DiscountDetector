# Deployment Guide - Cost Tracker

Complete guide to deploy your Cost Tracker application to the cloud.

## Option 1: Railway.app (Recommended - Easiest)

Railway is the simplest option for beginners. Hosts both backend and frontend.

### Prerequisites
- GitHub account
- Railway account (free at railway.app)

### Step 1: Prepare Your Project

1. Initialize git (if not done):
```powershell
cd "C:\Users\marti\OneDrive\Bureaublad\Personal_Docs\Financials\Online_Costtracking"
git init
git add .
git commit -m "Initial commit"
```

2. Push to GitHub (create a new repository on github.com first):
```powershell
git remote add origin https://github.com/YOUR_USERNAME/cost-tracker.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend

1. Go to railway.app and log in
2. Click "New Project" → "Deploy from GitHub"
3. Select your `cost-tracker` repository
4. Add a new service:
   - Select root directory
   - Set environment to Node.js
   - Set start command: `cd backend && npm install && npm start`

5. Create a database volume:
   - Add PostgreSQL (optional, or use SQLite file storage)
   - Or keep using SQLite (file persists)

### Step 3: Deploy Frontend

1. In same Railway project, add new service
2. Select same GitHub repo
3. Set environment to Node.js
4. Set start command: `cd frontend && npm install && npm start`
5. Set PORT environment variable to 3000

### Step 4: Connect Frontend to Backend

In Railway dashboard:
1. Go to Frontend service
2. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url/api
   ```
   (Copy the backend URL from Railway)

---

## Option 2: Vercel (Frontend) + Railway (Backend)

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Go to vercel.com and click "Import Project"
3. Select your GitHub repository
4. Set:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-railway-url/api
   ```
6. Deploy!

### Deploy Backend to Railway

Follow "Option 1: Step 2" above, but only deploy the backend service.

---

## Option 3: Self-Hosted on Local Network

Perfect for personal use without deployment costs.

### Keep Running Locally

1. Follow [QUICK_START.md](QUICK_START.md) to start both servers
2. Both run indefinitely on your machine
3. Access from phone on same WiFi:
   ```
   http://192.168.1.100:3000
   ```
   (Replace IP with your computer's IP from `ipconfig`)

### Benefits
- ✓ Free
- ✓ Complete privacy
- ✓ All data stays on your computer
- ✓ Works perfectly for personal use

### Drawbacks
- ✗ Only works on home wifi
- ✗ Requires computer to stay on
- ✗ Can't access from outside home network

---

## Option 4: Docker Deployment

For advanced users: containerize and deploy anywhere.

### Dockerfile (backend)

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
```

### Dockerfile (frontend)

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

### docker-compose.yml

```yaml
version: '3'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      PORT: 5000

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: "http://localhost:5000/api"
    depends_on:
      - backend
```

Run with: `docker-compose up`

---

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host/dbname  # Optional
```

### Frontend (.env)
```
REACT_APP_API_URL=https://api.costtracker.com/api
```

---

## Production Checklist

Before deploying:

- [ ] Test Excel import locally
- [ ] Verify all features work
- [ ] Set environment variables
- [ ] Update API URLs
- [ ] Enable CORS for production domain
- [ ] Set up database backups
- [ ] Enable HTTPS
- [ ] Test on mobile
- [ ] Set appropriate cache headers

---

## Monitoring & Maintenance

### Logs
- Railway: Built-in dashboard
- Vercel: Deployment logs available
- Local: Check terminal output

### Database Backups
- SQLite: Copy `backend/data/costtracker.db` regularly
- PostgreSQL: Use Railway automatic backups

### Updates
- Update npm packages: `npm update`
- Test before deploying
- Keep Node.js version current

---

## Cost Estimate

| Option | Monthly Cost | Setup Time |
|--------|--------------|-----------|
| Railway | Free tier or $5-20 | 10 mins |
| Vercel + Railway | $0-10 | 15 mins |
| Local Network | $0 | 2 mins |
| Docker VPS | $5-20 | 30 mins |

---

## Troubleshooting

### "CORS errors after deployment"
- Add production URL to CORS settings
- Update `REACT_APP_API_URL` in frontend

### "Database not persisting"
- Ensure database volume is mounted
- Check file permissions

### "Build fails on Railway"
- Check Node version compatibility
- Verify package.json scripts
- Check for missing dependencies

---

## Support Resources

- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- Node.js docs: https://nodejs.org/docs
- React docs: https://react.dev

Happy deploying! 🚀
