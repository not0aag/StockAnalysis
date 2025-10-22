# Stock Portfolio Tracker - Vercel Deployment Guide

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A PostgreSQL database (you can use Vercel Postgres, Supabase, or any other provider)
3. Git repository connected to Vercel

## Deployment Steps

### 1. Database Setup

Set up a PostgreSQL database with your preferred provider:

- **Vercel Postgres**: Create in your Vercel dashboard
- **Supabase**: Free tier available at https://supabase.com
- **Railway**: https://railway.app
- **ElephantSQL**: https://www.elephantsql.com

### 2. Environment Variables

In your Vercel project settings, add these environment variables:

**Backend Variables:**

- `NODE_ENV` = `production`
- `DB_HOST` = Your database host
- `DB_PORT` = `5432`
- `DB_NAME` = Your database name
- `DB_USER` = Your database user
- `DB_PASSWORD` = Your database password
- `JWT_SECRET` = A secure random string
- `FRONTEND_URL` = Your Vercel frontend URL

**Frontend Variables:**

- `REACT_APP_API_URL` = `https://your-app.vercel.app/api`

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect the configuration
4. Add environment variables
5. Click "Deploy"

### 4. Post-Deployment

After deployment:

1. Update `REACT_APP_API_URL` in frontend environment variables to point to your Vercel URL
2. Update `FRONTEND_URL` in backend environment variables
3. Redeploy if needed

## Project Structure for Vercel

```
stock-portfolio-tracker/
├── vercel.json           # Vercel configuration
├── api/
│   └── index.js          # Serverless function entry
├── backend/
│   └── server.js         # Express app
└── frontend/
    └── build/            # React build output
```

## Important Notes

- The backend runs as a serverless function
- Cold starts may occur on first request
- Database connections should use connection pooling
- All API routes should be prefixed with `/api`

## Troubleshooting

- Check Vercel deployment logs for errors
- Ensure all environment variables are set correctly
- Verify database connectivity
- Check CORS settings if frontend can't reach backend
