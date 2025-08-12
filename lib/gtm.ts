// Google Tag Manager utility functions

declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Initialize dataLayer if it doesn't exist
export const initDataLayer = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

// Push event to dataLayer
export const pushToDataLayer = (event: any) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
};

// Track speed test completion
export const trackSpeedTest = (data: {
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  jitter: number;
  testDuration: number;
}) => {
  pushToDataLayer({
    event: 'speed_test_completed',
    speed_test_data: {
      download_speed: data.downloadSpeed,
      upload_speed: data.uploadSpeed,
      ping: data.ping,
      jitter: data.jitter,
      test_duration: data.testDuration,
    },
  });
  
  // Google Ads conversion tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
      'value': data.downloadSpeed,
      'currency': 'USD',
      'transaction_id': Date.now().toString(),
    });
  }
};

// Track page view
export const trackPageView = (page: string) => {
  pushToDataLayer({
    event: 'page_view',
    page_path: page,
  });
};

// Track user interaction
export const trackUserInteraction = (action: string, category: string, label?: string) => {
  pushToDataLayer({
    event: 'user_interaction',
    interaction_category: category,
    interaction_action: action,
    interaction_label: label,
  });
};

// Track error
export const trackError = (error: string, errorCode?: string) => {
  pushToDataLayer({
    event: 'error',
    error_message: error,
    error_code: errorCode,
  });
};
