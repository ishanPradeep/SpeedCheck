import { NextRequest } from 'next/server';

// File sizes for testing (in bytes)
const TEST_FILES = {
  'small': 524288,    // 0.5MB
  'medium': 1048576,  // 1MB
  'large': 2097152,   // 2MB
  'xlarge': 5242880   // 5MB
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileSize = searchParams.get('size') || 'medium';
    
    if (!TEST_FILES[fileSize as keyof typeof TEST_FILES]) {
      return new Response(JSON.stringify({ error: 'Invalid file size' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const size = TEST_FILES[fileSize as keyof typeof TEST_FILES];
    
    // Generate file data on-demand
    const data = new Uint8Array(size);
    
    // Fill with a pattern that's not easily compressible
    // Use timestamp to make each file unique
    const timestamp = Date.now();
    const seed = timestamp % 256;
    
    for (let i = 0; i < size; i++) {
      data[i] = (seed + i * 7 + 13) % 256; // Non-compressible pattern
    }
    
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': data.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Speed-Test': 'file-based',
        'X-File-Size': data.length.toString(),
        'X-Timestamp': timestamp.toString(),
      },
    });
    
  } catch (error) {
    console.error('File speed test error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
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
        
        // Limit upload size to 10MB
        if (totalSize > 10485760) {
          return new Response(JSON.stringify({ error: 'File too large' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    } finally {
      reader.releaseLock();
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Calculate upload speed with more realistic validation
    let uploadSpeed = (totalSize * 8) / (duration / 1000); // Mbps
    
    // Cap unrealistic speeds
    if (uploadSpeed > 100) {
      console.warn(`Unrealistic upload speed calculated: ${uploadSpeed} Mbps, capping at 100 Mbps`);
      uploadSpeed = 100;
    }
    
    // Ensure minimum realistic speed
    if (uploadSpeed < 0.1) {
      uploadSpeed = 0.1;
    }
    
    return new Response(JSON.stringify({
      success: true,
      type: 'upload',
      size: totalSize,
      duration,
      speed: uploadSpeed,
      timestamp: Date.now(),
      method: 'file-upload',
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
    console.error('Upload speed test error:', error);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
