import { NextRequest } from 'next/server';

// External speed test servers (similar to Speedtest.net approach)
const SPEED_TEST_SERVERS = [
  'https://httpbin.org/bytes/',
  'https://postman-echo.com/bytes/',
  'https://httpbin.org/delay/',
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const size = parseInt(searchParams.get('size') || '1048576'); // Default 1MB
    
    // Use external server for real internet speed measurement
    const server = SPEED_TEST_SERVERS[0]; // Use httpbin for download test
    const testUrl = `${server}${size}`;
    
    const startTime = performance.now();
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.arrayBuffer();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Calculate real download speed
    const downloadSpeed = (data.byteLength * 8) / (duration / 1000); // Mbps
    
    return new Response(JSON.stringify({
      success: true,
      type: 'download',
      size: data.byteLength,
      duration,
      speed: Math.max(downloadSpeed, 0.1),
      server: testUrl,
      timestamp: Date.now(),
      method: 'external-server',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('External speed test error:', error);
    return new Response(JSON.stringify({ 
      error: 'External speed test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (!contentType.includes('application/octet-stream')) {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Use external server for upload test
    const server = 'https://httpbin.org/post';
    
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
        
        // Limit upload size to 5MB
        if (totalSize > 5242880) {
          return new Response(JSON.stringify({ error: 'File too large' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    } finally {
      reader.releaseLock();
    }
    
    // Combine chunks into single buffer
    const data = new Uint8Array(totalSize);
    let offset = 0;
    for (const chunk of chunks) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    
    // Upload to external server
    const uploadResponse = await fetch(server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': totalSize.toString(),
      },
      body: data,
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: HTTP ${uploadResponse.status}`);
    }
    
    // Calculate real upload speed
    const uploadSpeed = (totalSize * 8) / (duration / 1000); // Mbps
    
    return new Response(JSON.stringify({
      success: true,
      type: 'upload',
      size: totalSize,
      duration,
      speed: Math.max(uploadSpeed, 0.1),
      server: server,
      timestamp: Date.now(),
      method: 'external-server',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('External upload test error:', error);
    return new Response(JSON.stringify({ 
      error: 'External upload test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
