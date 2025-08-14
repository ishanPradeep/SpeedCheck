import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// File sizes for testing (in bytes)
const TEST_FILES = {
  'small': 524288,    // 0.5MB
  'medium': 1048576,  // 1MB
  'large': 2097152,   // 2MB
  'xlarge': 5242880   // 5MB
};

// Generate test files if they don't exist
async function ensureTestFiles() {
  const uploadsDir = path.join(process.cwd(), 'public', 'test-files');
  
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.warn('Could not create test-files directory:', error);
  }
  
  for (const [name, size] of Object.entries(TEST_FILES)) {
    const filePath = path.join(uploadsDir, `${name}.bin`);
    
    try {
      await fs.access(filePath);
    } catch {
      // File doesn't exist, create it
      console.log(`Creating test file: ${name}.bin (${size} bytes)`);
      const data = new Uint8Array(size);
      
      // Fill with a pattern that's not easily compressible
      for (let i = 0; i < size; i++) {
        data[i] = (i * 7 + 13) % 256; // Simple but non-compressible pattern
      }
      
      await fs.writeFile(filePath, data);
    }
  }
}

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
    
    const filePath = path.join(process.cwd(), 'public', 'test-files', `${fileSize}.bin`);
    
    try {
      const fileBuffer = await fs.readFile(filePath);
      
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Speed-Test': 'file-based',
          'X-File-Size': fileBuffer.length.toString(),
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Test file not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
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
    
    // Calculate upload speed
    const uploadSpeed = (totalSize * 8) / (duration / 1000); // Mbps
    
    return new Response(JSON.stringify({
      success: true,
      type: 'upload',
      size: totalSize,
      duration,
      speed: Math.max(uploadSpeed, 0.1),
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
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Initialize test files on server startup
if (typeof window === 'undefined') {
  ensureTestFiles().catch(console.error);
}
