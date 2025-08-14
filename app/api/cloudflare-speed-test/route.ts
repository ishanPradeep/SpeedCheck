import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { type, size } = await request.json();
    
    // Cloudflare-optimized settings
    const timeout = 30000; // 30 seconds
    const maxFileSize = 10 * 1024 * 1024; // 10MB max
    const minFileSize = 64 * 1024; // 64KB min
    
    if (type === 'download') {
      // Cloudflare-optimized download test
      const dataSize = Math.min(Math.max(size || minFileSize, minFileSize), maxFileSize);
      
      // Generate optimized test data for Cloudflare
      const data = generateOptimizedTestData(dataSize);
      
      return new Response(data, {
        status: 200,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': dataSize.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Speed-Test': 'cloudflare-optimized',
          'X-Transfer-Size': dataSize.toString(),
          'X-Cloudflare-Pop': request.headers.get('cf-ray') || 'unknown',
          'X-Cloudflare-Country': request.headers.get('cf-ipcountry') || 'unknown',
        },
      });
    }
    
    if (type === 'upload') {
      // Cloudflare-optimized upload test
      const startTime = performance.now();
      
      const chunks: Uint8Array[] = [];
      let totalSize = 0;
      
      const reader = request.body?.getReader();
      if (!reader) {
        return new Response(JSON.stringify({ error: 'No request body' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          totalSize += value.length;
          
          // Check for timeout
          if (performance.now() - startTime > timeout) {
            throw new Error('Upload timeout');
          }
          
          // Check for size limit
          if (totalSize > maxFileSize) {
            return new Response(JSON.stringify({ error: 'File size too large' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
      } finally {
        reader.releaseLock();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Calculate upload speed
      const uploadSpeed = (totalSize * 8) / (duration / 1000); // Mbps
      
      return new Response(JSON.stringify({
        success: true,
        type: 'upload',
        size: totalSize,
        duration,
        speed: Math.max(uploadSpeed, 0.1),
        timestamp: Date.now(),
        method: 'cloudflare-optimized',
        cloudflare: {
          pop: request.headers.get('cf-ray') || 'unknown',
          country: request.headers.get('cf-ipcountry') || 'unknown',
          ip: request.headers.get('cf-connecting-ip') || 'unknown',
        },
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }
    
    return new Response(JSON.stringify({ error: 'Invalid test type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function generateOptimizedTestData(size: number): Uint8Array {
  // Generate data optimized for Cloudflare's compression and caching
  const data = new Uint8Array(size);
  
  // Create a pattern that's compressible but still good for speed testing
  const pattern = new Uint8Array(1024);
  for (let i = 0; i < pattern.length; i++) {
    // Use a mix of random and structured data
    if (i % 4 === 0) {
      pattern[i] = Math.floor(Math.random() * 256);
    } else {
      pattern[i] = (i * 7) % 256; // Structured pattern
    }
  }
  
  // Fill the data array with the pattern
  for (let i = 0; i < size; i++) {
    data[i] = pattern[i % pattern.length];
  }
  
  return data;
}

export async function GET() {
  return new Response(JSON.stringify({
    status: 'ready',
    server: 'Cloudflare Optimized',
    location: 'Global CDN',
    uptime: process.uptime(),
    version: '2.0.0',
    features: {
      cloudflareOptimized: true,
      globalCDN: true,
      realTimeMeasurement: true,
      multipleFileSizes: true,
      accurateSpeedCalculation: true,
    },
    testMethod: 'cloudflare-cdn',
    supportedTests: ['download', 'upload'],
    fileSizes: ['64KB', '256KB', '1MB', '5MB', '10MB'],
    maxFileSize: '10MB',
    minFileSize: '64KB',
    timestamp: Date.now(),
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
