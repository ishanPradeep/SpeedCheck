'use client';

import { useState } from 'react';
import { isStaticGeneration } from '@/lib/utils';

interface TestResults {
  ping?: number;
  download?: number;
  upload?: number;
  jitter?: number;
}

export default function TestFixesPage() {
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testPing = async () => {
    if (isStaticGeneration()) {
      addLog('❌ Cannot run ping test during static generation');
      return;
    }
    
    setLoading(true);
    addLog('🚀 Starting ping test...');
    
    try {
      // Test your own server first
      addLog('📡 Testing your server ping...');
      const ownMeasurements: number[] = [];
      const countPing = 5;
      
      for (let i = 0; i < countPing; i++) {
        const startTime = performance.now();
        
        const response = await fetch('/api/ping', { 
          method: 'HEAD', 
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          signal: AbortSignal.timeout(5000)
        });
      
        if (response.ok) {
          const endTime = performance.now();
          const pingTime = endTime - startTime;
          if (pingTime >= 1 && pingTime <= 1000) {
            ownMeasurements.push(pingTime);
            addLog(`📊 Your server ping ${i + 1}: ${pingTime.toFixed(2)}ms`);
          } else {
            addLog(`⚠️ Your server ping ${i + 1}: Skipping outlier ${pingTime.toFixed(2)}ms`);
          }
        } else {
          addLog(`❌ Your server ping ${i + 1} failed: ${response.status}`);
        }
        
        if (i < countPing - 1) await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      if (ownMeasurements.length > 0) {
        const minPing = Math.min(...ownMeasurements);
        const avgPing = ownMeasurements.reduce((a, b) => a + b, 0) / ownMeasurements.length;
        
        addLog(`✅ Your server ping: min=${minPing.toFixed(2)}ms, avg=${avgPing.toFixed(2)}ms`);
        setResults(prev => ({ ...prev, ping: minPing }));
      }
      
      // Test external servers for comparison
      addLog('🌐 Testing external servers for comparison...');
      const externalServers = [
        'https://www.google.com',
        'https://www.cloudflare.com',
        'https://www.speedtest.net'
      ];
      
      for (const server of externalServers) {
        try {
          const response = await fetch(`/api/external-ping?server=${encodeURIComponent(server)}`);
          if (response.ok) {
            const data = await response.json();
            addLog(`🌐 ${server}: ${data.ping}ms`);
          }
        } catch (error) {
          addLog(`❌ ${server}: Failed`);
        }
      }
      
    } catch (error) {
      addLog(`❌ Ping test error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testDownload = async () => {
    if (isStaticGeneration()) {
      addLog('❌ Cannot run download test during static generation');
      return;
    }
    
    setLoading(true);
    addLog('🚀 Starting download test...');
    
    try {
      const size = 1; // 1MB test
      const sizeInBytes = size * 1024 * 1024;
      
      const startTime = performance.now();
      
      const response = await fetch('/api/speed-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify({
          type: 'download',
          size: sizeInBytes
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        const dataStartTime = performance.now();
        const data = await response.arrayBuffer();
        const dataEndTime = performance.now();
        const endTime = performance.now();
        
        const totalDuration = endTime - startTime;
        const dataReadDuration = dataEndTime - dataStartTime;
        const dataSize = data.byteLength;
        
        const effectiveDuration = Math.max(dataReadDuration, 50);
        const speed = (dataSize * 8) / (effectiveDuration / 1000) / 1000000;
        
        addLog(`📊 Download: ${size}MB in ${totalDuration.toFixed(2)}ms = ${speed.toFixed(2)} Mbps`);
        addLog(`📈 Data read time: ${dataReadDuration.toFixed(2)}ms`);
        setResults(prev => ({ ...prev, download: speed }));
      } else {
        addLog(`❌ Download test failed: ${response.status}`);
      }
    } catch (error) {
      addLog(`❌ Download test error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testUpload = async () => {
    if (isStaticGeneration()) {
      addLog('❌ Cannot run upload test during static generation');
      return;
    }
    
    setLoading(true);
    addLog('🚀 Starting upload test...');
    
    try {
      const size = 0.5; // 0.5MB test
      const testData = new Uint8Array(size * 1024 * 1024);
      
      // Fill with pattern
      for (let i = 0; i < testData.length; i++) {
        testData[i] = i % 256;
      }
      
      const startTime = performance.now();
      
      const response = await fetch('/api/speed-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: testData,
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        const dataSize = size * 1024 * 1024;
        
        const effectiveDuration = Math.max(duration, 50);
        const speed = (dataSize * 8) / (effectiveDuration / 1000) / 1000000;
        
        addLog(`📊 Upload: ${size}MB in ${duration.toFixed(2)}ms = ${speed.toFixed(2)} Mbps`);
        setResults(prev => ({ ...prev, upload: speed }));
      } else {
        addLog(`❌ Upload test failed: ${response.status}`);
      }
    } catch (error) {
      addLog(`❌ Upload test error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setResults(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Speed Test Fixes Verification</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={testPing}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Ping
        </button>
        <button
          onClick={testDownload}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Download
        </button>
        <button
          onClick={testUpload}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Upload
        </button>
        <button
          onClick={clearLogs}
          disabled={loading}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Clear Logs
        </button>
      </div>

      {results && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.ping && (
              <div>
                <span className="font-medium">Ping:</span> {results.ping.toFixed(2)}ms
              </div>
            )}
            {results.download && (
              <div>
                <span className="font-medium">Download:</span> {results.download.toFixed(2)} Mbps
              </div>
            )}
            {results.upload && (
              <div>
                <span className="font-medium">Upload:</span> {results.upload.toFixed(2)} Mbps
              </div>
            )}
            {results.jitter && (
              <div>
                <span className="font-medium">Jitter:</span> {results.jitter.toFixed(2)}ms
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Test Logs:</h2>
      </div>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500">No logs yet. Run a test to see results.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
