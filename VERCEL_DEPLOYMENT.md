# 🚀 Vercel Deployment Guide for GlobalSpeedTrack

## Prerequisites
- GitHub account
- Vercel account (free)
- Domain name: globalspeedtrack.com

## Step 1: Prepare Your Project

### 1.1 Update Environment Variables
Copy `env.example` to `.env.local` and update with your values:
```bash
cp env.example .env.local
```

### 1.2 Update Google Verification Code
In `app/layout.tsx`, replace `'your-google-verification-code'` with your actual Google Search Console verification code.

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: GlobalSpeedTrack v2.0.0"
```

### 2.2 Create GitHub Repository
1. Go to GitHub.com
2. Create new repository: `globalspeedtrack`
3. Push your code:
```bash
git remote add origin https://github.com/yourusername/globalspeedtrack.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `globalspeedtrack` repository

### 3.2 Configure Project Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install --legacy-peer-deps` (important!)

### 3.3 Environment Variables
Add these environment variables in Vercel dashboard:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=GlobalSpeedTrack
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_APP_URL=https://globalspeedtrack.com
NEXT_PUBLIC_APP_DESCRIPTION=Professional Internet Speed Test - Test your download, upload speeds, ping, and network quality with real-time analytics.

# Speed Test Configuration
NEXT_PUBLIC_SPEED_TEST_SIZES=0.5,1,2,5
NEXT_PUBLIC_MIN_PING=1
NEXT_PUBLIC_MIN_JITTER=1
NEXT_PUBLIC_HISTORY_LIMIT=50
NEXT_PUBLIC_OVERHEAD_COMPENSATION=1.0
NEXT_PUBLIC_GRACE_TIME_DOWNLOAD=0.5
NEXT_PUBLIC_GRACE_TIME_UPLOAD=0.5

# File Size Limits
SPEED_TEST_MAX_FILE_SIZE=52428800
SPEED_TEST_MIN_FILE_SIZE=1048576

# Network Quality Configuration
NETWORK_QUALITY_PING_SERVERS=https://www.google.com,https://www.cloudflare.com,https://www.amazon.com,https://www.microsoft.com
NETWORK_QUALITY_PING_TIMEOUT=5000
NETWORK_QUALITY_JITTER_MEASUREMENTS=15

# SEO Configuration
NEXT_PUBLIC_SITE_TITLE=GlobalSpeedTrack - Professional Internet Speed Test
NEXT_PUBLIC_SITE_DESCRIPTION=Test your internet speed with our professional speed test tool. Get accurate download, upload speeds, ping, and network quality analysis. Free, fast, and reliable.
NEXT_PUBLIC_SITE_KEYWORDS=internet speed test, speed test, download speed, upload speed, ping test, network quality, broadband test, wifi speed test, mobile speed test, internet performance
NEXT_PUBLIC_SITE_AUTHOR=GlobalSpeedTrack
NEXT_PUBLIC_SITE_LANGUAGE=en
NEXT_PUBLIC_SITE_LOCALE=en_US

# Social Media
NEXT_PUBLIC_TWITTER_HANDLE=@globalspeedtrack
NEXT_PUBLIC_FACEBOOK_PAGE=globalspeedtrack

# Performance Configuration
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_CACHE_DURATION=3600

# Security Headers
NEXT_PUBLIC_CSP_NONCE=
NEXT_PUBLIC_HSTS_MAX_AGE=31536000

# API Configuration
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_MAX_RETRIES=3
```

### 3.4 Deploy
Click "Deploy" and wait for the build to complete.

## Step 4: Configure Custom Domain

### 4.1 Add Domain in Vercel
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add `globalspeedtrack.com`
4. Follow Vercel's DNS configuration instructions

### 4.2 Configure DNS Records
Add these records to your domain provider:

```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Step 5: SEO Optimization

### 5.1 Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property: `https://globalspeedtrack.com`
3. Verify ownership (use the meta tag from layout.tsx)
4. Submit your sitemap: `https://globalspeedtrack.com/sitemap.xml`

### 5.2 Google Analytics (Optional)
1. Create Google Analytics 4 property
2. Add tracking ID to environment variables:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 5.3 Social Media Setup
1. Create Twitter account: @globalspeedtrack
2. Create Facebook page: globalspeedtrack
3. Update social media links in the app

## Step 6: Performance Optimization

### 6.1 Enable Vercel Analytics
1. Go to project dashboard
2. Click "Analytics" tab
3. Enable Web Analytics

### 6.2 Configure Caching
Vercel automatically handles caching, but you can optimize:
- Static assets are cached for 1 year
- API routes are cached based on your configuration
- Images are optimized automatically

## Step 7: Monitoring & Maintenance

### 7.1 Set Up Monitoring
- Enable Vercel Analytics
- Set up error tracking (optional)
- Monitor Core Web Vitals

### 7.2 Regular Updates
- Keep dependencies updated
- Monitor performance metrics
- Update content regularly

## Troubleshooting

### Common Issues:
1. **Dependency Conflicts**: If you see ERESOLVE errors, ensure you're using `npm install --legacy-peer-deps`
2. **Build Failures**: Check environment variables and dependency versions
3. **Domain Issues**: Verify DNS configuration
4. **Performance**: Monitor Core Web Vitals
5. **SEO**: Check Google Search Console for issues

### Support:
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- GitHub Issues: Create issues in your repository

## Post-Deployment Checklist

- [ ] Domain is working: https://globalspeedtrack.com
- [ ] HTTPS is enabled
- [ ] Sitemap is accessible: /sitemap.xml
- [ ] Robots.txt is working: /robots.txt
- [ ] Google Search Console is verified
- [ ] Social media links are working
- [ ] Speed test functionality is working
- [ ] Mobile responsiveness is good
- [ ] Core Web Vitals are passing
- [ ] Analytics are tracking (if enabled)

## Performance Tips

1. **Optimize Images**: Use Next.js Image component
2. **Code Splitting**: Next.js handles this automatically
3. **Caching**: Leverage Vercel's edge caching
4. **CDN**: Vercel provides global CDN automatically
5. **Monitoring**: Use Vercel Analytics to track performance

Your GlobalSpeedTrack application is now ready for production! 🎉
