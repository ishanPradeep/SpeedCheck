'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Download, Upload, Zap, Globe } from 'lucide-react';

interface SpeedTestResult {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  duration: number;
  method: string;
  cloudflare?: {
    pop: string;
    country: string;
    ip: string;
  };
}

export default function TestRealSpeedPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SpeedTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testType, setTestType] = useState<'regular' | 'cloudflare'>('cloudflare');

  const runSpeedTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setError(null);

    try {
      const startTime = performance.now();
      
      // Step 1: Ping test
      setProgress(10);
      const ping = await measurePing();
      
      // Step 2: Download test
      setProgress(30);
      const downloadSpeed = await measureDownloadSpeed((p) => {
        setProgress(30 + (p * 0.4));
      });
      
      // Step 3: Upload test
      setProgress(70);
      const uploadSpeed = await measureUploadSpeed((p) => {
        setProgress(70 + (p * 0.25));
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      setProgress(100);
      
      const result: SpeedTestResult = {
        downloadSpeed,
        uploadSpeed,
        ping,
        duration,
        method: testType === 'cloudflare' ? 'cloudflare-optimized' : 'real-file-transfer',
      };
      
      setResults(result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speed test failed');
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  const measurePing = async (): Promise<number> => {
    const servers = [
      'https://www.google.com',
      'https://www.cloudflare.com',
      'https://www.speedtest.net',
    ];
    
    try {
      // Use server-side ping API to avoid CORS issues
      const response = await fetch('/api/ping-external', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ servers }),
        signal: AbortSignal.timeout(10000),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.bestPing) {
          return data.bestPing;
        } else {
          throw new Error('Ping API failed');
        }
      } else {
        throw new Error('Ping API failed');
      }
    } catch (error) {
      throw new Error('Ping test failed');
    }
  };

  const measureDownloadSpeed = async (onProgress: (progress: number) => void): Promise<number> => {
    const endpoint = testType === 'cloudflare' ? '/api/cloudflare-speed-test' : '/api/real-speed-test';
    const fileSizes = testType === 'cloudflare' 
      ? [65536, 262144, 1048576, 5242880] // 64KB, 256KB, 1MB, 5MB
      : [524288, 1048576, 2097152, 5242880]; // 0.5MB, 1MB, 2MB, 5MB
    
    const speeds: number[] = [];
    
    for (let i = 0; i < fileSizes.length; i++) {
      const size = fileSizes[i];
      
      try {
        const startTime = performance.now();
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
          body: JSON.stringify({
            type: 'download',
            size: size
          }),
          signal: AbortSignal.timeout(30000),
        });
        
        if (response.ok) {
          const data = await response.arrayBuffer();
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          const speed = (data.byteLength * 8) / (duration / 1000); // Mbps
          speeds.push(speed);
          
          onProgress(((i + 1) / fileSizes.length) * 100);
        }
      } catch (error) {
        console.error(`Download test failed for size ${size}:`, error);
      }
    }
    
    if (speeds.length === 0) {
      throw new Error('Download test failed');
    }
    
    // Return weighted average (larger files have more weight)
    const weightedSum = speeds.reduce((sum, speed, index) => sum + speed * (index + 1), 0);
    const weightSum = speeds.reduce((sum, _, index) => sum + (index + 1), 0);
    return weightedSum / weightSum;
  };

  const measureUploadSpeed = async (onProgress: (progress: number) => void): Promise<number> => {
    const endpoint = testType === 'cloudflare' ? '/api/cloudflare-speed-test' : '/api/real-speed-test';
    const fileSizes = testType === 'cloudflare'
      ? [32768, 131072, 524288, 1048576] // 32KB, 128KB, 512KB, 1MB
      : [262144, 524288, 1048576, 2097152]; // 0.25MB, 0.5MB, 1MB, 2MB
    
    const speeds: number[] = [];
    
    for (let i = 0; i < fileSizes.length; i++) {
      const size = fileSizes[i];
      
      try {
        // Generate test data
        const data = new Uint8Array(size);
        const pattern = new Uint8Array(1024);
        for (let j = 0; j < pattern.length; j++) {
          pattern[j] = Math.floor(Math.random() * 256);
        }
        for (let j = 0; j < size; j++) {
          data[j] = pattern[j % pattern.length];
        }
        
        const startTime = performance.now();
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
          body: data,
          signal: AbortSignal.timeout(30000),
        });
        
        if (response.ok) {
          const result = await response.json();
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          const speed = result.speed || (data.length * 8) / (duration / 1000);
          speeds.push(speed);
          
          onProgress(((i + 1) / fileSizes.length) * 100);
        }
      } catch (error) {
        console.error(`Upload test failed for size ${size}:`, error);
      }
    }
    
    if (speeds.length === 0) {
      throw new Error('Upload test failed');
    }
    
    // Return weighted average
    const weightedSum = speeds.reduce((sum, speed, index) => sum + speed * (index + 1), 0);
    const weightSum = speeds.reduce((sum, _, index) => sum + (index + 1), 0);
    return weightedSum / weightSum;
  };

  const formatSpeed = (speed: number): string => {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(2)} Gbps`;
    }
    return `${speed.toFixed(2)} Mbps`;
  };

  const formatDuration = (duration: number): string => {
    return `${(duration / 1000).toFixed(1)}s`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Real Speed Test</h1>
        <p className="text-muted-foreground">
          Test your internet speed using real file transfers
        </p>
      </div>

      <Tabs value={testType} onValueChange={(value) => setTestType(value as 'regular' | 'cloudflare')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="cloudflare" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Cloudflare Optimized
          </TabsTrigger>
          <TabsTrigger value="regular" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Standard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cloudflare">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Cloudflare-optimized tests use Cloudflare's global CDN for more accurate results across different locations.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="regular">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Standard tests use direct file transfers for reliable speed measurements.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Speed Test
          </CardTitle>
          <CardDescription>
            Click the button below to start a comprehensive speed test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runSpeedTest} 
            disabled={isRunning}
            className="w-full"
            size="lg"
          >
            {isRunning ? 'Running Test...' : 'Start Speed Test'}
          </Button>
          
          {isRunning && (
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Progress: {progress.toFixed(0)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatSpeed(results.downloadSpeed)}
              </div>
              <Badge variant="secondary" className="mt-2">
                {results.method}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {formatSpeed(results.uploadSpeed)}
              </div>
              <Badge variant="secondary" className="mt-2">
                {results.method}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {results.ping.toFixed(1)} ms
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {formatDuration(results.duration)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {results?.cloudflare && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Cloudflare Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">POP Location</p>
                <p className="text-lg font-semibold">{results.cloudflare.pop}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Country</p>
                <p className="text-lg font-semibold">{results.cloudflare.country}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                <p className="text-lg font-semibold">{results.cloudflare.ip}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 