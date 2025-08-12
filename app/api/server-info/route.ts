import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get server information
    const serverInfo = {
      timestamp: Date.now(),
      server: {
        hostname: process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'unknown',
        region: process.env.VERCEL_REGION || 'unknown',
        environment: process.env.NODE_ENV || 'unknown',
        platform: process.env.VERCEL ? 'Vercel' : 'Other',
      },
      headers: {
        'x-forwarded-for': request.headers.get('x-forwarded-for'),
        'x-real-ip': request.headers.get('x-real-ip'),
        'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
        'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
        'user-agent': request.headers.get('user-agent'),
      },
      request: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
      }
    };

    return new Response(JSON.stringify(serverInfo, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
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
