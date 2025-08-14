'use client';

import { useEffect, useState } from 'react';
import { Zap, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

interface SpeedGaugeProps {
  value: number;
  maxValue: number;
  color: string;
  isActive?: boolean;
  isDarkMode?: boolean;
}

export default function SpeedGauge({ value, maxValue, color, isActive, isDarkMode = true }: SpeedGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Validate and format the speed value
  const validateSpeed = (speed: number): number => {
    // Cap unrealistic speeds (anything above 10 Gbps is likely an error)
    if (speed > 10000) {
      console.warn('Unrealistic speed detected:', speed, 'Mbps, capping at 10000 Mbps');
      return 10000;
    }
    // Ensure minimum realistic speed
    if (speed < 0) return 0;
    return speed;
  };

  const validatedValue = validateSpeed(value);
  
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setAnimatedValue(validatedValue);
      setIsAnimating(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [validatedValue]);

  const percentage = Math.min((animatedValue / maxValue) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 90;
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

  // Format speed display
  const formatSpeed = (speed: number): string => {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(1)} Gbps`;
    }
    return `${speed.toFixed(1)} Mbps`;
  };

  // Enhanced dynamic colors based on speed
  const getSpeedColor = () => {
    if (animatedValue >= 100) return '#10b981'; // Green for high speed
    if (animatedValue >= 50) return '#3b82f6';  // Blue for medium speed
    if (animatedValue >= 25) return '#f59e0b';  // Yellow for low speed
    return '#ef4444'; // Red for very low speed
  };

  const getSpeedStatus = () => {
    if (animatedValue >= 100) return { text: 'Excellent', icon: Sparkles, color: 'text-green-400' };
    if (animatedValue >= 50) return { text: 'Good', icon: TrendingUp, color: 'text-blue-400' };
    if (animatedValue >= 25) return { text: 'Fair', icon: TrendingUp, color: 'text-yellow-400' };
    return { text: 'Poor', icon: AlertCircle, color: 'text-red-400' };
  };

  const speedStatus = getSpeedStatus();
  const StatusIcon = speedStatus.icon;

  return (
    <div 
      className="relative w-56 h-56 mx-auto transform transition-all duration-700 hover:scale-110 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Background Circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Enhanced glow effect */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getSpeedColor()} />
            <stop offset="50%" stopColor={getSpeedColor()} stopOpacity="0.8" />
            <stop offset="100%" stopColor={getSpeedColor()} stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={getSpeedColor()} stopOpacity="0.4" />
            <stop offset="100%" stopColor={getSpeedColor()} stopOpacity="0" />
          </radialGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={getSpeedColor()} floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Background circle with enhanced styling */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke={isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}
          strokeWidth="16"
          className="transition-all duration-500"
        />
        
        {/* Enhanced Progress Circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ease-out ${isActive ? 'animate-pulse' : ''} ${
            isHovered ? 'drop-shadow-2xl' : ''
          } ${isAnimating ? 'animate-ping' : ''}`}
          filter={isActive ? "url(#glow)" : "url(#shadow)"}
        />

        {/* Inner glow effect */}
        <circle
          cx="100"
          cy="100"
          r="75"
          fill="url(#innerGlow)"
          className="transition-all duration-500"
        />
      </svg>
      
      {/* Enhanced Center Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-4xl font-bold transition-all duration-700 ${
            isActive ? 'scale-110' : ''
          } ${isDarkMode ? 'text-white' : 'text-gray-900'} ${
            isHovered ? 'scale-105' : ''
          } ${isAnimating ? 'animate-bounce' : ''}`}>
            {formatSpeed(animatedValue)}
          </div>
          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
            {animatedValue >= 1000 ? 'Gigabit' : 'Megabit'} per second
          </div>
        </div>
      </div>
      
      {/* Enhanced Speed Marks */}
      <div className="absolute inset-0">
        {[0, 20, 40, 60, 80, 100].map((mark) => {
          const angle = (mark / 100) * 270 - 135;
          const x = 100 + 85 * Math.cos((angle * Math.PI) / 180);
          const y = 100 + 85 * Math.sin((angle * Math.PI) / 180);
          const isActiveMark = animatedValue >= mark;
          
          return (
            <div
              key={mark}
              className={`absolute w-2 h-6 origin-bottom transition-all duration-500 ${
                isActiveMark 
                  ? (isDarkMode ? 'bg-white/80' : 'bg-gray-800/80')
                  : (isDarkMode ? 'bg-white/20' : 'bg-gray-400/30')
              } ${isHovered && isActiveMark ? 'scale-150' : ''} ${
                isAnimating && isActiveMark ? 'animate-pulse' : ''
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
              }}
            />
          );
        })}
      </div>
      
      {/* Enhanced Speed indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className={`text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-xl border transition-all duration-500 ${
          animatedValue >= 100 ? 'bg-green-500/20 text-green-400 border-green-500/40 shadow-green-500/25' :
          animatedValue >= 50 ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-blue-500/25' :
          animatedValue >= 25 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 shadow-yellow-500/25' :
          'bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/25'
        } ${isHovered ? 'scale-110 shadow-xl' : ''} ${isAnimating ? 'animate-pulse' : ''}`}>
          <div className="flex items-center space-x-2">
            <StatusIcon className="w-4 h-4" />
            <span>{speedStatus.text}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Percentage indicator */}
      <div className="absolute top-4 right-4">
        <div className={`text-sm font-bold px-3 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-white/10 text-white/90 border-white/20' 
            : 'bg-black/10 text-black/90 border-black/20'
        } ${isHovered ? 'scale-110' : ''}`}>
          {percentage.toFixed(0)}%
        </div>
      </div>

      {/* Enhanced Pulse Ring Effect */}
      {isActive && (
        <div className="absolute inset-0 rounded-full border-2 border-transparent animate-ping">
          <div className="absolute inset-0 rounded-full border-2 border-current opacity-20" style={{ borderColor: getSpeedColor() }} />
        </div>
      )}
    </div>
  );
}