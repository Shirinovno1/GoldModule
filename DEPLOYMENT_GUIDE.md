# Deployment Guide - Netlify Frontend + Separate Backend

## Overview
- **Frontend**: Deploy to Netlify (static React app)
- **Backend**: Deploy separately (Railway, Render, DigitalOcean, etc.)

---

## Step 1: Deploy Backend First

### Option A: Railway.app (Recommended - Free tier)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo → Choose `backend` folder
5. Add environment variables:
   ```
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-jwt-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   BUSINESS_NAME=ShirinovGold
   PRIMARY_COLOR=#D4AF37
   ACCENT_COLOR=#B48F40
   PHONE_NUMBER=+994...
   WHATSAPP_NUMBER=+994...
   PORT=5001
   CORS_ORIGIN=https://your-netlify-site.netlify.app
   ```
6. Railway will auto-deploy and give you a URL like: `https://your-app.railway.app`

### Option B: Render.com (Free tier)
1. Go to https://render.com
2. New → Web Service → Connect GitHub repo
3. Root Directory: `backend`
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add same environment variables as above

---

## Step 2: Get MongoDB Atlas (Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Create database user
4. Whitelist all IPs: `0.0.0.0/0`
5. Get connection string → Use in `MONGODB_URI`

---

## Step 3: Update Netlify Config
Edit `netlify.toml` and replace `your-backend-url.com` with your Railway/Render URL:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-app.railway.app/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/uploads/*"
  to = "https://your-app.railway.app/uploads/:splat"
  status = 200
  force = true
```

---

## Step 4: Deploy Frontend to Netlify

### Via Netlify UI (Easiest)
1. Go to https://app.netlify.com
2. "Add new site" → "Import an existing project"
3. Connect to GitHub → Select your repo
4. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Click "Deploy site"

### Via Netlify CLI
```bash
npm install -g netlify-cli
cd frontend
npm run build
netlify deploy --prod
```

---

## Step 5: Update Backend CORS
After Netlify gives you a URL (e.g., `https://shirinov-gold.netlify.app`):
1. Update backend environment variable:
   ```
   CORS_ORIGIN=https://shirinov-gold.netlify.app
   ```
2. Redeploy backend

---

## Step 6: Test Everything
1. Visit your Netlify site
2. Try browsing products
3. Login to admin: `https://your-site.netlify.app/admin`
4. Upload images
5. Check analytics

---

## Troubleshooting

### Images not loading
- Check `netlify.toml` redirects point to correct backend URL
- Verify backend `/uploads` folder is accessible

### API errors
- Check backend CORS_ORIGIN matches Netlify URL exactly
- Verify all backend env vars are set

### Upload fails
- Ensure backend has write permissions
- Check backend logs for errors

---

## Environment Variables Checklist

### Backend (Railway/Render)
- ✅ MONGODB_URI
- ✅ JWT_SECRET
- ✅ JWT_REFRESH_SECRET
- ✅ BUSINESS_NAME
- ✅ PRIMARY_COLOR
- ✅ ACCENT_COLOR
- ✅ PHONE_NUMBER
- ✅ WHATSAPP_NUMBER
- ✅ CORS_ORIGIN (Netlify URL)
- ✅ PORT=5001

### Frontend (Netlify)
- No env vars needed (API URL handled by redirects)

---

## Cost Estimate
- **Netlify**: Free (100GB bandwidth/month)
- **Railway/Render**: Free tier (500 hours/month)
- **MongoDB Atlas**: Free (512MB storage)
- **Total**: $0/month for small traffic

---

## Custom Domain (Optional)
1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Netlify: Domain settings → Add custom domain
3. Update DNS records as instructed
4. Update backend CORS_ORIGIN to your domain
