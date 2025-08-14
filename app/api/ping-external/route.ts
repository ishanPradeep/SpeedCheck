import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const server = searchParams.get('server') || 'https://www.google.com';
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(server, {
        method: 'HEAD',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        signal: AbortSignal.timeout(3000)
      });
      
      const endTime = performance.now();
      const ping = endTime - startTime;
      
      if (response.ok && ping >= 1 && ping <= 1000) {
        return new Response(JSON.stringify({
          success: true,
          server,
          ping: Math.round(ping),
          status: response.status,
          timestamp: Date.now()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({
          success: false,
          server,
          error: 'Invalid response or ping value',
          status: response.status,
          ping: ping,
          timestamp: Date.now()
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
      const endTime = performance.now();
      const ping = endTime - startTime;
      
      return new Response(JSON.stringify({
        success: false,
        server,
        error: error instanceof Error ? error.message : 'Request failed',
        ping: ping,
        timestamp: Date.now()
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid request',
      timestamp: Date.now()
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { servers = [], timestamp = Date.now(), cacheBuster = Math.random().toString(36).substring(7) } = body;
    
    // Validate cache-busting parameters
    if (Date.now() - timestamp > 5000) { // 5 second tolerance
      console.warn('Potential cache issue detected in ping API, using fresh timestamp');
    }
    
    const results = [];
    
    for (const server of servers) {
      const startTime = performance.now();
      
      try {
        const response = await fetch(server, {
          method: 'HEAD',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          signal: AbortSignal.timeout(3000)
        });
        
        const endTime = performance.now();
        const ping = endTime - startTime;
        
        if (response.ok && ping >= 1 && ping <= 1000) {
          results.push({
            server,
            ping: Math.round(ping),
            status: response.status,
            success: true
          });
        } else {
          results.push({
            server,
            ping: ping,
            status: response.status,
            success: false,
            error: 'Invalid response or ping value'
          });
        }
      } catch (error) {
        const endTime = performance.now();
        const ping = endTime - startTime;
        
        results.push({
          server,
          ping: ping,
          success: false,
          error: error instanceof Error ? error.message : 'Request failed'
        });
      }
    }
    
    // Find the best ping result
    const successfulResults = results.filter(r => r.success);
    const bestResult = successfulResults.length > 0 
      ? successfulResults.reduce((best, current) => current.ping < best.ping ? current : best)
      : null;
    
    return new Response(JSON.stringify({
      success: true,
      results,
      bestPing: bestResult ? bestResult.ping : null,
      bestServer: bestResult ? bestResult.server : null,
      timestamp: Date.now(),
      cacheBuster: Math.random().toString(36).substring(7)
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
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid request body',
      timestamp: Date.now()
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
