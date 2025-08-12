'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Upload, 
  Timer, 
  Calendar, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  RotateCcw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TestResult {
  id: string;
  timestamp: Date;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  server: string;
  ip: string;
  grade: string;
}

interface TestHistoryProps {
  history: TestResult[];
  isDarkMode?: boolean;
  onRefresh?: () => void;
}

export default function TestHistory({ history, isDarkMode = true, onRefresh }: TestHistoryProps) {
  const clearHistory = () => {
            if (typeof window !== 'undefined') {
          localStorage.removeItem('speedtest-history');
        }
    window.location.reload();
  };

  if (history.length === 0) {
    return (
      <Card className={`backdrop-blur-md border transition-all duration-300 hover:shadow-lg ${
        isDarkMode 
          ? 'bg-white/10 border-white/20 hover:bg-white/15' 
          : 'bg-white/80 border-gray-200 hover:bg-white/90'
      }`}>
        <CardContent className="p-12 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-white/10' : 'bg-gray-100'
          }`}>
            <Activity className={`h-8 w-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <div className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            No test history yet
          </div>
          <div className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Run your first speed test to see results here
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAverageSpeed = () => {
    const totalDownload = history.reduce((sum, test) => sum + test.downloadSpeed, 0);
    const totalUpload = history.reduce((sum, test) => sum + test.uploadSpeed, 0);
    const totalPing = history.reduce((sum, test) => sum + test.ping, 0);
    return {
              avgDownload: (totalDownload / history.length).toFixed(1),
        avgUpload: (totalUpload / history.length).toFixed(1),
      avgPing: Math.round(totalPing / history.length)
    };
  };

  const getPerformanceTrends = () => {
    if (history.length < 2) return null;
    
    const recentTests = history.slice(0, 3);
    const olderTests = history.slice(-3);
    
    const recentAvgDownload = recentTests.reduce((sum, test) => sum + test.downloadSpeed, 0) / recentTests.length;
    const olderAvgDownload = olderTests.reduce((sum, test) => sum + test.downloadSpeed, 0) / olderTests.length;
    
    const recentAvgUpload = recentTests.reduce((sum, test) => sum + test.uploadSpeed, 0) / recentTests.length;
    const olderAvgUpload = olderTests.reduce((sum, test) => sum + test.uploadSpeed, 0) / olderTests.length;
    
    return {
      downloadTrend: recentAvgDownload > olderAvgDownload ? 'up' : 'down',
      uploadTrend: recentAvgUpload > olderAvgUpload ? 'up' : 'down',
      downloadChange: Math.abs(((recentAvgDownload - olderAvgDownload) / olderAvgDownload) * 100).toFixed(1),
      uploadChange: Math.abs(((recentAvgUpload - olderAvgUpload) / olderAvgUpload) * 100).toFixed(1)
    };
  };

  const getBestTest = () => {
    return history.reduce((best, current) => 
      current.downloadSpeed > best.downloadSpeed ? current : best
    );
  };

  const { avgDownload, avgUpload, avgPing } = getAverageSpeed();
  const trends = getPerformanceTrends();
  const bestTest = getBestTest();

  return (
    <div className="space-y-8">
      {/* Enhanced Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Test History
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {history.length} test{history.length !== 1 ? 's' : ''} completed
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          {onRefresh && (
            <Button 
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className={`border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto`}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
          
          <Button 
            onClick={clearHistory}
            variant="outline"
            size="sm"
            className={`border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto`}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics Summary */}
      <Card className={`backdrop-blur-md border transition-all duration-300 hover:shadow-xl ${
        isDarkMode 
          ? 'bg-white/10 border-white/20 hover:bg-white/15' 
          : 'bg-white/80 border-gray-200 hover:bg-white/90'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <span>Performance Overview</span>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Average performance across all tests
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className={`text-center p-3 sm:p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">{avgDownload}</div>
              <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Avg Download
              </div>
              {trends && (
                <div className="flex items-center justify-center space-x-1">
                  {trends.downloadTrend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {trends.downloadChange}%
                  </span>
                </div>
              )}
            </div>
            
            <div className={`text-center p-3 sm:p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">{avgUpload}</div>
              <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Avg Upload
              </div>
              {trends && (
                <div className="flex items-center justify-center space-x-1">
                  {trends.uploadTrend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {trends.uploadChange}%
                  </span>
                </div>
              )}
            </div>
            
            <div className={`text-center p-3 sm:p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                {history.length}
              </div>
              <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Total Tests
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Last 30 days
              </div>
            </div>
            
            <div className={`text-center p-3 sm:p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">
                {avgPing}
              </div>
              <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Avg Ping
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {avgPing <= 30 ? 'Excellent' : avgPing <= 60 ? 'Good' : avgPing <= 100 ? 'Fair' : 'Poor'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Performance Highlight */}
      {bestTest && (
        <Card className={`backdrop-blur-md border transition-all duration-300 hover:shadow-xl ${
          isDarkMode 
            ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20' 
            : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
        }`}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
              </div>
              <div>
                <h3 className={`text-base sm:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Best Performance
                </h3>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your fastest test result
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">
                                      {bestTest.downloadSpeed.toFixed(1)}
                </div>
                <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Download Mbps
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">
                                      {bestTest.uploadSpeed.toFixed(1)}
                </div>
                <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Upload Mbps
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                  {bestTest.ping.toFixed(1)}
                </div>
                <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ping ms
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Test History List */}
      <div className="space-y-4">
        {history.map((test, index) => (
          <Card 
            key={test.id} 
            className={`backdrop-blur-md border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
              isDarkMode 
                ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                : 'bg-white/80 border-gray-200 hover:bg-white/90'
            }`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Enhanced Test Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                  <div className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg ${
                    isDarkMode ? 'bg-white/5' : 'bg-gray-50'
                  }`}>
                    <Download className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    <div>
                      <div className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {test.downloadSpeed.toFixed(1)}
                      </div>
                      <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Mbps
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg ${
                    isDarkMode ? 'bg-white/5' : 'bg-gray-50'
                  }`}>
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                    <div>
                      <div className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {test.uploadSpeed.toFixed(1)}
                      </div>
                      <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Mbps
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg ${
                    isDarkMode ? 'bg-white/5' : 'bg-gray-50'
                  }`}>
                    <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    <div>
                      <div className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {test.ping.toFixed(1)}
                      </div>
                      <div className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ms
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Test Info */}
                <div className="flex flex-col lg:items-end space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {formatDistanceToNow(test.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Badge 
                      variant="secondary" 
                      className={`border text-xs sm:text-sm ${
                        test.grade === 'A+' ? 'bg-green-600/20 text-green-300 border-green-500/30' :
                        test.grade === 'A' ? 'bg-blue-600/20 text-blue-300 border-blue-500/30' :
                        test.grade === 'B' ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30' :
                        'bg-red-600/20 text-red-300 border-red-500/30'
                      }`}
                    >
                      {test.grade}
                    </Badge>
                    <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {test.server}
                    </span>
                  </div>
                  {test === bestTest && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">Best Result</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}