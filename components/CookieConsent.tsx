'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Cookie, 
  Settings, 
  Check, 
  X, 
  Info, 
  Shield, 
  BarChart3, 
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  getCookieConsent, 
  setCookieConsent, 
  getDefaultPreferences, 
  isConsentExpired,
  type CookiePreferences 
} from '@/lib/cookieConsent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(getDefaultPreferences());

  useEffect(() => {
    // Check if user has already made a choice and if it's not expired
    const consent = getCookieConsent();
    if (!consent || isConsentExpired()) {
      setShowBanner(true);
    } else {
      // Apply existing consent
      enableTracking(consent);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      advertising: true,
    };
    
    setCookieConsent(allAccepted);
    setShowBanner(false);
    
    // Enable all tracking
    enableTracking(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      advertising: false,
    };
    
    setCookieConsent(onlyEssential);
    setShowBanner(false);
    
    // Disable non-essential tracking
    enableTracking(onlyEssential);
  };

  const handleSavePreferences = () => {
    setCookieConsent(preferences);
    setShowBanner(false);
    
    // Apply selected preferences
    enableTracking(preferences);
  };

  const enableTracking = (consent: CookiePreferences) => {
    // Enable/disable Google Analytics
    if (consent.analytics) {
      // Enable GA4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    } else {
      // Disable GA4
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

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t">
      <div className="container mx-auto max-w-6xl">
        <Card className="border-2 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Main Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Cookie className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">We use cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                      By clicking "Accept All", you consent to our use of cookies.
                    </p>
                  </div>
                </div>

                {/* Cookie Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Essential</span>
                    <span className="text-muted-foreground">Always active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Analytics</span>
                    <span className="text-muted-foreground">Help us improve</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Advertising</span>
                    <span className="text-muted-foreground">Personalized ads</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Customize</span>
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
                          onClick={handleRejectAll}
                          className="flex-1"
                        >
                          Reject All
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSavePreferences}
                          className="flex-1"
                        >
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRejectAll}
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Reject All</span>
                </Button>

                <Button 
                  size="sm" 
                  onClick={handleAcceptAll}
                  className="flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Accept All</span>
                </Button>
              </div>
            </div>

            {/* Learn More Link */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  By continuing to use this site, you agree to our use of cookies. 
                  Learn more in our{' '}
                  <a 
                    href="/cookies" 
                    className="text-primary hover:underline font-medium"
                  >
                    Cookie Policy
                  </a>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show Details
                    </>
                  )}
                </Button>
              </div>

              {/* Expandable Details */}
              {showDetails && (
                <div className="mt-4 p-4 bg-muted rounded-lg space-y-3">
                  <div>
                    <h4 className="font-medium text-sm flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Essential Cookies</span>
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      These cookies are necessary for the website to function and cannot be switched off. 
                      They are usually only set in response to actions made by you.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span>Analytics Cookies</span>
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      These cookies help us understand how visitors interact with our website by collecting 
                      and reporting information anonymously.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm flex items-center space-x-2">
                      <Target className="h-4 w-4 text-orange-500" />
                      <span>Advertising Cookies</span>
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      These cookies are used to make advertising messages more relevant to you and your interests.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
