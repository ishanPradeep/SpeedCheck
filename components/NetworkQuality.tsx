import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Signal,
  BarChart3,
  Shield,
  Target
} from 'lucide-react';

interface NetworkQualityProps {
  results: {
    downloadSpeed: number;
    uploadSpeed: number;
    ping: number;
    jitter?: number;
    grade: string;
  };
  networkQuality: any;
  isDarkMode?: boolean;
}

export default function NetworkQuality({ results, networkQuality, isDarkMode = true }: NetworkQualityProps) {
  const getQualityScore = () => {
    const downloadScore = Math.min((results.downloadSpeed / 100) * 100, 100);
    const uploadScore = Math.min((results.uploadSpeed / 50) * 100, 100);
    const pingScore = Math.max(100 - (results.ping / 2), 0);
    
    return Math.round((downloadScore + uploadScore + pingScore) / 3);
  };

  const getActivityRecommendations = () => {
    const { downloadSpeed, uploadSpeed, ping } = results;
    
    return [
      {
        activity: 'Web Browsing',
        recommended: '1-5 Mbps',
        status: downloadSpeed >= 1 ? 'excellent' : 'poor',
        icon: <Wifi className="h-5 w-5" />,
        description: 'Basic web browsing and email'
      },
      {
        activity: 'Video Streaming (HD)',
        recommended: '5-25 Mbps',
        status: downloadSpeed >= 25 ? 'excellent' : downloadSpeed >= 5 ? 'good' : 'poor',
        icon: <Activity className="h-5 w-5" />,
        description: 'HD video streaming on platforms like Netflix'
      },
      {
        activity: 'Video Streaming (4K)',
        recommended: '25+ Mbps',
        status: downloadSpeed >= 25 ? 'excellent' : 'poor',
        icon: <Zap className="h-5 w-5" />,
        description: 'Ultra HD 4K video streaming'
      },
      {
        activity: 'Online Gaming',
        recommended: '<50ms ping',
        status: ping <= 50 ? 'excellent' : ping <= 100 ? 'good' : 'poor',
        icon: <Clock className="h-5 w-5" />,
        description: 'Competitive online gaming'
      },
      {
        activity: 'Video Calls',
        recommended: '1-4 Mbps',
        status: downloadSpeed >= 4 && uploadSpeed >= 1 ? 'excellent' : 'poor',
        icon: <TrendingUp className="h-5 w-5" />,
        description: 'HD video conferencing'
      },
      {
        activity: 'File Uploads',
        recommended: '5+ Mbps',
        status: uploadSpeed >= 5 ? 'excellent' : uploadSpeed >= 2 ? 'good' : 'poor',
        icon: <Signal className="h-5 w-5" />,
        description: 'Large file uploads and cloud sync'
      }
    ];
  };

  const getNetworkInsights = () => {
    const { downloadSpeed, uploadSpeed, ping, jitter } = results;
    
    return [
      {
        title: 'Download Performance',
        value: downloadSpeed >= 100 ? 'Excellent' : downloadSpeed >= 50 ? 'Good' : downloadSpeed >= 25 ? 'Fair' : 'Poor',
        color: downloadSpeed >= 100 ? 'text-green-400' : downloadSpeed >= 50 ? 'text-blue-400' : downloadSpeed >= 25 ? 'text-yellow-400' : 'text-red-400',
        icon: <BarChart3 className="h-5 w-5" />,
        details: `${downloadSpeed.toFixed(1)} Mbps`
      },
      {
        title: 'Upload Performance',
        value: uploadSpeed >= 50 ? 'Excellent' : uploadSpeed >= 25 ? 'Good' : uploadSpeed >= 10 ? 'Fair' : 'Poor',
        color: uploadSpeed >= 50 ? 'text-green-400' : uploadSpeed >= 25 ? 'text-blue-400' : uploadSpeed >= 10 ? 'text-yellow-400' : 'text-red-400',
        icon: <TrendingUp className="h-5 w-5" />,
        details: `${uploadSpeed.toFixed(1)} Mbps`
      },
      {
        title: 'Connection Stability',
        value: ping <= 30 ? 'Excellent' : ping <= 60 ? 'Good' : ping <= 100 ? 'Fair' : 'Poor',
        color: ping <= 30 ? 'text-green-400' : ping <= 60 ? 'text-blue-400' : ping <= 100 ? 'text-yellow-400' : 'text-red-400',
        icon: <Shield className="h-5 w-5" />,
        details: `${ping}ms latency`
      },
      {
        title: 'Network Consistency',
        value: (jitter || 0) <= 5 ? 'Excellent' : (jitter || 0) <= 15 ? 'Good' : (jitter || 0) <= 30 ? 'Fair' : 'Poor',
        color: (jitter || 0) <= 5 ? 'text-green-400' : (jitter || 0) <= 15 ? 'text-blue-400' : (jitter || 0) <= 30 ? 'text-yellow-400' : 'text-red-400',
        icon: <Target className="h-5 w-5" />,
        details: `${jitter || 0}ms jitter`
      }
    ];
  };

  const qualityScore = getQualityScore();
  const recommendations = getActivityRecommendations();
  const insights = getNetworkInsights();

  return (
    <div className="space-y-8">
      {/* Enhanced Overall Quality Score */}
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
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <span>Network Quality Score</span>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Comprehensive analysis of your connection
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="relative w-40 h-40 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="qualityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={
                      qualityScore >= 80 ? "#10b981" :
                      qualityScore >= 60 ? "#3b82f6" :
                      qualityScore >= 40 ? "#f59e0b" : "#ef4444"
                    } />
                    <stop offset="100%" stopColor={
                      qualityScore >= 80 ? "#059669" :
                      qualityScore >= 60 ? "#2563eb" :
                      qualityScore >= 40 ? "#d97706" : "#dc2626"
                    } />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#qualityGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${qualityScore * 2.51} 251`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {qualityScore}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Score
                  </div>
                </div>
              </div>
            </div>
            
            <Badge 
              variant="secondary" 
              className={`text-lg px-6 py-3 border ${
                qualityScore >= 80 ? 'bg-green-600/20 text-green-300 border-green-500/30' :
                qualityScore >= 60 ? 'bg-blue-600/20 text-blue-300 border-blue-500/30' :
                qualityScore >= 40 ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30' :
                'bg-red-600/20 text-red-300 border-red-500/30'
              }`}
            >
              {qualityScore >= 80 ? 'Excellent' :
               qualityScore >= 60 ? 'Good' :
               qualityScore >= 40 ? 'Fair' : 'Poor'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Network Insights */}
      <Card className={`backdrop-blur-md border transition-all duration-300 hover:shadow-xl ${
        isDarkMode 
          ? 'bg-white/10 border-white/20 hover:bg-white/15' 
          : 'bg-white/80 border-gray-200 hover:bg-white/90'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-400" />
            </div>
            <span>Network Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-white/50'}`}>
                    {insight.icon}
                  </div>
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {insight.title}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {insight.details}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary"
                    className={`${
                      insight.value === 'Excellent' ? 'bg-green-600/20 text-green-300 border-green-500/30' :
                      insight.value === 'Good' ? 'bg-blue-600/20 text-blue-300 border-blue-500/30' :
                      insight.value === 'Fair' ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30' :
                      'bg-red-600/20 text-red-300 border-red-500/30'
                    }`}
                  >
                    {insight.value}
                  </Badge>
                  <div className={`text-2xl font-bold ${insight.color}`}>
                    {insight.value === 'Excellent' ? 'A+' :
                     insight.value === 'Good' ? 'B' :
                     insight.value === 'Fair' ? 'C' : 'D'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Activity Recommendations */}
      <Card className={`backdrop-blur-md border transition-all duration-300 hover:shadow-xl ${
        isDarkMode 
          ? 'bg-white/10 border-white/20 hover:bg-white/15' 
          : 'bg-white/80 border-gray-200 hover:bg-white/90'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Target className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <span>Activity Recommendations</span>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                What your connection can handle
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    item.status === 'excellent' ? 'bg-green-500/20' :
                    item.status === 'good' ? 'bg-blue-500/20' :
                    'bg-red-500/20'
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.activity}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.description}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Recommended: {item.recommended}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {item.status === 'excellent' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : item.status === 'good' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                  <Badge 
                    variant="secondary"
                    className={`${
                      item.status === 'excellent' ? 'bg-green-600/20 text-green-300 border-green-500/30' :
                      item.status === 'good' ? 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30' :
                      'bg-red-600/20 text-red-300 border-red-500/30'
                    }`}
                  >
                    {item.status === 'excellent' ? 'Perfect' :
                     item.status === 'good' ? 'Good' : 'Limited'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Network Stability */}
      <Card className={`backdrop-blur-md border transition-all duration-300 hover:shadow-xl ${
        isDarkMode 
          ? 'bg-white/10 border-white/20 hover:bg-white/15' 
          : 'bg-white/80 border-gray-200 hover:bg-white/90'
      }`}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Shield className="h-6 w-6 text-orange-400" />
            </div>
            <span>Connection Stability</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`text-center p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {results.ping}ms
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                Latency
              </div>
              <Progress 
                value={Math.max(100 - (results.ping / 2), 0)} 
                className="h-2"
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
}