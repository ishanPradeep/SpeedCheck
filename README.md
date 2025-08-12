# SpeedCheck Pro

A professional network speed testing application built with Next.js, providing real-time download and upload speed measurements similar to speedtest.net.

## Features

- 🚀 **Real-time Speed Testing**: Download and upload speed measurements
- 📊 **Network Quality Analysis**: Ping, jitter, and reliability metrics
- 🎨 **Modern UI**: Beautiful dark/light mode interface
- 📱 **Responsive Design**: Works on desktop and mobile
- 📈 **Test History**: Save and view previous test results
- 🔄 **Real-time Updates**: Live progress and results
- 🎯 **Speedtest.net-style**: Accurate measurements using similar algorithms

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API**: Next.js API Routes

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SpeedCheck Pro
NEXT_PUBLIC_APP_VERSION=1.0.0

# Speed Test Configuration
SPEED_TEST_TIMEOUT=30000
SPEED_TEST_MAX_FILE_SIZE=10485760
SPEED_TEST_MIN_FILE_SIZE=1048576

# Network Quality Configuration
NETWORK_QUALITY_PING_SERVERS=https://www.google.com,https://www.cloudflare.com,https://www.amazon.com,https://www.microsoft.com,https://www.facebook.com,https://www.netflix.com,https://www.youtube.com,https://www.github.com
NETWORK_QUALITY_JITTER_MEASUREMENTS=15
NETWORK_QUALITY_PING_TIMEOUT=5000

# Speed Test API Keys (for external services if needed)
SPEED_TEST_API_KEY=your_speed_test_api_key_here
NETWORK_QUALITY_API_KEY=your_network_quality_api_key_here

# Database Configuration (if needed for history)
DATABASE_URL=your_database_url_here
DATABASE_API_KEY=your_database_api_key_here

# Analytics Configuration
NEXT_PUBLIC_GA_ID=your_google_analytics_id_here
NEXT_PUBLIC_GTM_ID=GTM-W3TWP66V

# External API Keys (for IP geolocation, etc.)
IP_API_KEY=your_ip_api_key_here
GEO_LOCATION_API_KEY=your_geolocation_api_key_here

# Security Configuration
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here

# Performance Configuration
CACHE_DURATION=300
MAX_CONCURRENT_TESTS=5
RATE_LIMIT_PER_MINUTE=60

# Feature Flags
ENABLE_REAL_TIME_TESTING=true
ENABLE_HISTORY_SAVING=true
ENABLE_SHARING=true
ENABLE_DARK_MODE=true

# Development Configuration
NODE_ENV=development
DEBUG=true
LOG_LEVEL=info
```

## API Keys Setup

### Required API Keys (Optional for basic functionality):

1. **Speed Test Services**:
   - `SPEEDTEST_NET_API_KEY`: For Ookla Speedtest.net integration
   - `FAST_COM_API_KEY`: For Netflix Fast.com integration
   - `OOKLA_API_KEY`: For Ookla services

2. **IP Geolocation Services**:
   - `IPAPI_CO_API_KEY`: For IP geolocation data
   - `IPINFO_IO_API_KEY`: For IP information
   - `IPGEOLOCATION_IO_API_KEY`: For location services

3. **Network Quality Services**:
   - `CLOUDFLARE_API_KEY`: For Cloudflare services
   - `GOOGLE_CLOUD_API_KEY`: For Google Cloud services
   - `AWS_API_KEY`: For AWS services

4. **Analytics Services**:
   - `GOOGLE_ANALYTICS_ID`: For Google Analytics
   - `MIXPANEL_API_KEY`: For Mixpanel analytics
   - `AMPLITUDE_API_KEY`: For Amplitude analytics

5. **Monitoring Services**:
   - `SENTRY_API_KEY`: For error monitoring
   - `LOGROCKET_API_KEY`: For session replay
   - `NEW_RELIC_API_KEY`: For performance monitoring

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/speedcheck-pro.git
   cd speedcheck-pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   ```
   http://localhost:3000
   ```

## API Endpoints

### Speed Test API
- `POST /api/speed-test`: Perform download/upload speed tests
- `GET /api/speed-test`: Get API status and configuration

### Network Quality API
- `GET /api/network-quality`: Get comprehensive network quality metrics

### Ping API
- `GET /api/ping`: Get ping measurements
- `HEAD /api/ping`: Lightweight ping test

## Configuration

The application uses environment variables for configuration. Copy the `.env.example` file and customize the settings:

```bash
cp env.example .env.local
# Edit .env.local with your API keys and settings
```

### Google Tag Manager Setup

The application includes Google Tag Manager (GTM) integration for analytics and tracking. The GTM ID is already configured as `GTM-W3TWP66V`.

To customize the GTM setup:

1. **Update the GTM ID** in your `.env.local` file:
   ```bash
   NEXT_PUBLIC_GTM_ID=your_gtm_id_here
   ```

2. **Use the GTM utility functions** for custom tracking:
   ```typescript
   import { trackSpeedTest, trackPageView, trackUserInteraction } from '@/lib/gtm';
   
   // Track speed test completion
   trackSpeedTest({
     downloadSpeed: 50.5,
     uploadSpeed: 25.2,
     ping: 15,
     jitter: 2.1,
     testDuration: 30000
   });
   
   // Track page views
   trackPageView('/speed-test');
   
   // Track user interactions
   trackUserInteraction('click', 'button', 'start_test');
   ```

3. **Available tracking events**:
   - `speed_test_completed`: When a speed test finishes
   - `page_view`: When users navigate to different pages
   - `user_interaction`: For button clicks and user actions
   - `error`: For tracking errors and issues

### Key Environment Variables:

- **Speed Test Timeout**: `SPEED_TEST_TIMEOUT` (default: 30000ms)
- **File Size Limits**: `SPEED_TEST_MAX_FILE_SIZE` (default: 10MB)
- **Ping Servers**: `NETWORK_QUALITY_PING_SERVERS` (comma-separated URLs)
- **Jitter Measurements**: `NETWORK_QUALITY_JITTER_MEASUREMENTS` (default: 15)
- **Cache Duration**: `CACHE_DURATION` (default: 300s)
- **Rate Limiting**: `RATE_LIMIT_PER_MINUTE` (default: 60)

## Features

### Speed Testing
- Real-time download and upload speed measurements
- Multiple file sizes for accurate testing
- Speedtest.net-style algorithms
- Progress tracking and live updates

### Network Quality
- Ping measurements to multiple servers
- Jitter calculation using standard deviation
- Network stability and reliability metrics
- Real-time quality assessment

### User Interface
- Modern, responsive design
- Dark and light mode support
- Real-time progress indicators
- Interactive speed gauges
- Test history management

### Data Management
- Local storage for test history
- Export and share results
- Configurable data retention
- Privacy-focused design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the configuration options

## Acknowledgments

- Inspired by speedtest.net
- Built with Next.js and React
- Uses shadcn/ui components
- Powered by modern web technologies
