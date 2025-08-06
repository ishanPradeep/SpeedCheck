'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TestResult {
  ping?: { time: number; data: any };
  download?: { size: number; duration: number; speed: number };
  upload?: { size: number; duration: number; speed: number; data: any };
}

export default function TestRealPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult>({});
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
    setResults({});
  };

  const testPing = async () => {
    setLoading(true);
    addLog('Testing ping (real network latency)...');

    try {
      const startTime = performance.now();
      const response = await fetch('/api/ping', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        signal: AbortSignal.timeout(10000)
      });

      const endTime = performance.now();
      const pingTime = endTime - startTime;

      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Ping successful: ${Math.round(pingTime)}ms (real network latency)`);
        addLog(`📊 Server response: ${JSON.stringify(data, null, 2)}`);
        addLog(`🌐 Note: On localhost, ping should be very low (< 10ms)`);
        setResults(prev => ({ ...prev, ping: { time: Math.round(pingTime), data } }));
      } else {
        addLog(`❌ Ping failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addLog(`❌ Ping error: ${error}`);
    }

    setLoading(false);
  };

  const testDownload = async () => {
    setLoading(true);
    addLog('Testing download (real network transfer)...');

    try {
      // Measure the entire request-response cycle for accurate network timing
      const startTime = performance.now();
      const response = await fetch('/api/speed-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify({
          type: 'download',
          size: 1024 * 1024 // 1MB
        }),
        signal: AbortSignal.timeout(30000)
      });

      if (response.ok) {
        // Read the data (this is part of the network transfer)
        const data = await response.arrayBuffer();
        const endTime = performance.now();
        
        const totalDuration = endTime - startTime;
        const dataSize = data.byteLength;
        const speed = (dataSize * 8) / (totalDuration * 1000000); // Mbps

        addLog(`✅ Download successful: ${dataSize} bytes in ${Math.round(totalDuration)}ms`);
        addLog(`📊 Calculated speed: ${speed.toFixed(2)} Mbps (real network transfer)`);
        addLog(`🌐 On localhost, speed should be very high (> 1000 Mbps)`);
        addLog(`⚡ Total time: ${totalDuration.toFixed(2)}ms for ${(dataSize / (1024 * 1024)).toFixed(2)}MB`);
        setResults(prev => ({ ...prev, download: { size: dataSize, duration: Math.round(totalDuration), speed } }));
      } else {
        addLog(`❌ Download failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addLog(`❌ Download error: ${error}`);
    }

    setLoading(false);
  };

  const testUpload = async () => {
    setLoading(true);
    addLog('Testing upload (real network transfer)...');

    try {
      // Generate 1MB test data efficiently
      const testData = new Uint8Array(1024 * 1024);
      const pattern = new Uint8Array(1024);
      for (let i = 0; i < pattern.length; i++) {
        pattern[i] = Math.floor(Math.random() * 256);
      }
      for (let i = 0; i < testData.length; i++) {
        testData[i] = pattern[i % pattern.length];
      }

      const startTime = performance.now();
      const response = await fetch('/api/speed-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: testData,
        signal: AbortSignal.timeout(30000)
      });

      if (response.ok) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const data = await response.json();
        const dataSize = testData.length;
        const speed = (dataSize * 8) / (duration * 1000000); // Mbps

        addLog(`✅ Upload successful: ${dataSize} bytes in ${Math.round(duration)}ms`);
        addLog(`📊 Calculated speed: ${speed.toFixed(2)} Mbps (real network transfer)`);
        addLog(`🌐 On localhost, speed should be very high (> 1000 Mbps)`);
        addLog(`⚡ Transfer time: ${duration.toFixed(2)}ms for ${(dataSize / (1024 * 1024)).toFixed(2)}MB`);
        addLog(`📋 Server response: ${JSON.stringify(data, null, 2)}`);
        setResults(prev => ({ ...prev, upload: { size: dataSize, duration: Math.round(duration), speed, data } }));
      } else {
        addLog(`❌ Upload failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      addLog(`❌ Upload error: ${error}`);
    }

    setLoading(false);
  };

  const testAll = async () => {
    setLoading(true);
    addLog('Starting comprehensive speed test...');
    addLog('This will test ping, download, and upload speeds.');
    addLog('On localhost, you should see very high speeds and low ping.');
    
    await testPing();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testDownload();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testUpload();
    
    addLog('✅ All tests completed!');
    setLoading(false);
  };

  const getQualityBadge = (type: 'ping' | 'download' | 'upload', value: number) => {
    if (type === 'ping') {
      if (value <= 10) return <Badge className="bg-green-500">Excellent</Badge>;
      if (value <= 50) return <Badge className="bg-blue-500">Good</Badge>;
      if (value <= 100) return <Badge className="bg-yellow-500">Fair</Badge>;
      return <Badge className="bg-red-500">Poor</Badge>;
    } else {
      if (value >= 1000) return <Badge className="bg-green-500">Excellent</Badge>;
      if (value >= 100) return <Badge className="bg-blue-500">Good</Badge>;
      if (value >= 10) return <Badge className="bg-yellow-500">Fair</Badge>;
      return <Badge className="bg-red-500">Poor</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Real Speed Test Verification</h1>
        <p className="text-gray-600">
          This page helps verify that your speed test is working correctly with real network measurements.
          On localhost, you should see very high speeds and low ping times.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Run individual tests or all tests together</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={testPing} 
              disabled={loading}
              className="w-full"
            >
              Test Ping
            </Button>
            <Button 
              onClick={testDownload} 
              disabled={loading}
              className="w-full"
            >
              Test Download
            </Button>
            <Button 
              onClick={testUpload} 
              disabled={loading}
              className="w-full"
            >
              Test Upload
            </Button>
            <Button 
              onClick={testAll} 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Test All
            </Button>
            <Button 
              onClick={clearLogs} 
              variant="outline"
              className="w-full"
            >
              Clear Logs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Real-time measurement results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.ping && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">Ping</div>
                  <div className="text-sm text-gray-600">{results.ping.time}ms</div>
                </div>
                {getQualityBadge('ping', results.ping.time)}
              </div>
            )}
            
            {results.download && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">Download</div>
                  <div className="text-sm text-gray-600">{results.download.speed.toFixed(2)} Mbps</div>
                </div>
                {getQualityBadge('download', results.download.speed)}
              </div>
            )}
            
            {results.upload && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">Upload</div>
                  <div className="text-sm text-gray-600">{results.upload.speed.toFixed(2)} Mbps</div>
                </div>
                {getQualityBadge('upload', results.upload.speed)}
              </div>
            )}
            
            {!results.ping && !results.download && !results.upload && (
              <div className="text-center text-gray-500 py-8">
                No test results yet. Run a test to see results here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Logs</CardTitle>
          <CardDescription>Detailed information about each test</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Run a test to see detailed information.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">About Localhost Testing</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• <strong>Ping:</strong> Should be very low (&lt; 10ms) on localhost</li>
          <li>• <strong>Download/Upload:</strong> Should be very high (&gt; 1000 Mbps) on localhost</li>
          <li>• <strong>Real Network:</strong> When deployed, you'll see actual internet speeds</li>
          <li>• <strong>Low speeds on localhost</strong> indicate server processing overhead, not network issues</li>
        </ul>
      </div>
    </div>
  );
} 