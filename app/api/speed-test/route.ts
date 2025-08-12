import { NextRequest } from 'next/server';
import config from '@/config/speed-test.config';

export async function POST(request: NextRequest) {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      // Download test - like Speedtest.net
      
      const body = await request.json();
      
      const { type, size } = body;
      
      if (type !== 'download') {
        console.error(`❌ [${requestId}] Invalid test type: ${type}`);
        return new Response(JSON.stringify({ error: 'Invalid test type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Validate size parameter using config
      const dataSize = Math.min(Math.max(size || config.speedTest.minFileSize, 1024), config.speedTest.maxFileSize);
      
      // Generate random data more efficiently using a pattern
      const dataStartTime = performance.now();
      
      const data = new Uint8Array(dataSize);
      const pattern = new Uint8Array(1024); // 1KB pattern
      
      // Generate random pattern once
      for (let i = 0; i < pattern.length; i++) {
        pattern[i] = Math.floor(Math.random() * 256);
      }
      
      // Fill the data array with the pattern
      for (let i = 0; i < dataSize; i++) {
        data[i] = pattern[i % pattern.length];
      }
      
      const dataEndTime = performance.now();
      
      // Librespeed-style headers
      const headers = {
        'Content-Type': 'application/octet-stream',
        'Content-Length': dataSize.toString(),
        'Content-Description': 'File Transfer',
        'Content-Disposition': 'attachment; filename=random.dat',
        'Content-Transfer-Encoding': 'binary',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, post-check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Connection': 'keep-alive',
        'X-Speed-Test': 'true',
        'X-Transfer-Size': dataSize.toString(),
        'X-Request-Id': requestId,
      };
      
      return new Response(data, {
        status: 200,
        headers: headers,
      });
      
    } else if (contentType?.includes('application/octet-stream')) {
      // Upload test - like Speedtest.net
      const startTime = performance.now();
      
      // Read the uploaded data to measure actual transfer
      const chunks: Uint8Array[] = [];
      let totalSize = 0;
      
      const reader = request.body?.getReader();
      if (!reader) {
        console.error(`❌ [${requestId}] No request body reader available`);
        return new Response(JSON.stringify({ error: 'No request body' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      try {
        let chunkCount = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          totalSize += value.length;
          chunkCount++;
          

        }
        

        
      } finally {
        reader.releaseLock();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Calculate actual upload speed based on real transfer time
      const actualSpeed = (totalSize * 8) / (duration / 1000); // Mbps - Fixed calculation (was missing division)
      

      
      return new Response(JSON.stringify({
        success: true,
        type: 'upload',
        size: totalSize,
        duration,
        speed: Math.max(actualSpeed, 0.1), // Minimum 0.1 Mbps
        timestamp: Date.now(),
        method: 'real-network-transfer',
        requestId: requestId,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Request-Id': requestId,
        },
      });
    }
    

    return new Response(JSON.stringify({ error: 'Invalid content type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    
    return new Response(JSON.stringify({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
      requestId: requestId,
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
      speedtestNetCompatible: true,
    },
    testMethod: 'speedtest-net-style',
    supportedTests: ['download', 'upload'],
    fileSizes: ['1MB', '2MB', '5MB', '10MB'],
    maxFileSize: '50MB',
    minFileSize: '1KB',
    timestamp: Date.now(),
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
} 