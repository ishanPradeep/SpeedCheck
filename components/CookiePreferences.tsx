'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Settings, 
  Shield, 
  BarChart3, 
  Target,
  Save,
  RefreshCw
} from 'lucide-react';
import { 
  getCookieConsent, 
  setCookieConsent, 
  getDefaultPreferences, 
  clearCookieConsent,
  type CookiePreferences 
} from '@/lib/cookieConsent';

export default function CookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences>(getDefaultPreferences());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent) {
      setPreferences(consent);
    }
  }, []);

  const handleSave = () => {
    setCookieConsent(preferences);
    setIsOpen(false);
    
    // Apply the preferences
    enableTracking(preferences);
  };

  const handleReset = () => {
    clearCookieConsent();
    setPreferences(getDefaultPreferences());
    setIsOpen(false);
    
    // Reset tracking
    enableTracking(getDefaultPreferences());
  };

  const enableTracking = (consent: CookiePreferences) => {
    // Enable/disable Google Analytics
    if (consent.analytics) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    } else {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
    }

    // Enable/disable advertising
    if (consent.advertising) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted'
        });
      }
    } else {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Cookie Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Cookie Preferences</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Essential Cookies</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Required for the website to function properly
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Analytics Cookies</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Help us understand how visitors interact with our website
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, analytics: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Advertising Cookies</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Used to deliver personalized advertisements
                </p>
              </div>
              <Switch
                checked={preferences.advertising}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, advertising: checked }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="flex items-center space-x-2 flex-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              className="flex items-center space-x-2 flex-1"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
