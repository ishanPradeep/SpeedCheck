// Speed Test Configuration
export const config = {
  // App Settings
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'SpeedCheck Pro',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
    historyLimit: parseInt(process.env.NEXT_PUBLIC_HISTORY_LIMIT || '50'),
  },

  // Speed Test Settings
  speedTest: {
    sizes: process.env.NEXT_PUBLIC_SPEED_TEST_SIZES?.split(',').map(s => Number(s.trim())) || [0.5, 1, 2, 5],
    minPing: Number(process.env.NEXT_PUBLIC_MIN_PING || '1'),
    minJitter: Number(process.env.NEXT_PUBLIC_MIN_JITTER || '1'),
    maxFileSize: parseInt(process.env.SPEED_TEST_MAX_FILE_SIZE || '52428800'), // 50MB
    minFileSize: parseInt(process.env.SPEED_TEST_MIN_FILE_SIZE || '1048576'), // 1MB
  },

  // Performance Settings
  performance: {
    overheadCompensation: Number(process.env.NEXT_PUBLIC_OVERHEAD_COMPENSATION || '1.0'),
    graceTimeDownload: Number(process.env.NEXT_PUBLIC_GRACE_TIME_DOWNLOAD || '0.5'),
    graceTimeUpload: Number(process.env.NEXT_PUBLIC_GRACE_TIME_UPLOAD || '0.5'),
  },

  // Network Quality Settings
  networkQuality: {
    pingServers: process.env.NETWORK_QUALITY_PING_SERVERS?.split(',') || [
      'https://www.google.com',
      'https://www.cloudflare.com',
      'https://www.amazon.com',
      'https://www.microsoft.com',
    ],
    pingTimeout: parseInt(process.env.NETWORK_QUALITY_PING_TIMEOUT || '5000'),
    jitterMeasurements: parseInt(process.env.NETWORK_QUALITY_JITTER_MEASUREMENTS || '15'),
  },

  // Test Configuration
  test: {
    pingCount: 10,
    jitterCount: 20,
    downloadSizes: [0.5, 1, 2, 5], // MB - Smaller sizes for accuracy
    uploadSizes: [0.25, 0.5, 1, 2], // MB - Smaller sizes for accuracy
    timeout: 30000, // 30 seconds
  },
} as const;

export default config;
