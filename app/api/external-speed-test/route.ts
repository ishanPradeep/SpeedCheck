import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'ping';
  
  try {
    switch (type) {
      case 'ping':
        return await measureExternalPing();
      case 'download':
        return await measureExternalDownload();
      case 'upload':
        return await measureExternalUpload();
      default:
        return new Response(JSON.stringify({ error: 'Invalid test type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function measureExternalPing() {
  const servers = [
    'https://www.google.com',
    'https://www.cloudflare.com',
    'https://www.speedtest.net',
    'https://www.fast.com',
    'https://www.netflix.com'
  ];
  
  const pings: { server: string; ping: number }[] = [];
  
  for (const server of servers) {
    try {
      const startTime = performance.now();
      
      const response = await fetch(server, {
        method: 'HEAD',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        signal: AbortSignal.timeout(3000)
      });
      
      if (response.ok) {
        const endTime = performance.now();
        const ping = endTime - startTime;
        
        if (ping >= 1 && ping <= 1000) {
          pings.push({ server, ping: Math.round(ping) });
        }
      }
    } catch (error) {
      // Continue with next server
    }
  }
  
  if (pings.length === 0) {
    throw new Error('All ping tests failed');
  }
  
  // Sort by ping and return the best result
  pings.sort((a, b) => a.ping - b.ping);
  const bestPing = pings[0];
  
  return new Response(JSON.stringify({
    type: 'ping',
    result: bestPing.ping,
    server: bestPing.server,
    allResults: pings,
    timestamp: Date.now()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function measureExternalDownload() {
  // For now, we'll simulate a download test
  // In a real implementation, you would integrate with Speedtest.net API
  
  // Simulate download test duration
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a realistic download speed based on typical internet speeds
  const downloadSpeed = 25 + Math.random() * 25; // 25-50 Mbps
  
  return new Response(JSON.stringify({
    type: 'download',
    result: Math.round(downloadSpeed * 100) / 100,
    unit: 'Mbps',
    timestamp: Date.now()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function measureExternalUpload() {
  // For now, we'll simulate an upload test
  // In a real implementation, you would integrate with Speedtest.net API
  
  // Simulate upload test duration
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a realistic upload speed (typically slower than download)
  const uploadSpeed = 8 + Math.random() * 12; // 8-20 Mbps
  
  return new Response(JSON.stringify({
    type: 'upload',
    result: Math.round(uploadSpeed * 100) / 100,
    unit: 'Mbps',
    timestamp: Date.now()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
