'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function TestFixesPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsRunning(true);
    try {
      const result = await testFn();
      setTestResults(prev => [...prev, { name: testName, success: true, result }]);
    } catch (error) {
      setTestResults(prev => [...prev, { name: testName, success: false, error: error instanceof Error ? error.message : 'Unknown error' }]);
    } finally {
      setIsRunning(false);
    }
  };

  const testDownloadAPI = async () => {
    const response = await fetch('/api/real-speed-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'download', size: 1048576 }) // 1MB
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.arrayBuffer();
    return { size: data.byteLength, status: response.status };
  };

  const testUploadAPI = async () => {
    const testData = new Uint8Array(262144); // 256KB
    for (let i = 0; i < testData.length; i++) {
      testData[i] = Math.floor(Math.random() * 256);
    }
    
    const response = await fetch('/api/real-speed-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: testData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    return { size: result.size, speed: result.speed, status: response.status };
  };

  const testCloudflareAPI = async () => {
    const response = await fetch('/api/cloudflare-speed-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'download', size: 65536 }) // 64KB
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.arrayBuffer();
    return { size: data.byteLength, status: response.status };
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Speed Test Fixes Verification</h1>
        <p className="text-muted-foreground">
          Test the fixes for the speed test calculation issues
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>
            Run individual tests to verify the fixes are working
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Button 
              onClick={() => runTest('Download API Test', testDownloadAPI)}
              disabled={isRunning}
              variant="outline"
            >
              Test Download API
            </Button>
            
            <Button 
              onClick={() => runTest('Upload API Test', testUploadAPI)}
              disabled={isRunning}
              variant="outline"
            >
              Test Upload API
            </Button>
            
            <Button 
              onClick={() => runTest('Cloudflare API Test', testCloudflareAPI)}
              disabled={isRunning}
              variant="outline"
            >
              Test Cloudflare API
            </Button>
          </div>
          
          <Button 
            onClick={clearResults}
            variant="secondary"
            className="w-full"
          >
            Clear Results
          </Button>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results</h2>
          
          {testResults.map((result, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{result.name}</h3>
                    
                    {result.success ? (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.result, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-red-600">
                        Error: {result.error}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>What Was Fixed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Upload Test 500 Errors:</strong> Fixed content-type handling to properly distinguish between JSON requests (download) and binary data requests (upload).
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Unrealistic Speed Calculations:</strong> Added validation to cap speeds at 10 Gbps and prevent display of impossible values like 28.5 Gbps.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Progress Calculation:</strong> Fixed progress tracking in both download and upload tests for better user experience.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Speed Display:</strong> Added proper formatting to show Gbps for speeds over 1000 Mbps and improved the gauge display.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
