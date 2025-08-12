'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Progress from '@/components/ui/custom-progress';
import { Switch } from '@/components/ui/switch';
import { isStaticGeneration } from '@/lib/utils';
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
  AlertCircle,
  Sparkles,
  BarChart3,
  Gauge,
  WifiOff,
  WifiIcon
} from 'lucide-react';
import SpeedGauge from '@/components/SpeedGauge';
import TestHistory from '@/components/TestHistory';
import NetworkQuality from '@/components/NetworkQuality';
import ShareResults from '@/components/ShareResults';
import { useSpeedTest } from '@/hooks/useSpeedTest';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
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
    // Only run in the browser, not during SSR or static generation
    if (isStaticGeneration()) {
      return;
    }
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/50 shadow-green-500/25';
      case 'A':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/50 shadow-blue-500/25';
      case 'B':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/50 shadow-yellow-500/25';
      case 'C':
        return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/50 shadow-orange-500/25';
      default:
        return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/50 shadow-red-500/25';
    }
  };

  const getProgressText = () => {
    if (progress < 10) return 'Initializing test environment...';
    if (progress < 30) return 'Measuring ping and jitter...';
    if (progress < 60) return 'Testing download speed...';
    if (progress < 90) return 'Testing upload speed...';
    return 'Calculating final results...';
  };

  const getConnectionStatus = () => {
    if (!isOnline) return { text: 'Offline', icon: WifiOff, color: 'text-red-400' };
    if (results.ping < 20) return { text: 'Excellent', icon: Sparkles, color: 'text-green-400' };
    if (results.ping < 50) return { text: 'Good', icon: WifiIcon, color: 'text-blue-400' };
    if (results.ping < 100) return { text: 'Fair', icon: Wifi, color: 'text-yellow-400' };
    return { text: 'Poor', icon: WifiOff, color: 'text-red-400' };
  };

  const connectionStatus = getConnectionStatus();
  const StatusIcon = connectionStatus.icon;

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    }`}>
      {/* Enhanced Header with Connection Status */}
      <header className={`border-b backdrop-blur-xl sticky top-0 z-50 transition-all duration-500 ${
        isDarkMode 
          ? 'border-white/10 bg-black/40 shadow-2xl' 
          : 'border-gray-200 bg-white/80 shadow-lg'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 group-hover:bg-white/20' 
                    : 'bg-white/60 border-gray-200 group-hover:bg-white/80'
                }`}>
                <Wifi className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors duration-300`} />
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse shadow-lg ${
                    isOnline ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r ${
                  isDarkMode 
                    ? 'from-blue-400 to-cyan-400' 
                    : 'from-blue-600 to-cyan-600'
                } bg-clip-text text-transparent transition-all duration-300`}>
                  SpeedCheck Pro
                </h1>
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`h-4 w-4 ${connectionStatus.color}`} />
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                    {connectionStatus.text} Connection
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Enhanced Theme Toggle */}
              <div className={`flex items-center space-x-2 backdrop-blur-sm rounded-xl p-2 border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                  : 'bg-white/60 border-gray-200 hover:bg-white/80'
              }`}>
                <Sun className={`h-4 w-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-cyan-600 transition-all duration-300"
                />
                <Moon className={`h-4 w-4 transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-gray-400'}`} />
              </div>
              
              {/* Enhanced Location & ISP Info */}
              <div className={`flex items-center space-x-4 text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              } transition-colors duration-300`}>
                <div className={`flex items-center space-x-2 backdrop-blur-sm rounded-xl px-4 py-2 border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                    : 'bg-white/60 border-gray-200 hover:bg-white/80'
                }`}>
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{userInfo?.city || 'Detecting...'}</span>
                </div>
                <div className={`flex items-center space-x-2 backdrop-blur-sm rounded-xl px-4 py-2 border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                    : 'bg-white/60 border-gray-200 hover:bg-white/80'
                }`}>
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
          <TabsList className={`grid w-full grid-cols-3 backdrop-blur-xl border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <TabsTrigger 
              value="test" 
              className={`transition-all duration-300 font-medium ${
                isDarkMode 
                  ? 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white' 
                  : 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white'
              }`}
            >
              <Zap className="h-4 w-4 mr-2" />
              Speed Test
            </TabsTrigger>
            <TabsTrigger 
              value="quality"
              className={`transition-all duration-300 font-medium ${
                isDarkMode 
                  ? 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white' 
                  : 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white'
              }`}
            >
              <Activity className="h-4 w-4 mr-2" />
              Network Quality
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className={`transition-all duration-300 font-medium ${
                isDarkMode 
                  ? 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white' 
                  : 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white'
              }`}
            >
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-8">
            {/* Enhanced Main Speed Test */}
            <Card className={`backdrop-blur-xl border transition-all duration-500 hover:shadow-2xl transform hover:scale-[1.02] ${
              isDarkMode 
                ? 'bg-white/10 border-white/20 hover:bg-white/15 shadow-xl' 
                : 'bg-white/90 border-gray-200 hover:bg-white/95 shadow-xl'
            }`}>
              <CardContent className="p-8">
                <div className="text-center space-y-8">
                  {/* Enhanced Speed Gauges */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Download Speed */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-center space-x-3">
                        <div className={`p-3 rounded-xl backdrop-blur-sm border ${
                          isDarkMode 
                            ? 'bg-green-500/20 border-green-500/30' 
                            : 'bg-green-100 border-green-200'
                        }`}>
                          <Download className="h-6 w-6 text-green-400" />
                        </div>
                        <span className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Download Speed
                        </span>
                      </div>
                      <SpeedGauge 
                        value={results.downloadSpeed} 
                        maxValue={1000}
                        color="from-green-400 to-emerald-600"
                        isActive={isRunning && progress >= 30 && progress < 60}
                        isDarkMode={isDarkMode}
                      />
                      <div className="text-center">
                        <div className={`text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent`}>
                          {results.downloadSpeed.toFixed(1)}
                        </div>
                        <div className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mbps</div>
                      </div>
                    </div>

                    {/* Upload Speed */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-center space-x-3">
                        <div className={`p-3 rounded-xl backdrop-blur-sm border ${
                          isDarkMode 
                            ? 'bg-blue-500/20 border-blue-500/30' 
                            : 'bg-blue-100 border-blue-200'
                        }`}>
                          <Upload className="h-6 w-6 text-blue-400" />
                        </div>
                        <span className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Upload Speed
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
                        <div className={`text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent`}>
                          {results.uploadSpeed.toFixed(1)}
                        </div>
                        <div className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mbps</div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Ping, Jitter and Additional Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                    <div className={`text-center backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                        : 'bg-white/60 border-gray-200 hover:bg-white/80'
                    }`}>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <div className={`p-2 rounded-lg ${
                          isDarkMode 
                            ? 'bg-yellow-500/20 border border-yellow-500/30' 
                            : 'bg-yellow-100 border border-yellow-200'
                        }`}>
                        <Timer className="h-4 w-4 text-yellow-400" />
                        </div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Ping
                        </span>
                      </div>
                      <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {results.ping.toFixed(1)}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ms</div>
                    </div>
                    
                    <div className={`text-center backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                        : 'bg-white/60 border-gray-200 hover:bg-white/80'
                    }`}>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <div className={`p-2 rounded-lg ${
                          isDarkMode 
                            ? 'bg-purple-500/20 border border-purple-500/30' 
                            : 'bg-purple-100 border border-purple-200'
                        }`}>
                        <Activity className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Jitter
                        </span>
                      </div>
                      <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {(results.jitter || 0).toFixed(1)}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ms</div>
                    </div>
                    
                    <div className={`text-center backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                        : 'bg-white/60 border-gray-200 hover:bg-white/80'
                    }`}>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <div className={`p-2 rounded-lg ${
                          isDarkMode 
                            ? 'bg-indigo-500/20 border border-indigo-500/30' 
                            : 'bg-indigo-100 border border-indigo-200'
                        }`}>
                          <Gauge className="h-4 w-4 text-indigo-400" />
                        </div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Server
                        </span>
                      </div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {userInfo?.server || 'Auto'}
                      </div>
                    </div>
                    
                    <div className={`text-center backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                        : 'bg-white/60 border-gray-200 hover:bg-white/80'
                    }`}>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <div className={`p-2 rounded-lg ${
                          isDarkMode 
                            ? 'bg-emerald-500/20 border border-emerald-500/30' 
                            : 'bg-emerald-100 border border-emerald-200'
                        }`}>
                          <BarChart3 className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Grade
                        </span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-lg px-4 py-2 border shadow-lg ${getGradeColor(results.grade)}`}
                      >
                        {results.grade || '-'}
                      </Badge>
                    </div>
                  </div>

                  {/* Enhanced Progress Bar */}
                  {isRunning && (
                    <div className="space-y-4 max-w-2xl mx-auto">
                      <div className={`backdrop-blur-sm rounded-xl p-6 border ${
                        isDarkMode 
                          ? 'bg-white/5 border-white/10' 
                          : 'bg-white/60 border-gray-200'
                      }`}>
                      <Progress 
                        value={progress} 
                          className="w-full h-4"
                        aria-label="Speed test progress"
                      />
                        <div className={`text-center mt-3 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {getProgressText()}
                        </div>
                        <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {progress.toFixed(1)}% Complete
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={startTest}
                      disabled={isRunning || !isOnline}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRunning ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Play className="h-6 w-6 mr-3" />
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
                          className={`transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl px-8 py-4 text-lg font-semibold ${
                            isDarkMode 
                              ? 'border-white/20 text-white hover:bg-white/10 backdrop-blur-sm' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Share2 className="h-6 w-6 mr-3" />
                          Share Results
                        </Button>
                        
                        <Button
                          onClick={resetTest}
                          variant="outline"
                          size="lg"
                          className={`transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl px-8 py-4 text-lg font-semibold ${
                            isDarkMode 
                              ? 'border-white/20 text-white hover:bg-white/10 backdrop-blur-sm' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <RotateCcw className="h-6 w-6 mr-3" />
                          Reset
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Enhanced Result Summary */}
                  {!isRunning && (results.downloadSpeed > 0 || results.uploadSpeed > 0) && (
                    <div className={`rounded-2xl p-8 border backdrop-blur-xl transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 shadow-xl' 
                        : 'bg-white/80 border-gray-200 shadow-xl'
                    }`}>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                        <div className={`backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 hover:scale-105 ${
                          isDarkMode 
                            ? 'bg-green-500/10 border-green-500/20' 
                            : 'bg-green-100 border-green-200'
                        }`}>
                          <div className="text-3xl font-bold text-green-400">
                            {results.downloadSpeed.toFixed(1)}
                          </div>
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Download Mbps
                          </div>
                        </div>
                        <div className={`backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 hover:scale-105 ${
                          isDarkMode 
                            ? 'bg-blue-500/10 border-blue-500/20' 
                            : 'bg-blue-100 border-blue-200'
                        }`}>
                          <div className="text-3xl font-bold text-blue-400">
                            {results.uploadSpeed.toFixed(1)}
                          </div>
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Upload Mbps
                          </div>
                        </div>
                        <div className={`backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 hover:scale-105 ${
                          isDarkMode 
                            ? 'bg-yellow-500/10 border-yellow-500/20' 
                            : 'bg-yellow-100 border-yellow-200'
                        }`}>
                          <div className="text-3xl font-bold text-yellow-400">
                            {results.ping.toFixed(1)}
                          </div>
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Ping ms
                          </div>
                        </div>
                        <div className={`backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 hover:scale-105 ${
                          isDarkMode 
                            ? 'bg-purple-500/10 border-purple-500/20' 
                            : 'bg-purple-100 border-purple-200'
                        }`}>
                          <div className="text-3xl font-bold text-purple-400">
                            {(results.jitter || 0).toFixed(1)}
                          </div>
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Jitter ms
                          </div>
                        </div>
                        <div className={`backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 hover:scale-105 ${
                          isDarkMode 
                            ? 'bg-emerald-500/10 border-emerald-500/20' 
                            : 'bg-emerald-100 border-emerald-200'
                        }`}>
                          <Badge 
                            variant="secondary" 
                            className={`text-xl px-4 py-2 border shadow-lg ${getGradeColor(results.grade)}`}
                          >
                            {results.grade}
                          </Badge>
                          <div className={`text-sm font-medium mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
            <Card className={`backdrop-blur-xl border transition-all duration-500 hover:shadow-xl transform hover:scale-[1.01] ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/10 shadow-lg' 
                : 'bg-white/80 border-gray-200 hover:bg-white/90 shadow-lg'
            }`}>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-3 rounded-xl backdrop-blur-sm border ${
                    isDarkMode 
                      ? 'bg-blue-500/20 border-blue-500/30' 
                      : 'bg-blue-100 border-blue-200'
                  }`}>
                    <Info className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Tips for Better Results
                  </h3>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 text-base ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <div className={`flex items-start space-x-4 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                      : 'bg-white/60 border-gray-200 hover:bg-white/80'
                  }`}>
                    <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div className="font-medium">Close other apps and browser tabs before testing for more accurate results</div>
                  </div>
                  <div className={`flex items-start space-x-4 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                      : 'bg-white/60 border-gray-200 hover:bg-white/80'
                  }`}>
                    <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div className="font-medium">Use a wired connection instead of WiFi for the most accurate speed measurements</div>
                  </div>
                  <div className={`flex items-start space-x-4 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                      : 'bg-white/60 border-gray-200 hover:bg-white/80'
                  }`}>
                    <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div className="font-medium">Test multiple times throughout the day to get a better understanding of your connection</div>
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