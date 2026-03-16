# Railway Deployment Guide for Cost Tracker Backend

## Step 1: Create Railway Account
1. Visit https://railway.app
2. Click "Sign up"
3. Choose "Sign up with GitHub" (recommended)
4. Authorize the Railway app to access your GitHub account

## Step 2: Create New Project
1. Click "Create New Project"
2. Select "Deploy from GitHub repo"
3. Find and select `DiscountDetector` repository
4. Rails will automatically detect and configure the Node.js app

## Step 3: Configure Environment (if needed)
1. In Railway dashboard, go to your project
2. Click the container/service
3. Go to "Variables" tab
4. Add any needed variables (usually not needed - app auto-configures)
5. Click "Deploy"

## Step 4: Get Your Railway URL
1. After deployment completes, go to "Settings" tab
2. Scroll to "Public Networking"
3. Click "Generate URL" (or it may be auto-generated)
4. Copy the URL (e.g., `https://your-app-name.railway.app`)
5. Add `/api` to create your API base URL: `https://your-app-name.railway.app/api`

## Step 5: Update GitHub Actions Workflow
Replace the REACT_APP_API_URL in `.github/workflows/deploy.yml` with your Railway URL:
```yaml
REACT_APP_API_URL: https://your-app-name.railway.app/api
```

## Step 6: Test the Deployment
1. Visit your Railway URL with `/api/health` appended
2. Example: `https://your-app-name.railway.app/api/health`
3. You should see: `{"status":"OK","message":"Cost Tracker API is running"}`

## Database Notes
- SQLite database is stored in the container at `backend/data/costtracker.db`
- Data persists across deployments as long as the container is redeployed, not deleted
- To reset data: Delete the Railway service and redeploy (database reinitializes empty)

## Troubleshooting
If deployment fails:
1. Check the "Deployments" tab in Railway for error logs
2. Ensure package.json has a "start" script (it does ✓)
3. Check that the Procfile points to the correct entry point (if using one)
4. Verify Node.js version is compatible (current: 18.x)

## Pricing
- Railway free tier includes: $5/month credit
- Cost tracker backend typically uses <$1/month
- No credit card required to start

## Auto-Redeploy
Railway automatically redeploys when you push to your main branch!
Set this up in Railway dashboard under "Deployments" > GitHub configuration.
