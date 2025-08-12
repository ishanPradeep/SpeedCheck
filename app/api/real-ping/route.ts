import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Minimal response for ping measurement - return immediately
  return new Response(JSON.stringify({
    success: true,
    timestamp: Date.now(),
    method: 'real-ping',
    message: 'Ping test successful'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

export async function POST(request: NextRequest) {
  // Minimal response for ping measurement - return immediately
  return new Response(JSON.stringify({
    success: true,
    timestamp: Date.now(),
    method: 'real-ping',
    message: 'Ping test successful'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
} 