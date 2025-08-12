// Client-side configuration for speed testing
export const clientConfig = {
  // App Settings
  app: {
    name: 'SpeedCheck Pro',
    version: '2.0.0',
    historyLimit: 50,
  },

  // Speed Test Settings
  speedTest: {
    sizes: [0.5, 1, 2, 5], // Smaller test sizes for more accurate results
    minPing: 1,
    minJitter: 1,
    maxFileSize: 52428800, // 50MB
    minFileSize: 1048576, // 1MB
  },

  // Performance Settings
  performance: {
    overheadCompensation: 1.0,
    graceTimeDownload: 0.5,
    graceTimeUpload: 0.5,
  },

  // Network Quality Settings
  networkQuality: {
    pingServers: [
      'https://www.google.com',
      'https://www.cloudflare.com',
      'https://www.amazon.com',
      'https://www.microsoft.com',
    ],
    pingTimeout: 5000,
    jitterMeasurements: 15,
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

export default clientConfig;
