import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { type, size } = await request.json();
    
    const startTime = performance.now();
    
    if (type === 'download') {
      // Simulate download by creating a blob of specified size
      const dataSize = size || 1024 * 1024; // Default 1MB
      const testData = new Uint8Array(dataSize);
      
      // Simulate network transfer time based on size
      const transferTime = (dataSize / (1024 * 1024)) * 100; // 100ms per MB
      await new Promise(resolve => setTimeout(resolve, transferTime));
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      return new Response(JSON.stringify({
        success: true,
        type: 'download',
        size: dataSize,
        duration,
        speed: (dataSize * 8) / (duration * 1000000), // Mbps
        timestamp: Date.now()
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }
    
    if (type === 'upload') {
      // Simulate upload processing
      const dataSize = size || 1024 * 1024; // Default 1MB
      
      // Simulate upload processing time (typically slower than download)
      const processingTime = (dataSize / (1024 * 1024)) * 200; // 200ms per MB
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      return new Response(JSON.stringify({
        success: true,
        type: 'upload',
        size: dataSize,
        duration,
        speed: (dataSize * 8) / (duration * 1000000), // Mbps
        timestamp: Date.now()
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
    return new Response(JSON.stringify({ error: 'Test failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({
    status: 'ready',
    server: 'SpeedCheck Pro',
    location: 'Global Network',
    uptime: process.uptime(),
    version: '1.0.0'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
} 