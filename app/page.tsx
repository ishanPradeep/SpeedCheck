'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Wifi, 
  Download, 
  Upload, 
  Timer, 
  MapPin, 
  Globe, 
  History,
  Play,
  RotateCcw,
  Share2,
  Moon,
  Sun,
  TrendingUp,
  Zap,
  Activity,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import SpeedGauge from '@/components/SpeedGauge';
import TestHistory from '@/components/TestHistory';
import NetworkQuality from '@/components/NetworkQuality';
import ShareResults from '@/components/ShareResults';
import { useSpeedTest } from '@/hooks/useSpeedTest';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const {
    isRunning,
    progress,
    results,
    history,
    userInfo,
    networkQuality,
    startTest,
    resetTest,
    refreshHistory
  } = useSpeedTest();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'bg-green-600/20 text-green-300 border-green-500/30';
      case 'A':
        return 'bg-blue-600/20 text-blue-300 border-blue-500/30';
      case 'B':
        return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30';
      case 'C':
        return 'bg-orange-600/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-red-600/20 text-red-300 border-red-500/30';
    }
  };

  const getProgressText = () => {
    if (progress < 10) return 'Preparing test...';
    if (progress < 60) return 'Testing download speed...';
    if (progress < 90) return 'Testing upload speed...';
    return 'Finalizing results...';
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    }`}>
      {/* Enhanced Header */}
      <header className={`border-b backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
        isDarkMode 
          ? 'border-white/10 bg-black/30' 
          : 'border-gray-200 bg-white/30'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Wifi className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-300`} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                  SpeedCheck Pro
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                  Professional Network Analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Enhanced Theme Toggle */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <Sun className={`h-4 w-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className="data-[state=checked]:bg-blue-600 transition-all duration-300"
                />
                <Moon className={`h-4 w-4 transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-gray-400'}`} />
              </div>
              
              {/* Enhanced Location & ISP Info */}
              <div className={`flex items-center space-x-4 text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              } transition-colors duration-300`}>
                <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{userInfo?.city || 'Detecting...'}</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">{userInfo?.isp || 'Detecting ISP...'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="test" className="space-y-8">
          <TabsList className={`grid w-full grid-cols-3 ${
            isDarkMode ? 'bg-white/10' : 'bg-gray-100'
          } backdrop-blur-sm border ${
            isDarkMode ? 'border-white/20' : 'border-gray-200'
          }`}>
            <TabsTrigger 
              value="test" 
              className={`transition-all duration-300 ${
                isDarkMode ? 'data-[state=active]:bg-blue-600 data-[state=active]:text-white' : 'data-[state=active]:bg-blue-500 data-[state=active]:text-white'
              }`}
            >
              <Zap className="h-4 w-4 mr-2" />
              Speed Test
            </TabsTrigger>
            <TabsTrigger 
              value="quality"
              className={`transition-all duration-300 ${
                isDarkMode ? 'data-[state=active]:bg-blue-600 data-[state=active]:text-white' : 'data-[state=active]:bg-blue-500 data-[state=active]:text-white'
              }`}
            >
              <Activity className="h-4 w-4 mr-2" />
              Network Quality
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className={`transition-all duration-300 ${
                isDarkMode ? 'data-[state=active]:bg-blue-600 data-[state=active]:text-white' : 'data-[state=active]:bg-blue-500 data-[state=active]:text-white'
              }`}
            >
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-8">
            {/* Enhanced Main Speed Test */}
            <Card className={`backdrop-blur-md border transition-all duration-300 hover:shadow-xl ${
              isDarkMode 
                ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                : 'bg-white/80 border-gray-200 hover:bg-white/90'
            }`}>
              <CardContent className="p-8">
                <div className="text-center space-y-8">
                  {/* Enhanced Speed Gauges */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Download Speed */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Download className="h-5 w-5 text-green-400" />
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Download
                        </span>
                      </div>
                      <SpeedGauge 
                        value={results.downloadSpeed} 
                        maxValue={1000}
                        color="from-green-400 to-emerald-600"
                        isActive={isRunning && progress >= 10 && progress < 60}
                        isDarkMode={isDarkMode}
                      />
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {results.downloadSpeed.toFixed(2)}
                        </div>
                        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Mbps</div>
                      </div>
                    </div>

                    {/* Upload Speed */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Upload className="h-5 w-5 text-blue-400" />
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Upload
                        </span>
                      </div>
                      <SpeedGauge 
                        value={results.uploadSpeed} 
                        maxValue={500}
                        color="from-blue-400 to-cyan-600"
                        isActive={isRunning && progress >= 60}
                        isDarkMode={isDarkMode}
                      />
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {results.uploadSpeed.toFixed(2)}
                        </div>
                        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Mbps</div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Ping, Jitter and Additional Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                    <div className="text-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Timer className="h-4 w-4 text-yellow-400" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Ping
                        </span>
                      </div>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {results.ping}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ms</div>
                    </div>
                    
                    <div className="text-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Activity className="h-4 w-4 text-purple-400" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Jitter
                        </span>
                      </div>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {results.jitter || 0}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ms</div>
                    </div>
                    
                    <div className="text-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Server
                      </div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {userInfo?.server || 'Auto'}
                      </div>
                    </div>
                    
                    <div className="text-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Grade
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-lg px-3 py-1 border ${getGradeColor(results.grade)}`}
                      >
                        {results.grade || '-'}
                      </Badge>
                    </div>
                  </div>

                  {/* Enhanced Progress Bar */}
                  {isRunning && (
                    <div className="space-y-3">
                      <Progress 
                        value={progress} 
                        className="w-full max-w-md mx-auto h-3"
                      />
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {getProgressText()}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={startTest}
                      disabled={isRunning}
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {isRunning ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Start Test
                        </>
                      )}
                    </Button>
                    
                    {(results.downloadSpeed > 0 || results.uploadSpeed > 0) && !isRunning && (
                      <>
                        <Button
                          onClick={() => setShowShareModal(true)}
                          variant="outline"
                          size="lg"
                          className={`transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            isDarkMode 
                              ? 'border-white/20 text-white hover:bg-white/10' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Share2 className="h-5 w-5 mr-2" />
                          Share
                        </Button>
                        
                        <Button
                          onClick={resetTest}
                          variant="outline"
                          size="lg"
                          className={`transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            isDarkMode 
                              ? 'border-white/20 text-white hover:bg-white/10' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <RotateCcw className="h-5 w-5 mr-2" />
                          Reset
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Enhanced Result Summary */}
                  {!isRunning && (results.downloadSpeed > 0 || results.uploadSpeed > 0) && (
                    <div className={`rounded-lg p-6 border backdrop-blur-sm ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-2xl font-bold text-green-400">
                            {results.downloadSpeed.toFixed(2)}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Download Mbps
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-2xl font-bold text-blue-400">
                            {results.uploadSpeed.toFixed(2)}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Upload Mbps
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-2xl font-bold text-yellow-400">
                            {results.ping}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Ping ms
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-2xl font-bold text-purple-400">
                            {results.jitter || 0}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Jitter ms
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <Badge 
                            variant="secondary" 
                            className={`text-lg px-3 py-1 border ${getGradeColor(results.grade)}`}
                          >
                            {results.grade}
                          </Badge>
                          <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Grade
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quick Tips */}
            <Card className={`backdrop-blur-md border transition-all duration-300 hover:shadow-lg ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                : 'bg-white/60 border-gray-200 hover:bg-white/70'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Info className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Tips for Better Results
                  </h3>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <div className="flex items-start space-x-3 bg-white/5 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>Close other apps and browser tabs before testing</div>
                  </div>
                  <div className="flex items-start space-x-3 bg-white/5 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>Use a wired connection for most accurate results</div>
                  </div>
                  <div className="flex items-start space-x-3 bg-white/5 rounded-lg p-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>Test multiple times throughout the day</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality">
            <NetworkQuality 
              results={results} 
              networkQuality={networkQuality}
              isDarkMode={isDarkMode}
            />
          </TabsContent>

                      <TabsContent value="history">
              <TestHistory
                history={history}
                isDarkMode={isDarkMode}
                onRefresh={refreshHistory}
              />
            </TabsContent>
        </Tabs>
        
        {/* Share Modal */}
        {showShareModal && (
          <ShareResults 
            results={results}
            userInfo={userInfo}
            onClose={() => setShowShareModal(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
}