
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Progress from '@/components/ui/custom-progress';
import { Download, Upload, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NetworkQualityProps {
  results: {
    downloadSpeed: number;
    uploadSpeed: number;
    ping: number;
    jitter?: number;
    grade: string;
  };
  networkQuality?: {
    stability: number;
    consistency: number;
    reliability: number;
  };
  isDarkMode: boolean;
}

interface ApiNetworkData {
  success: boolean;
  timestamp: number;
  ping: number;
  jitter: number;
  downloadSpeed: number;
  uploadSpeed: number;
  networkQuality: {
    stability: number;
    consistency: number;
    reliability: number;
  };
  server: string;
  location: string;
  error?: string;
}

const NetworkQuality: React.FC<NetworkQualityProps> = ({ results, networkQuality, isDarkMode }) => {
  const [apiData, setApiData] = useState<ApiNetworkData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNetworkData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/network-quality', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setApiData(data);
        setLastUpdated(new Date());
      } else {
        console.error('Failed to fetch network quality data');
      }
    } catch (error) {
      console.error('Error fetching network quality data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data in the browser, not during SSR or static generation
    if (typeof window !== 'undefined') {
      fetchNetworkData();
    }
  }, []);

  // Use API data if available, otherwise fall back to props
  const displayData = {
    ping: apiData?.ping ?? results.ping,
    jitter: apiData?.jitter ?? (results.jitter || 0),
    downloadSpeed: apiData?.downloadSpeed ?? results.downloadSpeed,
    uploadSpeed: apiData?.uploadSpeed ?? results.uploadSpeed,
    stability: apiData?.networkQuality?.stability ?? (networkQuality?.stability || 0),
    consistency: apiData?.networkQuality?.consistency ?? (networkQuality?.consistency || 0),
    reliability: apiData?.networkQuality?.reliability ?? (networkQuality?.reliability || 0)
  };

  return (
    <div className="space-y-6">
      {/* Network Quality Section */}
      <Card className={isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200'}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Network Quality
            </h3>
            <Button
              onClick={fetchNetworkData}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className={`transition-all duration-300 ${
                isDarkMode 
                  ? 'border-white/20 text-white hover:bg-white/10' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
          
          {lastUpdated && (
            <div className={`text-xs mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`text-center p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {displayData.ping}ms
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                Ping
              </div>
              <Progress 
                value={Math.max(100 - (displayData.ping / 2), 0)} 
                className="h-2"
                aria-label="Ping quality indicator"
              />
              <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {displayData.ping <= 30 ? 'Excellent' : displayData.ping <= 60 ? 'Good' : displayData.ping <= 100 ? 'Fair' : 'Poor'}
              </div>
            </div>
            
            <div className={`text-center p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {displayData.jitter}ms
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                Jitter
              </div>
              <Progress 
                value={Math.max(100 - (displayData.jitter * 10), 0)} 
                className="h-2"
                aria-label="Jitter quality indicator"
              />
              <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {displayData.jitter <= 5 ? 'Excellent' : displayData.jitter <= 15 ? 'Good' : displayData.jitter <= 30 ? 'Fair' : 'Poor'}
              </div>
            </div>
            
            <div className={`text-center p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {displayData.reliability}%
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                Reliability
              </div>
              <Progress 
                value={displayData.reliability} 
                className="h-2"
                aria-label="Reliability quality indicator"
              />
              <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {displayData.reliability >= 90 ? 'Excellent' : displayData.reliability >= 75 ? 'Good' : displayData.reliability >= 60 ? 'Fair' : 'Poor'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Others Section - Download & Upload Values */}
      <Card className={isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200'}>
        <CardContent className="p-6">
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Others
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Download Speed */}
            <div className={`text-center p-6 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Download className="h-6 w-6 text-green-400" />
                <span className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Download Speed
                </span>
              </div>
              <div className="text-4xl font-bold text-green-400 mb-2">
                {displayData.downloadSpeed.toFixed(2)}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Mbps
              </div>
              <div className="mt-4">
                <Progress 
                  value={Math.min((displayData.downloadSpeed / 100) * 100, 100)} 
                  className="h-3"
                  aria-label="Download speed indicator"
                />
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {displayData.downloadSpeed >= 100 ? 'Excellent' : 
                   displayData.downloadSpeed >= 50 ? 'Good' : 
                   displayData.downloadSpeed >= 25 ? 'Fair' : 
                   displayData.downloadSpeed >= 10 ? 'Poor' : 'Very Poor'}
                </div>
              </div>
            </div>
            
            {/* Upload Speed */}
            <div className={`text-center p-6 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Upload className="h-6 w-6 text-blue-400" />
                <span className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Upload Speed
                </span>
              </div>
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {displayData.uploadSpeed.toFixed(2)}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Mbps
              </div>
              <div className="mt-4">
                <Progress 
                  value={Math.min((displayData.uploadSpeed / 50) * 100, 100)} 
                  className="h-3"
                  aria-label="Upload speed indicator"
                />
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {displayData.uploadSpeed >= 50 ? 'Excellent' : 
                   displayData.uploadSpeed >= 25 ? 'Good' : 
                   displayData.uploadSpeed >= 10 ? 'Fair' : 
                   displayData.uploadSpeed >= 5 ? 'Poor' : 'Very Poor'}
                </div>
              </div>
            </div>
          </div>
          
          {/* API Status Indicator */}
          {apiData && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              apiData.success 
                ? isDarkMode ? 'bg-green-900/20 border-green-500/30 text-green-300' : 'bg-green-50 border-green-200 text-green-700'
                : isDarkMode ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
            } border`}>
              {apiData.success ? (
                <span>✓ Real-time data from API</span>
              ) : (
                <span>⚠ Using fallback data (API unavailable)</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkQuality;