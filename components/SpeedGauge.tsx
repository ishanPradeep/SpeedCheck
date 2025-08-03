'use client';

import { useEffect, useState } from 'react';
import { Zap, TrendingUp, AlertCircle } from 'lucide-react';

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
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = Math.min((animatedValue / maxValue) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 90;
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

  // Enhanced dynamic colors based on speed
  const getSpeedColor = () => {
    if (animatedValue >= 100) return '#10b981'; // Green for high speed
    if (animatedValue >= 50) return '#3b82f6';  // Blue for medium speed
    if (animatedValue >= 25) return '#f59e0b';  // Yellow for low speed
    return '#ef4444'; // Red for very low speed
  };

  const getSpeedStatus = () => {
    if (animatedValue >= 100) return { text: 'Excellent', icon: Zap, color: 'text-green-400' };
    if (animatedValue >= 50) return { text: 'Good', icon: TrendingUp, color: 'text-blue-400' };
    if (animatedValue >= 25) return { text: 'Fair', icon: TrendingUp, color: 'text-yellow-400' };
    return { text: 'Poor', icon: AlertCircle, color: 'text-red-400' };
  };

  const speedStatus = getSpeedStatus();
  const StatusIcon = speedStatus.icon;

  return (
    <div 
      className="relative w-48 h-48 mx-auto transform transition-all duration-500 hover:scale-110 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Enhanced glow effect */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
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
            <stop offset="0%" stopColor={getSpeedColor()} stopOpacity="0.3" />
            <stop offset="100%" stopColor={getSpeedColor()} stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Background circle with enhanced styling */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke={isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}
          strokeWidth="12"
          className="transition-all duration-300"
        />
        
        {/* Enhanced Progress Circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ease-out ${isActive ? 'animate-pulse' : ''} ${
            isHovered ? 'drop-shadow-lg' : ''
          }`}
          filter={isActive ? "url(#glow)" : "none"}
        />

        {/* Inner glow effect */}
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="url(#innerGlow)"
          className="transition-all duration-300"
        />
      </svg>
      
      {/* Enhanced Center Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-4xl font-bold transition-all duration-500 ${
            isActive ? 'scale-110' : ''
          } ${isDarkMode ? 'text-white' : 'text-gray-900'} ${
            isHovered ? 'scale-105' : ''
          }`}>
            {animatedValue.toFixed(1)}
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
            Mbps
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
              className={`absolute w-1 h-4 origin-bottom transition-all duration-300 ${
                isActiveMark 
                  ? (isDarkMode ? 'bg-white/60' : 'bg-gray-600/80')
                  : (isDarkMode ? 'bg-white/20' : 'bg-gray-400/30')
              } ${isHovered && isActiveMark ? 'scale-125' : ''}`}
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className={`text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm border transition-all duration-300 ${
          animatedValue >= 100 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
          animatedValue >= 50 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
          animatedValue >= 25 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
          'bg-red-500/20 text-red-400 border-red-500/30'
        } ${isHovered ? 'scale-110 shadow-lg' : ''}`}>
          <div className="flex items-center space-x-1">
            <StatusIcon className="w-3 h-3" />
            <span>{speedStatus.text}</span>
          </div>
        </div>
      </div>

      {/* Percentage indicator */}
      <div className="absolute top-2 right-2">
        <div className={`text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm ${
          isDarkMode ? 'bg-white/10 text-white/80' : 'bg-black/10 text-black/80'
        }`}>
          {percentage.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}