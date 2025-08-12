import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Copy, 
  Download, 
  Upload, 
  Timer, 
  Share2,
  Twitter,
  Facebook,
  Link,
  Check,
  Zap,
  Globe,
  MapPin,
  ExternalLink,
  MessageCircle,
  Mail
} from 'lucide-react';

interface ShareResultsProps {
  results: {
    downloadSpeed: number;
    uploadSpeed: number;
    ping: number;
    grade: string;
  };
  userInfo: any;
  onClose: () => void;
  isDarkMode?: boolean;
}

export default function ShareResults({ results, userInfo, onClose, isDarkMode = true }: ShareResultsProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'social' | 'copy'>('social');

  const shareText = `🚀 My Internet Speed Test Results:
📥 Download: ${results.downloadSpeed.toFixed(1)} Mbps
📤 Upload: ${results.uploadSpeed.toFixed(1)} Mbps  
⚡ Ping: ${results.ping.toFixed(1)}ms
🏆 Grade: ${results.grade}

Test your speed at SpeedCheck Pro!`;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaEmail = () => {
    const subject = 'My Internet Speed Test Results';
    const body = `${shareText}\n\nTest your speed: ${shareUrl}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={`w-full max-w-lg backdrop-blur-md border transition-all duration-300 hover:shadow-2xl ${
        isDarkMode 
          ? 'bg-white/10 border-white/20' 
          : 'bg-white/90 border-gray-200'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className={`flex items-center space-x-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Share2 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <span>Share Results</span>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Share your speed test results
              </p>
            </div>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`transition-all duration-300 hover:scale-110 ${
              isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Enhanced Results Summary */}
          <div className={`rounded-lg p-6 border backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-white/5 border-white/10' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Speed Test Results
              </span>
            </div>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Download className="h-4 w-4 text-green-400" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Download
                  </span>
                </div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {results.downloadSpeed.toFixed(1)}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Mbps
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Upload className="h-4 w-4 text-blue-400" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Upload
                  </span>
                </div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {results.uploadSpeed.toFixed(1)}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Mbps
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Timer className="h-4 w-4 text-yellow-400" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Ping
                  </span>
                </div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {results.ping.toFixed(1)}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ms
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}>
                <div className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Grade
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-lg px-3 py-1 border ${getGradeColor(results.grade)}`}
                >
                  {results.grade}
                </Badge>
              </div>
            </div>
          </div>

          {/* Enhanced Share Options */}
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('social')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === 'social'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Social Media
              </button>
              <button
                onClick={() => setActiveTab('copy')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === 'copy'
                    ? 'bg-blue-600 text-white'
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Copy & Share
              </button>
            </div>

            {activeTab === 'social' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={shareToTwitter}
                    variant="outline"
                    className={`transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode 
                        ? 'border-white/20 text-white hover:bg-white/10' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  
                  <Button
                    onClick={shareToFacebook}
                    variant="outline"
                    className={`transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode 
                        ? 'border-white/20 text-white hover:bg-white/10' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={shareToWhatsApp}
                    variant="outline"
                    className={`transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode 
                        ? 'border-white/20 text-white hover:bg-white/10' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  
                  <Button
                    onClick={shareViaEmail}
                    variant="outline"
                    className={`transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode 
                        ? 'border-white/20 text-white hover:bg-white/10' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={copyToClipboard}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-105"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Results
                    </>
                  )}
                </Button>
                
                <div className={`p-3 rounded-lg border ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Link className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Share URL
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className={`flex-1 px-3 py-2 text-sm rounded border ${
                        isDarkMode 
                          ? 'bg-white/10 border-white/20 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <Button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      size="sm"
                      variant="outline"
                      className="transition-all duration-300"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Location Info */}
          {userInfo && (
            <div className={`text-center p-4 rounded-lg border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tested from {userInfo.city}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  via {userInfo.isp}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}