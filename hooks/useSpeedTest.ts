'use client';

import { useState, useEffect, useCallback } from 'react';
import config from '@/lib/config';
import { isBrowser, isStaticGeneration } from '@/lib/utils';

interface TestResult {
  id: string;
  timestamp: Date;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter?: number;
  server: string;
  ip: string;
  grade: string;
}

interface UserInfo {
  ip: string;
  city: string;
  country: string;
  isp: string;
  server: string;
}

interface SpeedTestResults {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter?: number;
  grade: string;
}

interface NetworkQuality {
  stability: number;
  consistency: number;
  reliability: number;
}

export function useSpeedTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SpeedTestResults>({
    downloadSpeed: 0,
    uploadSpeed: 0,
    ping: 0,
    jitter: 0,
    grade: '',
  });
  const [history, setHistory] = useState<TestResult[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>({
    stability: 0,
    consistency: 0,
    reliability: 0,
  });

  // Load history and user info on mount
  useEffect(() => {
    // Only run in the browser, not during SSR or static generation
    if (isBrowser()) {
      console.log('Component mounted, loading history and user info...');
      loadHistory();
      detectUserInfo();
    }
  }, []);

  // Add a separate effect to handle history updates
  useEffect(() => {
    // Only run in the browser, not during SSR or static generation
    if (isStaticGeneration()) {
      return;
    }
    
    // This will run whenever the component mounts or when we need to refresh history
    const handleStorageChange = () => {
      loadHistory();
    };

    // Listen for storage events (in case data is modified from another tab)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Debug effect to log history changes
  useEffect(() => {
    // Only run in the browser, not during SSR or static generation
    if (isStaticGeneration()) {
      return;
    }
    
    console.log(`History state updated: ${history.length} items`);
    if (history.length > 0) {
      console.log('First history item:', history[0]);
    }
  }, [history]);

  const loadHistory = useCallback(() => {
    if (isBrowser()) {
      try {
        const saved = localStorage.getItem('speedtest-history');
        if (saved) {
          const parsed = JSON.parse(saved);
          
          // Validate that parsed data is an array
          if (!Array.isArray(parsed)) {
            console.warn('History data is not an array, clearing invalid data');
            localStorage.removeItem('speedtest-history');
            setHistory([]);
            return;
          }

          // Map and validate each item
          const validHistory = parsed
            .filter((item: any) => {
              // Check if item has required properties
              return item && 
                     typeof item.id === 'string' &&
                     typeof item.downloadSpeed === 'number' &&
                     typeof item.uploadSpeed === 'number' &&
                     typeof item.ping === 'number' &&
                     item.timestamp;
            })
            .map((item: any) => ({
              ...item,
              timestamp: new Date(item.timestamp),
              // Ensure all required fields are present
              id: item.id || Date.now().toString(),
              downloadSpeed: Number(item.downloadSpeed) || 0,
              uploadSpeed: Number(item.uploadSpeed) || 0,
              ping: Number(item.ping) || 0,
              jitter: Number(item.jitter) || 0,
              server: item.server || 'Auto',
              ip: item.ip || '',
              grade: item.grade || 'F'
            }))
            .sort((a: TestResult, b: TestResult) => 
              b.timestamp.getTime() - a.timestamp.getTime()
            );

          console.log(`Loaded ${validHistory.length} history items`);
          setHistory(validHistory);
        } else {
          console.log('No history data found in localStorage');
          setHistory([]);
        }
      } catch (error) {
        console.error('Failed to load history:', error);
        // Clear corrupted data
          if (isBrowser()) {
          localStorage.removeItem('speedtest-history');
        }
        setHistory([]);
      }
    }
  }, []);



  const saveToHistory = useCallback((result: TestResult) => {
    if (isBrowser()) {
      try {
        // Ensure the result has all required fields
        const validResult: TestResult = {
          id: result.id || Date.now().toString(),
          timestamp: result.timestamp || new Date(),
          downloadSpeed: Number(result.downloadSpeed) || 0,
          uploadSpeed: Number(result.uploadSpeed) || 0,
          ping: Number(result.ping) || 0,
          jitter: Number(result.jitter) || 0,
          server: result.server || 'Auto',
          ip: result.ip || '',
          grade: result.grade || 'F'
        };

  const historyLimit = config.app.historyLimit;
  const newHistory = [validResult, ...history].slice(0, historyLimit); // Configurable history limit
        setHistory(newHistory);
        
        // Save to localStorage
        localStorage.setItem('speedtest-history', JSON.stringify(newHistory));
        console.log(`Saved test result to history. Total items: ${newHistory.length}`);
      } catch (error) {
        console.error('Failed to save to history:', error);
        // Try to save just the current result if the full history fails
        try {
            if (isBrowser()) {
            localStorage.setItem('speedtest-history', JSON.stringify([result]));
          }
          console.log('Saved single test result as fallback');
        } catch (fallbackError) {
          console.error('Failed to save even single result:', fallbackError);
        }
      }
    }
  }, [history]);

  const detectUserInfo = async () => {
    // Prevent API calls during static generation
    if (isStaticGeneration()) {
      return;
    }
    
    try {
      let info: UserInfo = {
        ip: 'Detecting...',
        city: 'Detecting...',
        country: 'Detecting...',
        isp: 'Detecting...',
        server: 'Auto Select',
      };

        // Try multiple IP detection services for better reliability
        const services = [
          'https://ipapi.co/json/',
          'https://api.ipify.org?format=json',
          'https://api.myip.com',
          'https://ipinfo.io/json',
          'https://api.ipgeolocation.io/getip',
          'https://api.ip.sb/geoip'
        ];

        for (const service of services) {
          try {
            const response = await fetch(service, { 
              method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(5000) // 5 second timeout per service
            });
            
            if (response.ok) {
              const data = await response.json();
              
              if (service.includes('ipapi.co')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: data.city || 'Unknown',
                  country: data.country_name || 'Unknown',
                  isp: data.org || 'Unknown ISP',
                  server: `${data.city || 'Auto'} (${data.country_code || 'XX'})`,
                };
              } else if (service.includes('ipify')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: 'Detecting...',
                  country: 'Detecting...',
                  isp: 'Detecting...',
                  server: 'Auto Select',
                };
              } else if (service.includes('myip.com')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: data.city || 'Unknown',
                  country: data.country || 'Unknown',
                  isp: data.isp || 'Unknown ISP',
                  server: `${data.city || 'Auto'} (${data.country_code || 'XX'})`,
                };
              } else if (service.includes('ipinfo.io')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: data.city || 'Unknown',
                  country: data.country || 'Unknown',
                  isp: data.org || 'Unknown ISP',
                  server: `${data.city || 'Auto'} (${data.country || 'XX'})`,
                };
              } else if (service.includes('ipgeolocation.io')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: data.city || 'Unknown',
                  country: data.country_name || 'Unknown',
                  isp: data.isp || 'Unknown ISP',
                  server: `${data.city || 'Auto'} (${data.country_code2 || 'XX'})`,
                };
              } else if (service.includes('ip.sb')) {
                info = {
                  ip: data.ip || 'Unknown',
                  city: data.city || 'Unknown',
                  country: data.country || 'Unknown',
                  isp: data.isp || 'Unknown ISP',
                  server: `${data.city || 'Auto'} (${data.country_code || 'XX'})`,
                };
              }
              
              if (info.ip !== 'Unknown') break;
            }
          } catch (serviceError) {
            console.log(`Service ${service} failed, trying next...`);
            continue;
          }
        }

      // Simple, honest fallback if all services fail
        if (info.ip === 'Unknown' || info.ip === 'Detecting...') {
          info = {
          ip: 'Unable to detect',
          city: 'Location unavailable',
          country: 'Unknown',
          isp: 'ISP unavailable',
          server: 'Auto Select',
        };
      }
      
      setUserInfo(info);
    } catch (error) {
      console.error('Failed to detect user info:', error);
      // Set honest fallback on complete failure
      setUserInfo({
        ip: 'Detection failed',
        city: 'Location unavailable',
        country: 'Unknown',
        isp: 'ISP unavailable',
        server: 'Auto Select',
      });
    }
  };

  const measurePing = async (): Promise<number> => {
    // Prevent API calls during static generation
    if (isStaticGeneration()) {
      throw new Error('Cannot run speed test during static generation');
    }
    
    const measurements: number[] = [];
    const countPing = config.test.pingCount;
    
    console.log('🚀 Starting ping test (librespeed-style)...');
    console.log(`📊 Ping count: ${countPing}`);
    
    // Take multiple ping measurements to our own API for accuracy
    for (let i = 0; i < countPing; i++) {
      const startTime = performance.now();
      
      try {
        const response = await fetch('/api/ping', { 
          method: 'GET', 
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
      
        if (response.ok) {
          const endTime = performance.now();
          let pingTime = endTime - startTime;
          
          // Try to use Performance API for more accurate timing (like librespeed)
          try {
            const entries = performance.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry && lastEntry.entryType === 'resource') {
              const resourceEntry = lastEntry as PerformanceResourceTiming;
              if (resourceEntry.responseStart && resourceEntry.requestStart) {
                const perfPing = resourceEntry.responseStart - resourceEntry.requestStart;
                if (perfPing > 0 && perfPing < pingTime) {
                  pingTime = perfPing;
                  console.log(`📊 Ping test ${i + 1}: ${pingTime.toFixed(2)}ms (Performance API)`);
                } else {
                  console.log(`📊 Ping test ${i + 1}: ${pingTime.toFixed(2)}ms (fallback)`);
                }
              } else {
                console.log(`📊 Ping test ${i + 1}: ${pingTime.toFixed(2)}ms`);
              }
            } else {
              console.log(`📊 Ping test ${i + 1}: ${pingTime.toFixed(2)}ms`);
            }
          } catch (e) {
            console.log(`📊 Ping test ${i + 1}: ${pingTime.toFixed(2)}ms (Performance API not available)`);
          }
          
          // Librespeed-style minimum ping handling
          if (pingTime < 1) pingTime = 1;
          measurements.push(pingTime);
        } else {
          console.error(`Ping test ${i + 1} failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Ping test ${i + 1} failed:`, error);
        // Continue with next test
      }
      
      // Small delay between measurements
      if (i < countPing - 1) await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (measurements.length === 0) {
      console.warn('All ping tests failed');
      throw new Error('Ping test failed - no successful measurements');
    }
    
    // Librespeed-style ping calculation: use the minimum ping
    const minPing = Math.min(...measurements);
    const avgPing = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    
    console.log(`📊 Ping results: min=${minPing.toFixed(2)}ms, avg=${avgPing.toFixed(2)}ms (from ${measurements.length} measurements)`);
    console.log(`📊 Using minimum ping: ${minPing.toFixed(2)}ms (librespeed-style)`);
    
    return Math.max(minPing, config.speedTest.minPing); // Minimum ping from config
  };

  const measureJitter = async (): Promise<number> => {
    // Prevent API calls during static generation
    if (isStaticGeneration()) {
      throw new Error('Cannot run speed test during static generation');
    }
    
    const measurements: number[] = [];
    const countPing = config.test.jitterCount;
    
    console.log('🚀 Starting jitter test (librespeed-style)...');
    console.log(`📊 Jitter ping count: ${countPing}`);
    
    // Take multiple measurements for jitter calculation
    for (let i = 0; i < countPing; i++) {
      const startTime = performance.now();
      
      try {
        const response = await fetch('/api/ping', { 
          method: 'GET', 
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          signal: AbortSignal.timeout(2000) // 2 second timeout
        });
      
        if (response.ok) {
          const endTime = performance.now();
          let pingTime = endTime - startTime;
          
          // Try to use Performance API for more accurate timing
          try {
            const entries = performance.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry && lastEntry.entryType === 'resource') {
              const resourceEntry = lastEntry as PerformanceResourceTiming;
              if (resourceEntry.responseStart && resourceEntry.requestStart) {
                const perfPing = resourceEntry.responseStart - resourceEntry.requestStart;
                if (perfPing > 0 && perfPing < pingTime) {
                  pingTime = perfPing;
                }
              }
            }
          } catch (e) {
            // Performance API not available, use fallback
          }
          
          // Librespeed-style minimum ping handling
          if (pingTime < 1) pingTime = 1;
          measurements.push(pingTime);
        } else {
          console.error(`Jitter test ${i + 1} failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Jitter test ${i + 1} failed:`, error);
        // Continue with next test
      }
      
      // Small delay between measurements
      if (i < countPing - 1) await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    if (measurements.length === 0) {
      console.warn('All jitter tests failed');
      throw new Error('Jitter test failed - no successful measurements');
    }
    
    // Librespeed-style jitter calculation: weighted average of jitter measurements
    let jitter = 0;
    let prevPing = measurements[0];
    
    for (let i = 1; i < measurements.length; i++) {
      const currentPing = measurements[i];
      const instJitter = Math.abs(currentPing - prevPing);
      
      if (i === 1) {
        jitter = instJitter; // First jitter measurement
      } else {
        // Librespeed-style weighted average: spikes get more weight
        jitter = instJitter > jitter ? jitter * 0.3 + instJitter * 0.7 : jitter * 0.8 + instJitter * 0.2;
      }
      
      prevPing = currentPing;
    }
    
    console.log(`📊 Jitter calculation: ${jitter.toFixed(2)}ms (from ${measurements.length} measurements, librespeed-style)`);
    return Math.max(jitter, config.speedTest.minJitter); // Minimum jitter from config
  };

  const measureDownloadSpeed = async (onProgress: (progress: number) => void): Promise<number> => {
    // Prevent API calls during static generation
    if (isStaticGeneration()) {
      throw new Error('Cannot run speed test during static generation');
    }
    
    const testSizes = config.speedTest.sizes;
    const individualSpeeds: number[] = [];
    let successfulTests = 0;
    
    // Librespeed settings from config
    const overheadCompensationFactor = config.performance.overheadCompensation;
    const graceTime = config.performance.graceTimeDownload;
    const testDuration = 15; // 15 seconds max test duration like librespeed
    
    console.log('🚀 Starting download speed test (librespeed-style)...');
    console.log(`📊 Test sizes: ${testSizes.join(', ')} MB`);
    console.log(`⚙️  Overhead compensation: ${overheadCompensationFactor}`);
    console.log(`⏱️  Grace time: ${graceTime}s`);
    
    for (let i = 0; i < testSizes.length; i++) {
      const size = testSizes[i];
      const sizeInBytes = size * 1024 * 1024;
      onProgress((i / testSizes.length) * 100);
      
      console.log(`\n📥 Download test ${i + 1}/${testSizes.length}: ${size}MB (${sizeInBytes} bytes)`);
      
      try {
        // Use high-precision timing with performance.now()
        const startTime = performance.now();
        console.log(`⏱️  Starting request at ${new Date().toISOString()}`);
        
        const response = await fetch('/api/speed-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Test-Id': `download-${Date.now()}-${i}`,
          },
          body: JSON.stringify({
            type: 'download',
            size: sizeInBytes
          }),
          signal: AbortSignal.timeout(30000) // 30 second timeout for large files
        });
        
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          console.log(`📥 Starting to read response data...`);
          const dataStartTime = performance.now();
          
          // Read the data (this is part of the network transfer)
          const data = await response.arrayBuffer();
          const dataEndTime = performance.now();
          
          const endTime = performance.now();
          const totalDuration = endTime - startTime;
          const dataReadDuration = dataEndTime - dataStartTime;
          const dataSize = data.byteLength;
          
          console.log(`📊 Data received: ${dataSize} bytes`);
          console.log(`⏱️  Total duration: ${totalDuration.toFixed(2)}ms`);
          console.log(`⏱️  Data read duration: ${dataReadDuration.toFixed(2)}ms`);
          
          // Verify data size matches expected size
          const expectedSize = sizeInBytes;
          const sizeDifference = Math.abs(dataSize - expectedSize);
          const sizeAccuracy = ((expectedSize - sizeDifference) / expectedSize) * 100;
          
          console.log(`📏 Expected size: ${expectedSize} bytes`);
          console.log(`📏 Actual size: ${dataSize} bytes`);
          console.log(`📏 Size accuracy: ${sizeAccuracy.toFixed(2)}%`);
          
          if (sizeAccuracy < 95) {
            console.warn(`⚠️  Size mismatch detected! Expected: ${expectedSize}, Got: ${dataSize}`);
          }
          
          // Use actual data transfer time for more accurate speed calculation
          const effectiveDuration = Math.max(dataReadDuration, 50); // Use data read time, minimum 50ms
          
          // Accurate speed calculation based on actual transfer time
          const rawSpeed = (dataSize * 8) / (effectiveDuration / 1000); // bits per second
          const speed = rawSpeed / 1000000; // Mbps (no overhead compensation for accuracy)
          
          individualSpeeds.push(speed);
          successfulTests++;
          
          console.log(`✅ Download test ${i + 1}: ${size}MB in ${totalDuration.toFixed(2)}ms = ${speed.toFixed(2)} Mbps`);
          console.log(`📈 Speed calculation: (${dataSize} bytes × 8 bits) ÷ (${effectiveDuration.toFixed(2)}ms ÷ 1000) ÷ 1,000,000 = ${speed.toFixed(2)} Mbps`);
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`Download test ${i} failed:`, error);
        // Continue with next test
      }
    }
    
    if (successfulTests === 0) {
      console.warn('All download tests failed');
      throw new Error('Download test failed - no successful measurements');
    }
    
    // Calculate more realistic speed (weighted average, excluding outliers)
    const sortedSpeeds = individualSpeeds.sort((a, b) => a - b);
    const middleSpeeds = sortedSpeeds.slice(1, -1); // Remove highest and lowest
    const finalSpeed = middleSpeeds.length > 0 
      ? middleSpeeds.reduce((a, b) => a + b, 0) / middleSpeeds.length
      : individualSpeeds.reduce((a, b) => a + b, 0) / individualSpeeds.length;
    
    console.log(`📊 Individual speeds: ${individualSpeeds.map(s => s.toFixed(2)).join(', ')} Mbps`);
    console.log(`📊 Final download speed (excluding outliers): ${finalSpeed.toFixed(2)} Mbps`);
    return finalSpeed;
  };

  const measureUploadSpeed = async (onProgress: (progress: number) => void): Promise<number> => {
    // Prevent API calls during static generation
    if (isStaticGeneration()) {
      throw new Error('Cannot run speed test during static generation');
    }
    
    const testSizes = config.test.uploadSizes;
    const individualSpeeds: number[] = [];
    let successfulTests = 0;
    
    // Librespeed settings from config
    const overheadCompensationFactor = config.performance.overheadCompensation;
    const graceTime = config.performance.graceTimeUpload;
    
    console.log('🚀 Starting upload speed test (librespeed-style)...');
    console.log(`⚙️  Overhead compensation: ${overheadCompensationFactor}`);
    console.log(`⏱️  Grace time: ${graceTime}s`);
    
    for (let i = 0; i < testSizes.length; i++) {
      const size = testSizes[i];
      onProgress((i / testSizes.length) * 100);
      
      try {
        // Generate test data to upload more efficiently
        const testData = new Uint8Array(size * 1024 * 1024);
        const pattern = new Uint8Array(1024); // 1KB pattern for faster generation
        
        // Generate random pattern once
        for (let j = 0; j < pattern.length; j++) {
          pattern[j] = Math.floor(Math.random() * 256);
        }
        
        // Fill the data array with the pattern
        for (let j = 0; j < testData.length; j++) {
          testData[j] = pattern[j % pattern.length];
        }
        
        // Use high-precision timing with performance.now()
        const startTime = performance.now();
        console.log(`📤 Upload test ${i + 1}: Starting ${size}MB upload...`);
        
        const response = await fetch('/api/speed-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Test-Id': `upload-${Date.now()}-${i}`,
          },
          body: testData,
          signal: AbortSignal.timeout(30000) // 30 second timeout for large files
        });
        
        if (response.ok) {
          const endTime = performance.now();
          const duration = endTime - startTime;
          const dataSize = size * 1024 * 1024; // bytes
          
          console.log(`📊 Upload test ${i + 1}: ${size}MB in ${duration.toFixed(2)}ms`);
          
          // Use actual transfer time for accurate speed calculation
          const effectiveDuration = Math.max(duration, 50); // Use actual duration, minimum 50ms
          
          // Accurate speed calculation based on actual transfer time
          const rawSpeed = (dataSize * 8) / (effectiveDuration / 1000); // bits per second
          const speed = rawSpeed / 1000000; // Mbps (no overhead compensation for accuracy)
          
          individualSpeeds.push(speed);
          successfulTests++;
          
          console.log(`✅ Upload test ${i + 1}: ${size}MB in ${duration.toFixed(2)}ms = ${speed.toFixed(2)} Mbps`);
          console.log(`📈 Speed calculation: (${dataSize} bytes × 8 bits) ÷ (${effectiveDuration.toFixed(2)}ms ÷ 1000) ÷ 1,000,000 = ${speed.toFixed(2)} Mbps`);
        } else {
          console.error(`Upload test ${i + 1} failed with status: ${response.status}`);
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`Upload test ${i} failed:`, error);
        // Continue with next test
      }
    }
    
    if (successfulTests === 0) {
      console.warn('All upload tests failed');
      throw new Error('Upload test failed - no successful measurements');
    }
    
    // Calculate more realistic speed (weighted average, excluding outliers)
    const sortedSpeeds = individualSpeeds.sort((a, b) => a - b);
    const middleSpeeds = sortedSpeeds.slice(1, -1); // Remove highest and lowest
    const finalSpeed = middleSpeeds.length > 0 
      ? middleSpeeds.reduce((a, b) => a + b, 0) / middleSpeeds.length
      : individualSpeeds.reduce((a, b) => a + b, 0) / individualSpeeds.length;
    
    console.log(`📊 Individual speeds: ${individualSpeeds.map(s => s.toFixed(2)).join(', ')} Mbps`);
    console.log(`📊 Final upload speed (excluding outliers): ${finalSpeed.toFixed(2)} Mbps`);
    return finalSpeed;
  };

  const measureNetworkQuality = (downloadSpeed: number, uploadSpeed: number, ping: number, jitter: number) => {
    // Calculate stability based on jitter (lower jitter = higher stability)
    const stability = Math.max(100 - (jitter * 2), 0);
    
    // Calculate consistency based on upload/download ratio
    const speedRatio = uploadSpeed / downloadSpeed;
    const consistency = Math.min(speedRatio * 100, 100);
    
    // Calculate reliability based on ping (lower ping = higher reliability)
    const reliability = Math.max(100 - (ping / 5), 0);
    
    setNetworkQuality({
      stability: Math.round(stability),
      consistency: Math.round(consistency),
      reliability: Math.round(reliability)
    });
  };

  const calculateGrade = (download: number, upload: number, ping: number): string => {
    const avgSpeed = (download + upload) / 2;
    
    // More realistic grading based on typical internet speeds
    if (avgSpeed >= 100 && ping <= 50) return 'A+';
    if (avgSpeed >= 50 && ping <= 100) return 'A';
    if (avgSpeed >= 25 && ping <= 150) return 'B';
    if (avgSpeed >= 10 && ping <= 200) return 'C';
    if (avgSpeed >= 5 && ping <= 300) return 'D';
    if (avgSpeed >= 1 && ping <= 500) return 'E';
    return 'F';
  };

  const startTest = useCallback(async () => {
    // Prevent API calls during static generation
    if (isStaticGeneration()) {
      console.warn('Cannot run speed test during static generation');
      return;
    }
    
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    setResults({
      downloadSpeed: 0,
      uploadSpeed: 0,
      ping: 0,
      jitter: 0,
      grade: '',
    });

    try {
      // Step 1: Measure Ping
      setProgress(5);
      const ping = await measurePing();
      setResults(prev => ({ ...prev, ping }));
      
      // Step 2: Measure Jitter
      setProgress(15);
      const jitter = await measureJitter();
      setResults(prev => ({ ...prev, jitter }));
      
      // Step 3: Test Download Speed
      setProgress(25);
      const downloadSpeed = await measureDownloadSpeed((p) => {
        setProgress(25 + (p / 100) * 40);
      });
      
      setResults(prev => ({ ...prev, downloadSpeed }));
      setProgress(65);
      
      // Step 4: Test Upload Speed
      const uploadSpeed = await measureUploadSpeed((p) => {
        setProgress(65 + (p / 100) * 25);
      });
      
      setResults(prev => ({ ...prev, uploadSpeed }));
      setProgress(90);
      
      // Step 5: Calculate Grade
      const grade = calculateGrade(downloadSpeed, uploadSpeed, ping);
      const finalResults = {
        downloadSpeed,
        uploadSpeed,
        ping,
        jitter,
        grade,
      };
      
      setResults(finalResults);
      setProgress(100);
      
      // Calculate network quality
      measureNetworkQuality(downloadSpeed, uploadSpeed, ping, jitter);
      
      // Save to history
      const testResult: TestResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...finalResults,
        server: userInfo?.server || 'Auto',
        ip: userInfo?.ip || '',
      };
      
      saveToHistory(testResult);
      
    } catch (error) {
      console.error('Speed test failed:', error);
    } finally {
      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
      }, 1000);
    }
  }, [isRunning, userInfo, measureUploadSpeed, saveToHistory]);

  const resetTest = () => {
    setResults({
      downloadSpeed: 0,
      uploadSpeed: 0,
      ping: 0,
      jitter: 0,
      grade: '',
    });
    setProgress(0);
  };

  const refreshHistory = () => {
    console.log('Manually refreshing history...');
    loadHistory();
  };

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (isBrowser()) {
      localStorage.removeItem('speedtest-history');
    }
  }, []);

  const saveResult = useCallback((result: TestResult) => {
    if (isBrowser()) {
      try {
        // Save to localStorage
        const newHistory = [result, ...history];
        localStorage.setItem('speedtest-history', JSON.stringify(newHistory));
        setHistory(newHistory);
      } catch (error) {
        console.error('Error saving result:', error);
        // Fallback: save only the new result
        if (isBrowser()) {
          localStorage.setItem('speedtest-history', JSON.stringify([result]));
        }
      }
    }
  }, [history]);


  return {
    isRunning,
    progress,
    results,
    history,
    userInfo,
    networkQuality,
    startTest,
    resetTest,
    refreshHistory,
  };
}