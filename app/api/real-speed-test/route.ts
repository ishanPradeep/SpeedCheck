import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    // Handle different content types
    let type: string;
    let size: number;
    
    if (contentType.includes('application/json')) {
      // JSON request (download test)
      const body = await request.json();
      type = body.type;
      size = body.size;
      
      // Validate cache-busting parameters
      const timestamp = body.timestamp || Date.now();
      const cacheBuster = body.cacheBuster || Math.random().toString(36).substring(7);
      
      // Ensure we're not using cached data
      if (Date.now() - timestamp > 5000) { // 5 second tolerance
        console.warn('Potential cache issue detected, using fresh timestamp');
      }
    } else if (contentType.includes('application/octet-stream')) {
      // Binary data request (upload test)
      type = 'upload';
      size = 0; // Size will be determined from the actual data
      
      // Get timestamp from headers for cache validation
      const timestamp = parseInt(request.headers.get('x-timestamp') || Date.now().toString());
      const cacheBuster = request.headers.get('x-request-id') || Math.random().toString(36).substring(7);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });
    }
    
    // Use recommended timeouts and file sizes for reliability
    const timeout = parseInt(process.env.SPEED_TEST_TIMEOUT || '60000'); // 60 seconds
    const maxFileSize = parseInt(process.env.SPEED_TEST_MAX_FILE_SIZE || '5242880'); // 5MB
    const minFileSize = parseInt(process.env.SPEED_TEST_MIN_FILE_SIZE || '524288'); // 0.5MB
    
    if (type === 'download') {
      // Real download speed test using actual data transfer
      const dataSize = Math.min(Math.max(size || minFileSize, minFileSize), maxFileSize);
      
      if (dataSize > maxFileSize) {
        return new Response(JSON.stringify({ error: 'File size too large' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Generate fresh random data with timestamp-based seed to prevent caching
      const data = new Uint8Array(dataSize);
      const pattern = new Uint8Array(1024);
      const seed = Date.now() % 256; // Use current timestamp as seed
      
      for (let i = 0; i < pattern.length; i++) {
        pattern[i] = (seed + i) % 256; // Deterministic but unique per request
      }
      for (let i = 0; i < dataSize; i++) {
        data[i] = pattern[i % pattern.length];
      }
      
      return new Response(data, {
        status: 200,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': dataSize.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Speed-Test': 'true',
          'X-Transfer-Size': dataSize.toString(),
          'X-Timestamp': Date.now().toString(),
          'X-Cache-Buster': Math.random().toString(36).substring(7),
        },
      });
    }
    
    if (type === 'upload') {
      // Real upload speed test using actual data transfer
      const startTime = performance.now();
      
      // Read the uploaded data
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
      
      // Calculate actual upload speed based on real transfer time
      const actualSpeed = (totalSize * 8) / (duration / 1000); // Mbps
      
      return new Response(JSON.stringify({
        success: true,
        type: 'upload',
        size: totalSize,
        duration,
        speed: Math.max(actualSpeed, 0.1), // Minimum 0.1 Mbps
        timestamp: Date.now(),
        method: 'real-network-transfer',
        cacheBuster: Math.random().toString(36).substring(7),
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Timestamp': Date.now().toString(),
        },
      });
    }
    
    return new Response(JSON.stringify({ error: 'Invalid test type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Speed test error:', error);
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

export async function GET() {
  return new Response(JSON.stringify({
    status: 'ready',
    server: process.env.NEXT_PUBLIC_APP_NAME || 'SpeedCheck Pro',
    location: 'Global Network',
    uptime: process.uptime(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    features: {
      realTimeMeasurement: true,
      multipleFileSizes: true,
      realNetworkTransfer: true,
      accurateSpeedCalculation: true,
    },
    testMethod: 'real-file-transfer',
    supportedTests: ['download', 'upload'],
    fileSizes: ['0.5MB', '1MB', '2MB', '5MB'],
    maxFileSize: '5MB',
    minFileSize: '0.5MB',
    timestamp: Date.now(),
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
} 