
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Progress from '@/components/ui/custom-progress';
import { Download, Upload, RefreshCw, Loader2, Activity, Wifi, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isStaticGeneration } from '@/lib/utils';

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
    // Prevent API calls during static generation
    if (isStaticGeneration() || typeof window === 'undefined') {
      console.warn('Cannot fetch network quality data during static generation');
      return;
    }
    
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
    if (!isStaticGeneration() && typeof window !== 'undefined') {
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

  const getQualityColor = (value: number, type: 'ping' | 'jitter' | 'reliability') => {
    if (type === 'ping') {
      if (value <= 30) return 'text-green-400';
      if (value <= 60) return 'text-blue-400';
      if (value <= 100) return 'text-yellow-400';
      return 'text-red-400';
    }
    if (type === 'jitter') {
      if (value <= 5) return 'text-green-400';
      if (value <= 15) return 'text-blue-400';
      if (value <= 30) return 'text-yellow-400';
      return 'text-red-400';
    }
    if (type === 'reliability') {
      if (value >= 90) return 'text-green-400';
      if (value >= 75) return 'text-blue-400';
      if (value >= 60) return 'text-yellow-400';
      return 'text-red-400';
    }
    return 'text-gray-400';
  };

  const getQualityText = (value: number, type: 'ping' | 'jitter' | 'reliability') => {
    if (type === 'ping') {
      if (value <= 30) return 'Excellent';
      if (value <= 60) return 'Good';
      if (value <= 100) return 'Fair';
      return 'Poor';
    }
    if (type === 'jitter') {
      if (value <= 5) return 'Excellent';
      if (value <= 15) return 'Good';
      if (value <= 30) return 'Fair';
      return 'Poor';
    }
    if (type === 'reliability') {
      if (value >= 90) return 'Excellent';
      if (value >= 75) return 'Good';
      if (value >= 60) return 'Fair';
      return 'Poor';
    }
    return 'Unknown';
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Network Quality Section */}
      <Card className={`backdrop-blur-xl border transition-all duration-500 hover:shadow-xl transform hover:scale-[1.01] ${
        isDarkMode 
          ? 'bg-white/10 border-white/20 hover:bg-white/15 shadow-xl' 
          : 'bg-white/90 border-gray-200 hover:bg-white/95 shadow-xl'
      }`}>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className={`p-3 sm:p-4 rounded-xl backdrop-blur-sm border ${
                isDarkMode 
                  ? 'bg-blue-500/20 border-blue-500/30' 
                  : 'bg-blue-100 border-blue-200'
              }`}>
                <Activity className={`h-6 w-6 sm:h-8 sm:w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Network Quality
                </h3>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Real-time network performance metrics
                </p>
              </div>
            </div>
            <Button
              onClick={fetchNetworkData}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className={`transition-all duration-300 transform hover:scale-105 w-full sm:w-auto ${
                isDarkMode 
                  ? 'border-white/20 text-white hover:bg-white/10 backdrop-blur-sm' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2 sm:mr-3" />
              ) : (
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
              )}
              <span className="text-sm sm:text-base">Refresh Data</span>
            </Button>
          </div>
          
          {lastUpdated && (
            <div className={`text-xs sm:text-sm mb-4 sm:mb-6 p-2 sm:p-3 rounded-lg backdrop-blur-sm border ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 text-gray-400' 
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className={`text-center backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white/60 border-gray-200 hover:bg-white/80'
            }`}>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl ${
                  isDarkMode 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'bg-blue-100 border border-blue-200'
                }`}>
                  <Wifi className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                </div>
                <span className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Ping
                </span>
              </div>
              <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 ${getQualityColor(displayData.ping, 'ping')}`}>
                {displayData.ping.toFixed(1)}ms
              </div>
              <Progress 
                value={Math.max(100 - (displayData.ping / 2), 0)} 
                className="h-2 sm:h-3 mb-2 sm:mb-3"
                aria-label="Ping quality indicator"
              />
              <div className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getQualityText(displayData.ping, 'ping')}
              </div>
            </div>
            
            <div className={`text-center backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white/60 border-gray-200 hover:bg-white/80'
            }`}>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl ${
                  isDarkMode 
                    ? 'bg-purple-500/20 border border-purple-500/30' 
                    : 'bg-purple-100 border border-purple-200'
                }`}>
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                </div>
                <span className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Jitter
                </span>
              </div>
              <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 ${getQualityColor(displayData.jitter, 'jitter')}`}>
                {displayData.jitter.toFixed(1)}ms
              </div>
              <Progress 
                value={Math.max(100 - (displayData.jitter * 10), 0)} 
                className="h-2 sm:h-3 mb-2 sm:mb-3"
                aria-label="Jitter quality indicator"
              />
              <div className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getQualityText(displayData.jitter, 'jitter')}
              </div>
            </div>
            
            <div className={`text-center backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white/60 border-gray-200 hover:bg-white/80'
            }`}>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl ${
                  isDarkMode 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-green-100 border border-green-200'
                }`}>
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                </div>
                <span className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Reliability
                </span>
              </div>
              <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 ${getQualityColor(displayData.reliability, 'reliability')}`}>
                {displayData.reliability}%
              </div>
              <Progress 
                value={displayData.reliability} 
                className="h-2 sm:h-3 mb-2 sm:mb-3"
                aria-label="Reliability quality indicator"
              />
              <div className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getQualityText(displayData.reliability, 'reliability')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Speed Metrics Section */}
      <Card className={`backdrop-blur-xl border transition-all duration-500 hover:shadow-xl transform hover:scale-[1.01] ${
        isDarkMode 
          ? 'bg-white/10 border-white/20 hover:bg-white/15 shadow-xl' 
          : 'bg-white/90 border-gray-200 hover:bg-white/95 shadow-xl'
      }`}>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
            <div className={`p-3 sm:p-4 rounded-xl backdrop-blur-sm border ${
              isDarkMode 
                ? 'bg-indigo-500/20 border-indigo-500/30' 
                : 'bg-indigo-100 border-indigo-200'
            }`}>
              <TrendingUp className={`h-6 w-6 sm:h-8 sm:w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h3 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Speed Metrics
              </h3>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Download and upload performance analysis
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Download Speed */}
            <div className={`text-center backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white/60 border-gray-200 hover:bg-white/80'
            }`}>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className={`p-3 sm:p-4 rounded-xl ${
                  isDarkMode 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-green-100 border border-green-200'
                }`}>
                  <Download className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                </div>
                <span className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Download Speed
                </span>
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-400 mb-3 sm:mb-4">
                {displayData.downloadSpeed.toFixed(1)}
              </div>
              <div className={`text-sm sm:text-lg font-medium mb-4 sm:mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Mbps
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Progress 
                  value={Math.min((displayData.downloadSpeed / 100) * 100, 100)} 
                  className="h-3 sm:h-4"
                  aria-label="Download speed indicator"
                />
                <div className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {displayData.downloadSpeed >= 100 ? 'Excellent' : 
                   displayData.downloadSpeed >= 50 ? 'Good' : 
                   displayData.downloadSpeed >= 25 ? 'Fair' : 
                   displayData.downloadSpeed >= 10 ? 'Poor' : 'Very Poor'}
                </div>
              </div>
            </div>
            
            {/* Upload Speed */}
            <div className={`text-center backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white/60 border-gray-200 hover:bg-white/80'
            }`}>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className={`p-3 sm:p-4 rounded-xl ${
                  isDarkMode 
                    ? 'bg-blue-500/20 border border-blue-500/30' 
                    : 'bg-blue-100 border border-blue-200'
                }`}>
                  <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                </div>
                <span className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Upload Speed
                </span>
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-400 mb-3 sm:mb-4">
                {displayData.uploadSpeed.toFixed(1)}
              </div>
              <div className={`text-sm sm:text-lg font-medium mb-4 sm:mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Mbps
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Progress 
                  value={Math.min((displayData.uploadSpeed / 50) * 100, 100)} 
                  className="h-3 sm:h-4"
                  aria-label="Upload speed indicator"
                />
                <div className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {displayData.uploadSpeed >= 50 ? 'Excellent' : 
                   displayData.uploadSpeed >= 25 ? 'Good' : 
                   displayData.uploadSpeed >= 10 ? 'Fair' : 
                   displayData.uploadSpeed >= 5 ? 'Poor' : 'Very Poor'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced API Status Indicator */}
          {apiData && (
            <div className={`mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl text-xs sm:text-sm font-medium backdrop-blur-sm border transition-all duration-300 ${
              apiData.success 
                ? isDarkMode 
                  ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                  : 'bg-green-50 border-green-200 text-green-700'
                : isDarkMode 
                  ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' 
                  : 'bg-yellow-50 border-yellow-200 text-yellow-700'
            }`}>
              <div className="flex items-center space-x-2 sm:space-x-3">
                {apiData.success ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>✓ Real-time data from API</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <span>⚠ Using fallback data (API unavailable)</span>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkQuality;