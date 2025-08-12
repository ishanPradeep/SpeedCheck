import { NextRequest } from 'next/server';

// Pre-generated test files for better performance
const TEST_FILES = {
  '1MB': new Uint8Array(1024 * 1024),
  '2MB': new Uint8Array(2 * 1024 * 1024),
  '5MB': new Uint8Array(5 * 1024 * 1024),
  '10MB': new Uint8Array(10 * 1024 * 1024),
};

// Initialize test files with random data
const initializeTestFiles = () => {
  const pattern = new Uint8Array(1024);
  for (let i = 0; i < pattern.length; i++) {
    pattern[i] = Math.floor(Math.random() * 256);
  }

  Object.keys(TEST_FILES).forEach(key => {
    const file = TEST_FILES[key as keyof typeof TEST_FILES];
    for (let i = 0; i < file.length; i++) {
      file[i] = pattern[i % pattern.length];
    }
  });
};

// Initialize files on module load
initializeTestFiles();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const size = searchParams.get('size');
  const requestId = `static-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log(`🚀 [${requestId}] Static file request: ${size}`);

  try {
    if (!size || !TEST_FILES[size as keyof typeof TEST_FILES]) {
      console.error(`❌ [${requestId}] Invalid file size: ${size}`);
      return new Response(JSON.stringify({ 
        error: 'Invalid file size',
        availableSizes: Object.keys(TEST_FILES)
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const file = TEST_FILES[size as keyof typeof TEST_FILES];
    const fileSize = file.length;

    console.log(`📤 [${requestId}] Serving ${size} file (${fileSize} bytes)`);

    const headers = {
      'Content-Type': 'application/octet-stream',
      'Content-Length': fileSize.toString(),
      'Content-Description': 'Speed Test File',
      'Content-Disposition': `attachment; filename=speedtest-${size}.dat`,
      'Content-Transfer-Encoding': 'binary',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0',
      'Pragma': 'no-cache',
      'Connection': 'keep-alive',
      'X-Speed-Test': 'true',
      'X-File-Size': fileSize.toString(),
      'X-Request-Id': requestId,
    };

    return new Response(file, {
      status: 200,
      headers: headers,
    });

  } catch (error) {
    console.error(`❌ [${requestId}] Static file error:`, error);
    return new Response(JSON.stringify({ 
      error: 'File serving failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      requestId: requestId,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Test-Id, Cache-Control',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
    },
  });
}
