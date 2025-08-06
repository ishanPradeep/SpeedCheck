import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    // Simple response to measure round-trip time
    const response = {
      success: true,
      timestamp: Date.now(),
      method: 'real-ping',
      message: 'Ping test successful'
    };
    
    const endTime = performance.now();
    const pingTime = endTime - startTime;
    
    return new Response(JSON.stringify({
      ...response,
      ping: Math.round(pingTime),
      duration: pingTime
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Ping-Time': pingTime.toString(),
      },
    });
    
  } catch (error) {
    const endTime = performance.now();
    const pingTime = endTime - startTime;
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Ping test failed',
      ping: Math.round(pingTime),
      duration: pingTime,
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

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  
  try {
    const body = await request.json();
    const { testType = 'ping' } = body;
    
    // Simple response to measure round-trip time
    const response = {
      success: true,
      testType,
      timestamp: Date.now(),
      method: 'real-ping',
      message: `${testType} test successful`
    };
    
    const endTime = performance.now();
    const pingTime = endTime - startTime;
    
    return new Response(JSON.stringify({
      ...response,
      ping: Math.round(pingTime),
      duration: pingTime
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Ping-Time': pingTime.toString(),
      },
    });
    
  } catch (error) {
    const endTime = performance.now();
    const pingTime = endTime - startTime;
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Ping test failed',
      ping: Math.round(pingTime),
      duration: pingTime,
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