'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TestResult {
  testType: string;
  size: number;
  duration: number;
  speed: number;
  success: boolean;
  error?: string;
  details?: any;
}

export default function ApiTestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
    setResults([]);
  };

  const testApiStatus = async () => {
    addLog('🔍 Testing API status...');
    try {
      const response = await fetch('/api/speed-test', { method: 'GET' });
      const data = await response.json();
      addLog(`✅ API Status: ${data.status}`);
      addLog(`📋 Server: ${data.server}`);
      addLog(`📋 Version: ${data.version}`);
      addLog(`📋 Features: ${JSON.stringify(data.features)}`);
    } catch (error) {
      addLog(`❌ API Status Error: ${error}`);
    }
  };

  const testDownload = async (sizeMB: number) => {
    const sizeBytes = sizeMB * 1024 * 1024;
    addLog(`📥 Testing download: ${sizeMB}MB (${sizeBytes} bytes)`);
    
    try {
      const startTime = performance.now();
      
      const response = await fetch('/api/speed-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify({
          type: 'download',
          size: sizeBytes
        }),
        signal: AbortSignal.timeout(30000)
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (response.ok) {
        const data = await response.arrayBuffer();
        const actualSize = data.byteLength;
        const speed = (actualSize * 8) / (duration * 1000); // Mbps - Fixed calculation
        
        addLog(`✅ Download success: ${actualSize} bytes in ${duration.toFixed(2)}ms = ${speed.toFixed(2)} Mbps`);
        
        setResults(prev => [...prev, {
          testType: 'Download',
          size: sizeMB,
          duration,
          speed,
          success: true,
          details: {
            expectedSize: sizeBytes,
            actualSize,
            sizeAccuracy: ((actualSize / sizeBytes) * 100).toFixed(2) + '%'
          }
        }]);
      } else {
        const errorText = await response.text();
        addLog(`❌ Download failed: ${response.status} ${response.statusText}`);
        addLog(`❌ Error: ${errorText}`);
        
        setResults(prev => [...prev, {
          testType: 'Download',
          size: sizeMB,
          duration,
          speed: 0,
          success: false,
          error: `${response.status}: ${response.statusText}`
        }]);
      }
    } catch (error) {
      addLog(`❌ Download error: ${error}`);
      setResults(prev => [...prev, {
        testType: 'Download',
        size: sizeMB,
        duration: 0,
        speed: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]);
    }
  };

  const testUpload = async (sizeMB: number) => {
    const sizeBytes = sizeMB * 1024 * 1024;
    addLog(`📤 Testing upload: ${sizeMB}MB (${sizeBytes} bytes)`);
    
    try {
      // Generate test data
      const testData = new Uint8Array(sizeBytes);
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

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (response.ok) {
        const result = await response.json();
        addLog(`✅ Upload success: ${result.size} bytes in ${duration.toFixed(2)}ms = ${result.speed.toFixed(2)} Mbps`);
        
        setResults(prev => [...prev, {
          testType: 'Upload',
          size: sizeMB,
          duration,
          speed: result.speed,
          success: true,
          details: result
        }]);
      } else {
        const errorText = await response.text();
        addLog(`❌ Upload failed: ${response.status} ${response.statusText}`);
        addLog(`❌ Error: ${errorText}`);
        
        setResults(prev => [...prev, {
          testType: 'Upload',
          size: sizeMB,
          duration,
          speed: 0,
          success: false,
          error: `${response.status}: ${response.statusText}`
        }]);
      }
    } catch (error) {
      addLog(`❌ Upload error: ${error}`);
      setResults(prev => [...prev, {
        testType: 'Upload',
        size: sizeMB,
        duration: 0,
        speed: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]);
    }
  };

  const runFullTest = async () => {
    setIsRunning(true);
    clearLogs();
    
    addLog('🚀 Starting comprehensive API test...');
    
    // Test API status
    await testApiStatus();
    addLog('');
    
    // Test downloads
    addLog('📥 Testing downloads...');
    for (const size of [1, 2, 5, 10]) {
      await testDownload(size);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    addLog('');
    
    // Test uploads
    addLog('📤 Testing uploads...');
    for (const size of [0.5, 1, 2, 5]) {
      await testUpload(size);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    addLog('✅ Test completed!');
    setIsRunning(false);
  };

  const successfulTests = results.filter(r => r.success);
  const failedTests = results.filter(r => !r.success);
  const avgDownloadSpeed = successfulTests
    .filter(r => r.testType === 'Download')
    .reduce((sum, r) => sum + r.speed, 0) / Math.max(successfulTests.filter(r => r.testType === 'Download').length, 1);
  const avgUploadSpeed = successfulTests
    .filter(r => r.testType === 'Upload')
    .reduce((sum, r) => sum + r.speed, 0) / Math.max(successfulTests.filter(r => r.testType === 'Upload').length, 1);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Speed Test API Debugger</h1>
          <p className="text-muted-foreground">Comprehensive testing and debugging for the speed test API</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={clearLogs} variant="outline" disabled={isRunning}>
            Clear Logs
          </Button>
          <Button onClick={runFullTest} disabled={isRunning}>
            {isRunning ? 'Running Tests...' : 'Run Full Test'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Individual test functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">API Status</h4>
              <Button onClick={testApiStatus} disabled={isRunning} variant="outline" size="sm">
                Test API Status
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Download Tests</h4>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 5, 10].map(size => (
                  <Button
                    key={`download-${size}`}
                    onClick={() => testDownload(size)}
                    disabled={isRunning}
                    variant="outline"
                    size="sm"
                  >
                    {size}MB
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Upload Tests</h4>
              <div className="flex flex-wrap gap-2">
                {[0.5, 1, 2, 5].map(size => (
                  <Button
                    key={`upload-${size}`}
                    onClick={() => testUpload(size)}
                    disabled={isRunning}
                    variant="outline"
                    size="sm"
                  >
                    {size}MB
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
            <CardDescription>Overall test results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{successfulTests.length}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{failedTests.length}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-2">Average Speeds</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Download:</span>
                  <Badge variant="secondary">{avgDownloadSpeed.toFixed(2)} Mbps</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Upload:</span>
                  <Badge variant="secondary">{avgUploadSpeed.toFixed(2)} Mbps</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Detailed test outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.testType}
                    </Badge>
                    <span className="font-medium">{result.size}MB</span>
                    {result.success && (
                      <span className="text-sm text-muted-foreground">
                        {result.duration.toFixed(0)}ms
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <Badge variant="secondary">{result.speed.toFixed(2)} Mbps</Badge>
                    ) : (
                      <span className="text-sm text-red-600">{result.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Logs</CardTitle>
          <CardDescription>Real-time test execution logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Run a test to see debug information.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">{log}</div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 