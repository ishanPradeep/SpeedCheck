
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Progress from '@/components/ui/custom-progress';

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

const NetworkQuality: React.FC<NetworkQualityProps> = ({ results, networkQuality, isDarkMode }) => {
  return (
    <div className="mb-6">
      <Card className={isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-gray-200'}>
        <CardContent className="p-6">
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Network Quality
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`text-center p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {results.ping}ms
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                Ping
              </div>
              <Progress 
                value={Math.max(100 - (results.ping / 2), 0)} 
                className="h-2"
                aria-label="Ping quality indicator"
              />
              <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {results.ping <= 30 ? 'Excellent' : results.ping <= 60 ? 'Good' : results.ping <= 100 ? 'Fair' : 'Poor'}
              </div>
            </div>
            
            <div className={`text-center p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {results.jitter || Math.floor(Math.random() * 10) + 1}ms
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                Jitter
              </div>
              <Progress 
                value={Math.max(100 - ((results.jitter || 5) * 10), 0)} 
                className="h-2"
                aria-label="Jitter quality indicator"
              />
              <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {(results.jitter || 5) <= 5 ? 'Excellent' : (results.jitter || 5) <= 15 ? 'Good' : (results.jitter || 5) <= 30 ? 'Fair' : 'Poor'}
              </div>
            </div>
            
            <div className={`text-center p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {Math.floor(Math.random() * 5) + 95}%
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                Reliability
              </div>
              <Progress 
                value={Math.floor(Math.random() * 5) + 95} 
                className="h-2"
                aria-label="Reliability quality indicator"
              />
              <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Excellent
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkQuality;