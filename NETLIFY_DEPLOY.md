# Netlify Deployment Guide

## Prerequisites

- GitHub repository with your code pushed
- Netlify account

## Step 1: Connect GitHub Repository

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Click "New site from Git"
4. Choose "GitHub" and authorize
5. Select your `bizconnect` repository

## Step 2: Configure Build Settings

**Build command**: `npm run build`

**Publish directory**: `.next`

**Functions directory**: (leave empty)

**Environment variables**:
```
NEXT_PUBLIC_SUPABASE_URL=https://klvbjndadtvstjcmarhc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsdmJqbmRhZHR2c3RqY21hcmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3Njc5OTksImV4cCI6MjA4NDM0Mzk5OX0.2K4XNHefvJIMbdGOflj6nkGsMM9xCtyJBLyEdJ4CDbU
NEXT_PUBLIC_ADMIN_EMAIL=pauladamu600@gmail.com
```

## Step 3: Deploy

1. Click "Deploy site"
2. Wait for build to complete
3. Your site is live! 🎉

## Step 4: Custom Domain (Optional)

1. In Netlify, go to **Domain settings**
2. Click "Add custom domain"
3. Enter your domain (e.g., `bizconnect.com`)
4. Update DNS records at your registrar

## Continuous Deployment

Every time you push to main branch:
- Netlify automatically rebuilds
- New version deployed instantly
- No manual action needed!

## Troubleshooting

**Build fails**: Check build logs in Netlify dashboard. Usually missing environment variables.

**Database not connecting**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Netlify settings.

**CORS errors**: Make sure Supabase storage bucket allows requests from your Netlify domain.

---

That's it! Your BizConnect app is now live on Netlify! 🚀
