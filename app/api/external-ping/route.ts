import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const server = searchParams.get('server') || 'https://www.google.com';
  
  try {
    const startTime = performance.now();
    
    const response = await fetch(server, {
      method: 'HEAD',
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      signal: AbortSignal.timeout(5000)
    });
    
    const endTime = performance.now();
    const pingTime = endTime - startTime;
    
    return new Response(JSON.stringify({
      server,
      ping: Math.round(pingTime),
      status: response.status,
      timestamp: Date.now()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      server,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}
