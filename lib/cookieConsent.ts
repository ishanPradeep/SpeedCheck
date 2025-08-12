// Cookie consent management utilities

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
}

export const getCookieConsent = (): CookiePreferences | null => {
  if (typeof window === 'undefined') return null;
  
  const consent = localStorage.getItem('cookie-consent');
  if (!consent) return null;
  
  try {
    return JSON.parse(consent);
  } catch {
    return null;
  }
};

export const setCookieConsent = (preferences: CookiePreferences): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('cookie-consent', JSON.stringify(preferences));
  localStorage.setItem('cookie-consent-date', new Date().toISOString());
};

export const hasConsent = (type: keyof CookiePreferences): boolean => {
  const consent = getCookieConsent();
  return consent ? consent[type] : false;
};

export const clearCookieConsent = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('cookie-consent');
  localStorage.removeItem('cookie-consent-date');
};

export const getConsentDate = (): Date | null => {
  if (typeof window === 'undefined') return null;
  
  const date = localStorage.getItem('cookie-consent-date');
  return date ? new Date(date) : null;
};

// Check if consent is older than 12 months (GDPR requirement)
export const isConsentExpired = (): boolean => {
  const consentDate = getConsentDate();
  if (!consentDate) return true;
  
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
  
  return consentDate < twelveMonthsAgo;
};

// Default preferences
export const getDefaultPreferences = (): CookiePreferences => ({
  essential: true,
  analytics: false,
  advertising: false,
});

// Check if user has made any consent choice
export const hasUserConsented = (): boolean => {
  return getCookieConsent() !== null;
};
