# Google Tag Manager Setup Guide

This document explains how to set up and use Google Tag Manager (GTM) in the SpeedCheck Pro application.

## Overview

Google Tag Manager is already integrated into the application with the ID `GTM-W3TWP66V`. The integration includes:

- Automatic GTM script loading
- Data layer initialization
- Utility functions for custom tracking
- Pre-configured environment variables

## Quick Setup

### 1. Environment Variables

The GTM ID is already configured in `env.example`:

```bash
NEXT_PUBLIC_GTM_ID=GTM-W3TWP66V
```

To set up your environment:

```bash
# Windows
npm run setup

# Unix/Linux/Mac
npm run setup:unix

# Or manually
cp env.example .env.local
```

### 2. Verify Installation

After running the setup, check that GTM is working:

1. Open your browser's developer tools
2. Go to the Console tab
3. Type `window.dataLayer` and press Enter
4. You should see an array (even if empty)

## Components

### GoogleTagManager Component

Located at `components/GoogleTagManager.tsx`, this component:

- Loads the GTM script asynchronously
- Includes the noscript fallback
- Uses Next.js Script component for optimal loading

### GTM Utility Functions

Located at `lib/gtm.ts`, these functions provide:

- Data layer initialization
- Event tracking
- Speed test tracking
- Page view tracking
- User interaction tracking
- Error tracking

## Usage Examples

### Basic Tracking

```typescript
import { trackPageView, trackUserInteraction } from '@/lib/gtm';

// Track page views
trackPageView('/speed-test');

// Track button clicks
trackUserInteraction('click', 'button', 'start_test');
```

### Speed Test Tracking

```typescript
import { trackSpeedTest } from '@/lib/gtm';

// Track completed speed tests
trackSpeedTest({
  downloadSpeed: 50.5,
  uploadSpeed: 25.2,
  ping: 15,
  jitter: 2.1,
  testDuration: 30000
});
```

### Error Tracking

```typescript
import { trackError } from '@/lib/gtm';

// Track errors
trackError('Speed test failed', 'NETWORK_ERROR');
```

## Available Events

### 1. speed_test_completed

Triggered when a speed test finishes.

**Data Structure:**
```javascript
{
  event: 'speed_test_completed',
  speed_test_data: {
    download_speed: number,
    upload_speed: number,
    ping: number,
    jitter: number,
    test_duration: number
  }
}
```

### 2. page_view

Triggered when users navigate to different pages.

**Data Structure:**
```javascript
{
  event: 'page_view',
  page_path: string
}
```

### 3. user_interaction

Triggered for button clicks and user actions.

**Data Structure:**
```javascript
{
  event: 'user_interaction',
  interaction_category: string,
  interaction_action: string,
  interaction_label: string (optional)
}
```

### 4. error

Triggered when errors occur.

**Data Structure:**
```javascript
{
  event: 'error',
  error_message: string,
  error_code: string (optional)
}
```

## Customization

### Changing GTM ID

To use a different GTM container:

1. Update your `.env.local` file:
   ```bash
   NEXT_PUBLIC_GTM_ID=your_gtm_id_here
   ```

2. Restart your development server

### Adding Custom Events

To add custom tracking events:

```typescript
import { pushToDataLayer } from '@/lib/gtm';

// Custom event
pushToDataLayer({
  event: 'custom_event',
  custom_data: {
    key: 'value'
  }
});
```

### Conditional Tracking

```typescript
import { trackSpeedTest } from '@/lib/gtm';

// Only track if GTM is enabled
if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true') {
  trackSpeedTest(speedTestData);
}
```

## GTM Container Setup

### 1. Create GTM Container

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new account or use existing
3. Create a new container
4. Copy the container ID (format: GTM-XXXXXXX)

### 2. Configure Tags

In your GTM container, you can create tags for:

- **Google Analytics 4**: Track page views and events
- **Google Ads**: Conversion tracking
- **Facebook Pixel**: Social media tracking
- **Custom HTML**: Custom tracking scripts

### 3. Configure Triggers

Set up triggers for the custom events:

- **speed_test_completed**: When speed test data is available
- **user_interaction**: When users interact with buttons
- **error**: When errors occur

### 4. Configure Variables

Use data layer variables to capture:

- Speed test results
- Page paths
- User interactions
- Error messages

## Testing

### Development Testing

1. Use browser developer tools
2. Check the Network tab for GTM requests
3. Verify data layer events in Console

### Production Testing

1. Use GTM Preview mode
2. Test with real user interactions
3. Verify data in Google Analytics

## Troubleshooting

### GTM Not Loading

1. Check if `NEXT_PUBLIC_GTM_ID` is set correctly
2. Verify the GTM ID format (GTM-XXXXXXX)
3. Check browser console for errors

### Events Not Tracking

1. Verify data layer is initialized
2. Check event names match GTM triggers
3. Ensure GTM container is published

### Performance Issues

1. GTM loads asynchronously by default
2. Use `strategy="afterInteractive"` for optimal loading
3. Consider lazy loading for non-critical tracking

## Security Considerations

- GTM ID is public (safe to expose)
- Sensitive data should not be sent to GTM
- Use data layer variables for dynamic content
- Consider GDPR compliance for EU users

## Best Practices

1. **Test thoroughly** in development
2. **Use descriptive event names**
3. **Include relevant data** with events
4. **Monitor performance** impact
5. **Document custom events**
6. **Backup GTM configuration**

## Support

For issues with GTM integration:

1. Check this documentation
2. Review GTM container setup
3. Verify environment variables
4. Test with browser developer tools
5. Check GTM container logs
