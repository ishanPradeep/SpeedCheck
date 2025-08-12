# SpeedCheck Pro - Deployment Guide

## Overview
This guide provides best practices for deploying SpeedCheck Pro to ensure optimal performance and accurate speed test results.

## Recommended Hosting Platforms

### 1. Vercel (Recommended)
- **Pros**: Built-in Next.js optimization, global CDN, automatic scaling
- **Cons**: Serverless limitations for large file generation
- **Best for**: Production deployments with moderate traffic

#### Setup:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Environment Variables:
```env
NEXT_PUBLIC_APP_NAME=SpeedCheck Pro
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_HISTORY_LIMIT=50
NEXT_PUBLIC_SPEED_TEST_SIZES=1,2,5,10
```

### 2. Railway
- **Pros**: Good performance, easy deployment, reasonable pricing
- **Cons**: Limited global presence
- **Best for**: Development and small to medium production

### 3. DigitalOcean App Platform
- **Pros**: Good performance, predictable pricing, global presence
- **Cons**: More complex setup
- **Best for**: Production deployments with high traffic

### 4. AWS/GCP/Azure
- **Pros**: Maximum control, global infrastructure, auto-scaling
- **Cons**: Complex setup, higher costs
- **Best for**: Enterprise deployments, high traffic

## Performance Optimization

### 1. Server Configuration
```nginx
# Nginx configuration for better performance
server {
    listen 80;
    server_name your-domain.com;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Cache static files
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Speed test API optimization
    location /api/speed-test {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for large file transfers
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

### 2. Environment Variables for Production
```env
# Performance Settings
NEXT_PUBLIC_OVERHEAD_COMPENSATION=1.06
NEXT_PUBLIC_GRACE_TIME_DOWNLOAD=1.5
NEXT_PUBLIC_GRACE_TIME_UPLOAD=3.0

# Network Quality Settings
NETWORK_QUALITY_PING_SERVERS=https://www.google.com,https://www.cloudflare.com,https://www.amazon.com
NETWORK_QUALITY_PING_TIMEOUT=5000
NETWORK_QUALITY_JITTER_MEASUREMENTS=15

# File Size Limits
SPEED_TEST_MAX_FILE_SIZE=52428800
SPEED_TEST_MIN_FILE_SIZE=1048576
```

### 3. CDN Configuration
- Use Cloudflare or similar CDN for global distribution
- Configure edge caching for static assets
- Enable HTTP/2 and HTTP/3 for better performance

## Monitoring and Analytics

### 1. Performance Monitoring
```javascript
// Add to your app for monitoring
export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // Send to your analytics service
  }
}
```

### 2. Error Tracking
- Implement Sentry or similar error tracking
- Monitor API response times
- Track failed speed tests

### 3. Analytics
- Google Analytics 4 for user behavior
- Custom metrics for speed test accuracy
- Server performance monitoring

## Security Considerations

### 1. Rate Limiting
```javascript
// Implement rate limiting for speed test endpoints
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many speed test requests from this IP'
});
```

### 2. CORS Configuration
```javascript
// Configure CORS properly for production
const corsOptions = {
  origin: ['https://your-domain.com', 'https://www.your-domain.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Test-Id'],
  credentials: true
};
```

### 3. Security Headers
```javascript
// Add security headers
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
];
```

## Troubleshooting

### Common Issues:

1. **Slow Speed Test Results**
   - Check server location and CDN configuration
   - Verify network quality settings
   - Monitor server CPU and memory usage

2. **Inaccurate Results**
   - Ensure proper timing precision with `performance.now()`
   - Check for network interference
   - Verify file size calculations

3. **High Latency**
   - Optimize server location
   - Use CDN for global distribution
   - Check network routing

4. **Memory Issues**
   - Monitor memory usage during large file generation
   - Implement proper cleanup
   - Consider using streaming for large files

## Best Practices

### 1. Testing
- Test from multiple locations globally
- Use different network conditions
- Validate results against known benchmarks

### 2. Maintenance
- Regular performance monitoring
- Update dependencies regularly
- Monitor error rates and user feedback

### 3. Scaling
- Implement auto-scaling for high traffic
- Use load balancers for multiple servers
- Monitor resource usage and optimize

## Support

For deployment issues or questions:
1. Check the troubleshooting section
2. Review server logs for errors
3. Monitor performance metrics
4. Contact support with specific error details
