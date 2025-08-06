import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  console.log(`🚀 [${requestId}] Speed test request received`);
  
  try {
    const contentType = request.headers.get('content-type');
    console.log(`📋 [${requestId}] Content-Type: ${contentType}`);
    console.log(`📋 [${requestId}] Headers:`, Object.fromEntries(request.headers.entries()));
    
    if (contentType?.includes('application/json')) {
      // Download test - like Speedtest.net
      console.log(`📥 [${requestId}] Processing download test request`);
      
      const body = await request.json();
      console.log(`📋 [${requestId}] Request body:`, body);
      
      const { type, size } = body;
      
      if (type !== 'download') {
        console.error(`❌ [${requestId}] Invalid test type: ${type}`);
        return new Response(JSON.stringify({ error: 'Invalid test type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Validate size parameter
      const dataSize = Math.min(Math.max(size || 1048576, 1024), 50 * 1024 * 1024); // 1KB to 50MB
      console.log(`📏 [${requestId}] Requested size: ${size} bytes`);
      console.log(`📏 [${requestId}] Validated size: ${dataSize} bytes (${(dataSize / 1024 / 1024).toFixed(2)} MB)`);
      
      // Generate random data more efficiently using a pattern
      console.log(`🔄 [${requestId}] Generating test data...`);
      const dataStartTime = performance.now();
      
      const data = new Uint8Array(dataSize);
      const pattern = new Uint8Array(1024); // 1KB pattern
      
      // Generate random pattern once
      for (let i = 0; i < pattern.length; i++) {
        pattern[i] = Math.floor(Math.random() * 256);
      }
      
      // Fill the data array with the pattern (much faster than random generation)
      for (let i = 0; i < dataSize; i++) {
        data[i] = pattern[i % pattern.length];
      }
      
      const dataEndTime = performance.now();
      console.log(`✅ [${requestId}] Data generation completed in ${(dataEndTime - dataStartTime).toFixed(2)}ms`);
      console.log(`📊 [${requestId}] Generated data size: ${data.length} bytes`);
      
      // Return the data immediately - the client will measure the download time
      console.log(`📤 [${requestId}] Sending response...`);
      const responseStartTime = performance.now();
      
      const response = new Response(data, {
        status: 200,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': dataSize.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Speed-Test': 'true',
          'X-Transfer-Size': dataSize.toString(),
          'X-Test-Type': 'download',
          'X-Server-Timestamp': Date.now().toString(),
          'X-Request-Id': requestId,
        },
      });
      
      const responseEndTime = performance.now();
      console.log(`✅ [${requestId}] Response sent in ${(responseEndTime - responseStartTime).toFixed(2)}ms`);
      console.log(`📊 [${requestId}] Response headers:`, Object.fromEntries(response.headers.entries()));
      
      return response;
      
    } else if (contentType?.includes('application/octet-stream')) {
      // Upload test - like Speedtest.net
      console.log(`📤 [${requestId}] Processing upload test request`);
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
        console.log(`📥 [${requestId}] Starting to read upload data...`);
        let chunkCount = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          totalSize += value.length;
          chunkCount++;
          
          if (chunkCount % 10 === 0) {
            console.log(`📊 [${requestId}] Read ${chunkCount} chunks, total size: ${totalSize} bytes`);
          }
        }
        
        console.log(`✅ [${requestId}] Upload data reading completed`);
        console.log(`📊 [${requestId}] Total chunks: ${chunkCount}`);
        console.log(`📊 [${requestId}] Total size: ${totalSize} bytes (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
        
      } finally {
        reader.releaseLock();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Calculate actual upload speed based on real transfer time
      const actualSpeed = (totalSize * 8) / (duration * 1000); // Mbps - Fixed calculation
      
      console.log(`📈 [${requestId}] Upload speed calculation:`);
      console.log(`   - Data size: ${totalSize} bytes`);
      console.log(`   - Duration: ${duration.toFixed(2)}ms`);
      console.log(`   - Speed: ${actualSpeed.toFixed(2)} Mbps`);
      
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
    
    console.error(`❌ [${requestId}] Invalid content type: ${contentType}`);
    return new Response(JSON.stringify({ error: 'Invalid content type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error(`❌ [${requestId}] Speed test error:`, error);
    console.error(`🔍 [${requestId}] Error details:`, {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: Date.now(),
    });
    
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
  console.log('📋 Speed test API status request received');
  
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