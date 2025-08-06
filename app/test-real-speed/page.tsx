'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestRealSpeedPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testPing = async () => {
    setLoading(true);
    addLog('Starting ping test...');
    
    try {
      const startTime = performance.now();
      const response = await fetch('/api/real-ping', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      const endTime = performance.now();
      
      if (response.ok) {
        const data = await response.json();
        const measuredPing = endTime - startTime;
        addLog(`Ping test successful: ${measuredPing.toFixed(2)}ms (API: ${data.ping}ms)`);
        setResults(prev => ({ ...prev, ping: measuredPing }));
      } else {
        addLog('Ping test failed');
      }
    } catch (error) {
      addLog(`Ping test error: ${error}`);
    }
    
    setLoading(false);
  };

  const testDownload = async () => {
    setLoading(true);
    addLog('Starting download test...');
    
    try {
      const testSizes = [1, 2, 5]; // MB
      let totalBytes = 0;
      let totalTime = 0;
      
      for (let i = 0; i < testSizes.length; i++) {
        const size = testSizes[i];
        addLog(`Testing ${size}MB download...`);
        
        const startTime = performance.now();
        const response = await fetch('/api/real-speed-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
          body: JSON.stringify({
            type: 'download',
            size: size * 1024 * 1024
          })
        });
        const endTime = performance.now();
        
        if (response.ok) {
          const duration = endTime - startTime;
          const dataSize = size * 1024 * 1024;
          const speed = (dataSize * 8) / (duration * 1000000);
          
          totalBytes += dataSize;
          totalTime += duration / 1000;
          
          addLog(`${size}MB download: ${speed.toFixed(2)} Mbps in ${duration.toFixed(0)}ms`);
        } else {
          addLog(`${size}MB download failed`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const avgSpeed = (totalBytes * 8) / (totalTime * 1000000);
      addLog(`Average download speed: ${avgSpeed.toFixed(2)} Mbps`);
      setResults(prev => ({ ...prev, download: avgSpeed }));
      
    } catch (error) {
      addLog(`Download test error: ${error}`);
    }
    
    setLoading(false);
  };

  const testUpload = async () => {
    setLoading(true);
    addLog('Starting upload test...');
    
    try {
      const testSizes = [0.5, 1, 2]; // MB
      let totalBytes = 0;
      let totalTime = 0;
      
      for (let i = 0; i < testSizes.length; i++) {
        const size = testSizes[i];
        addLog(`Testing ${size}MB upload...`);
        
        // Generate test data
        const testData = new Uint8Array(size * 1024 * 1024);
        for (let j = 0; j < testData.length; j++) {
          testData[j] = Math.floor(Math.random() * 256);
        }
        
        const startTime = performance.now();
        const response = await fetch('/api/real-speed-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
          body: testData
        });
        const endTime = performance.now();
        
        if (response.ok) {
          const duration = endTime - startTime;
          const dataSize = size * 1024 * 1024;
          const speed = (dataSize * 8) / (duration * 1000000);
          
          totalBytes += dataSize;
          totalTime += duration / 1000;
          
          addLog(`${size}MB upload: ${speed.toFixed(2)} Mbps in ${duration.toFixed(0)}ms`);
        } else {
          addLog(`${size}MB upload failed`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const avgSpeed = (totalBytes * 8) / (totalTime * 1000000);
      addLog(`Average upload speed: ${avgSpeed.toFixed(2)} Mbps`);
      setResults(prev => ({ ...prev, upload: avgSpeed }));
      
    } catch (error) {
      addLog(`Upload test error: ${error}`);
    }
    
    setLoading(false);
  };

  const runFullTest = async () => {
    setResults(null);
    setLogs([]);
    addLog('Starting full speed test...');
    
    await testPing();
    await testDownload();
    await testUpload();
    
    addLog('Full test completed!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Real Speed Test Verification</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Run individual tests or full speed test</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              onClick={runFullTest} 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Run Full Test
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Current test measurements</CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-2">
                {results.ping && (
                  <div className="flex justify-between">
                    <span>Ping:</span>
                    <span className="font-mono">{results.ping.toFixed(2)} ms</span>
                  </div>
                )}
                {results.download && (
                  <div className="flex justify-between">
                    <span>Download:</span>
                    <span className="font-mono">{results.download.toFixed(2)} Mbps</span>
                  </div>
                )}
                {results.upload && (
                  <div className="flex justify-between">
                    <span>Upload:</span>
                    <span className="font-mono">{results.upload.toFixed(2)} Mbps</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No results yet. Run a test to see measurements.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Logs</CardTitle>
          <CardDescription>Detailed test execution logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            ) : (
              <p className="text-muted-foreground">No logs yet. Run a test to see detailed information.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 