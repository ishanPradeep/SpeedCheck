import { NextRequest } from 'next/server';

export async function HEAD(request: NextRequest) {
  const startTime = Date.now();
  
  // Simulate some processing time to make ping more realistic
  await new Promise(resolve => setTimeout(resolve, Math.random() * 5 + 2));
  
  const responseTime = Date.now() - startTime;
  
  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Response-Time': responseTime.toString(),
      'X-Server-Location': 'Global Network',
      'X-Server-Provider': 'SpeedCheck Pro',
    },
  });
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, Math.random() * 3 + 1));
  
  const responseTime = Date.now() - startTime;
  
  return new Response(JSON.stringify({ 
    timestamp: Date.now(),
    responseTime,
    server: 'SpeedCheck Pro',
    location: 'Global Network',
    uptime: process.uptime(),
    version: '1.0.0'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Response-Time': responseTime.toString(),
    },
  });
}