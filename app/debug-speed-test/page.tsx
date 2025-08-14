'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Bug, CheckCircle, AlertCircle } from 'lucide-react';

export default function DebugSpeedTestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testRealSpeedAPI = async () => {
    setIsRunning(true);
    addLog('🔍 Testing Real Speed API...');
    
    try {
      // Test download
      addLog('📥 Testing download...');
      const downloadResponse = await fetch('/api/real-speed-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'download', size: 1048576 }) // 1MB
      });
      
      if (downloadResponse.ok) {
        const data = await downloadResponse.arrayBuffer();
        addLog(`✅ Download test successful: ${data.byteLength} bytes`);
      } else {
        addLog(`❌ Download test failed: ${downloadResponse.status}`);
      }
      
      // Test upload
      addLog('📤 Testing upload...');
      const testData = new Uint8Array(262144); // 256KB
      for (let i = 0; i < testData.length; i++) {
        testData[i] = Math.floor(Math.random() * 256);
      }
      
      const uploadResponse = await fetch('/api/real-speed-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: testData
      });
      
      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        addLog(`✅ Upload test successful: ${result.size} bytes, ${result.speed} Mbps`);
      } else {
        addLog(`❌ Upload test failed: ${uploadResponse.status}`);
      }
      
    } catch (error) {
      addLog(`💥 Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const testCloudflareAPI = async () => {
    setIsRunning(true);
    addLog('🌐 Testing Cloudflare API...');
    
    try {
      // Test download
      addLog('📥 Testing Cloudflare download...');
      const downloadResponse = await fetch('/api/cloudflare-speed-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'download', size: 65536 }) // 64KB
      });
      
      if (downloadResponse.ok) {
        const data = await downloadResponse.arrayBuffer();
        addLog(`✅ Cloudflare download successful: ${data.byteLength} bytes`);
      } else {
        addLog(`❌ Cloudflare download failed: ${downloadResponse.status}`);
      }
      
    } catch (error) {
      addLog(`💥 Cloudflare Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const testPing = async () => {
    setIsRunning(true);
    addLog('🏓 Testing ping...');
    
    try {
      const servers = [
        'https://www.google.com',
        'https://www.cloudflare.com',
        'https://www.speedtest.net'
      ];
      
      addLog('📡 Using server-side ping API to avoid CORS issues...');
      
      const response = await fetch('/api/ping-external', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ servers }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          addLog(`✅ Best ping: ${data.bestPing}ms (${data.bestServer})`);
          
          for (const result of data.results) {
            if (result.success) {
              addLog(`✅ ${result.server}: ${result.ping}ms`);
            } else {
              addLog(`❌ ${result.server}: Failed (${result.error})`);
            }
          }
        } else {
          addLog(`❌ Ping API failed: ${data.error}`);
        }
      } else {
        addLog(`❌ Ping API failed: HTTP ${response.status}`);
      }
      
    } catch (error) {
      addLog(`💥 Ping Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Speed Test Debug</h1>
        <p className="text-muted-foreground">
          Debug and test the speed test functionality
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Debug Controls
          </CardTitle>
          <CardDescription>
            Run individual tests to identify issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Button 
              onClick={testRealSpeedAPI}
              disabled={isRunning}
              variant="outline"
            >
              Test Real Speed API
            </Button>
            
            <Button 
              onClick={testCloudflareAPI}
              disabled={isRunning}
              variant="outline"
            >
              Test Cloudflare API
            </Button>
            
            <Button 
              onClick={testPing}
              disabled={isRunning}
              variant="outline"
            >
              Test Ping
            </Button>
          </div>
          
          <Button 
            onClick={clearLogs}
            variant="secondary"
            className="w-full"
          >
            Clear Logs
          </Button>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Known Issues & Fixes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Upload 500 Errors:</strong> Fixed by properly handling content-type for binary data vs JSON requests.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Unrealistic Speeds:</strong> Fixed by adding validation to cap speeds at 10 Gbps and proper formatting.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>External API Dependencies:</strong> Removed dependency on external-speed-test API, now uses direct measurements.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Progress Tracking:</strong> Fixed progress calculation in both download and upload tests.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>CORS Issues:</strong> Fixed by creating server-side ping API to avoid client-side CORS restrictions.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
