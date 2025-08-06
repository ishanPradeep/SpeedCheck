# Speed Test Troubleshooting Guide

## 🔍 Issue: Speed Test Results Showing Fallback Values (0.5 Mbps)

### Symptoms
- Download/upload speeds consistently show 0.5 Mbps
- Tests appear to fail but don't show clear error messages
- Network quality indicators are low

### Root Cause Analysis

#### 1. **Network Connectivity Issues**
```bash
# Check if the API endpoint is accessible
curl -X GET http://localhost:3000/api/speed-test

# Expected response:
{
  "status": "ready",
  "server": "SpeedCheck Pro",
  "features": {...}
}
```

#### 2. **API Route Issues**
- Check if `/api/speed-test` route is properly configured
- Verify Next.js API routes are working
- Check server logs for errors

#### 3. **Browser Security Restrictions**
- CORS issues
- Content Security Policy (CSP) blocking requests
- Mixed content issues (HTTP/HTTPS)

#### 4. **Timeout Issues**
- Network requests timing out
- Large file transfers taking too long
- Server processing delays

### 🔧 Debugging Steps

#### Step 1: Use the Debug Page
1. Navigate to `/api-test` in your browser
2. Click "Run Full Test" to see detailed logs
3. Check the console for error messages

#### Step 2: Check Browser Console
```javascript
// Open browser developer tools (F12)
// Look for these error types:
// - Network errors (404, 500, timeout)
// - CORS errors
// - JavaScript errors
```

#### Step 3: Check Server Logs
```bash
# In your terminal where Next.js is running, look for:
# - API request logs
# - Error messages
# - Performance metrics
```

#### Step 4: Test Individual Components
```javascript
// Test API status
fetch('/api/speed-test', { method: 'GET' })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test download with 1MB
fetch('/api/speed-test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'download', size: 1048576 })
})
.then(r => r.arrayBuffer())
.then(data => console.log('Downloaded:', data.byteLength, 'bytes'))
.catch(console.error);
```

### 🛠️ Common Fixes

#### Fix 1: Network Issues
```typescript
// Add retry logic to the speed test
const measureDownloadSpeed = async (onProgress: (progress: number) => void): Promise<number> => {
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // ... existing code ...
      return speed;
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};
```

#### Fix 2: Timeout Issues
```typescript
// Increase timeout for slower connections
const response = await fetch('/api/speed-test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
  body: JSON.stringify({
    type: 'download',
    size: sizeInBytes
  }),
  signal: AbortSignal.timeout(60000) // Increase to 60 seconds
});
```

#### Fix 3: CORS Issues
```typescript
// In next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};
```

#### Fix 4: Memory Issues
```typescript
// Reduce test file sizes for slower connections
const testSizes = [0.5, 1, 2, 5]; // Smaller sizes
// Instead of [1, 2, 5, 10]
```

### 📊 Performance Monitoring

#### Add Performance Metrics
```typescript
// Track these metrics:
interface PerformanceMetrics {
  requestTime: number;
  dataGenerationTime: number;
  transferTime: number;
  totalTime: number;
  memoryUsage: number;
  networkLatency: number;
}
```

#### Monitor Network Quality
```typescript
// Check network conditions before testing
const checkNetworkConditions = async () => {
  const start = performance.now();
  await fetch('/api/ping');
  const latency = performance.now() - start;
  
  if (latency > 1000) {
    console.warn('High latency detected:', latency, 'ms');
    return false;
  }
  return true;
};
```

### 🚨 Emergency Fixes

#### Quick Fix 1: Disable Fallback
```typescript
// Remove the fallback minimum speed
return avgSpeed; // Instead of Math.max(avgSpeed, 0.5)
```

#### Quick Fix 2: Use Smaller Test Files
```typescript
const testSizes = [0.1, 0.5, 1, 2]; // Much smaller sizes
```

#### Quick Fix 3: Increase Timeouts
```typescript
signal: AbortSignal.timeout(120000) // 2 minutes
```

### 📝 Logging Best Practices

#### Enhanced Logging
```typescript
console.log('🚀 Speed test started:', {
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  connection: (navigator as any).connection?.effectiveType || 'unknown',
  memory: (performance as any).memory?.usedJSHeapSize || 'unknown'
});
```

#### Error Tracking
```typescript
// Track specific error types
if (error.name === 'AbortError') {
  console.error('⏰ Request timeout');
} else if (error.name === 'TypeError') {
  console.error('🌐 Network error');
} else if (error.message.includes('Failed to fetch')) {
  console.error('🔌 Connection failed');
}
```

### 🔍 Diagnostic Commands

#### Check API Health
```bash
# Test API endpoint
curl -X GET http://localhost:3000/api/speed-test

# Test download endpoint
curl -X POST http://localhost:3000/api/speed-test \
  -H "Content-Type: application/json" \
  -d '{"type":"download","size":1048576}' \
  --output test-file.bin

# Check file size
ls -la test-file.bin
```

#### Check Network Performance
```bash
# Test network latency
ping localhost

# Test bandwidth (if available)
# Use tools like speedtest-cli or iperf
```

### 📞 Support Information

When reporting issues, include:
1. Browser and version
2. Operating system
3. Network type (WiFi/Cable/Mobile)
4. Console error messages
5. Network tab information
6. Server logs
7. Steps to reproduce

### 🎯 Expected Behavior

#### Successful Test
```
✅ Download test 1: 1MB in 150.25ms = 53.21 Mbps
✅ Download test 2: 2MB in 280.50ms = 57.05 Mbps
✅ Download test 3: 5MB in 650.75ms = 61.45 Mbps
✅ Download test 4: 10MB in 1200.30ms = 66.67 Mbps
📊 Average download speed: 59.60 Mbps
```

#### Failed Test (What to Look For)
```
❌ Download test 1 failed: TypeError: Failed to fetch
❌ Download test 2 failed: AbortError: The operation was aborted
❌ Download test 3 failed: Response not OK: 500 Internal Server Error
⚠️ Using fallback minimum speed (0.5 Mbps) - actual average was 0.00 Mbps
```

This guide should help you identify and fix the speed test issues. Start with the debug page and work through the steps systematically. 