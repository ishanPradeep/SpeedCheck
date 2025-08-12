import { NextRequest } from 'next/server';

export async function HEAD(request: NextRequest) {
  // Minimal response for ping measurement - return immediately
  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Server-Location': 'Global Network',
      'X-Server-Provider': process.env.NEXT_PUBLIC_APP_NAME || 'SpeedCheck Pro',
      'X-Test-Method': 'real-network-ping',
      'X-App-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
    },
  });
}

export async function GET(request: NextRequest) {
  // Minimal response for ping measurement - return immediately
  return new Response(JSON.stringify({ 
    timestamp: Date.now(),
    server: process.env.NEXT_PUBLIC_APP_NAME || 'SpeedCheck Pro',
    location: 'Global Network',
    uptime: process.uptime(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    features: {
      realTimeMeasurement: true,
      realNetworkLatency: true,
      speedtestNetCompatible: true,
    },
    testMethod: 'speedtest-net-style',
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}