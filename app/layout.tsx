import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import GoogleTagManager from '@/components/GoogleTagManager'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import CookieConsent from '@/components/CookieConsent'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GlobalSpeedTrack - Professional Internet Speed Test',
  description: 'Test your internet speed with our professional speed test tool. Get accurate download, upload speeds, ping, and network quality analysis. Free, fast, and reliable.',
  keywords: 'internet speed test, speed test, download speed, upload speed, ping test, network quality, broadband test, wifi speed test, mobile speed test, internet performance, speedtest, bandwidth test',
  authors: [{ name: 'GlobalSpeedTrack' }],
  creator: 'GlobalSpeedTrack',
  publisher: 'GlobalSpeedTrack',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://globalspeedtrack.com'),
  alternates: {
    canonical: '/',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'GlobalSpeedTrack - Professional Internet Speed Test',
    description: 'Test your internet speed with our professional speed test tool. Get accurate download, upload speeds, ping, and network quality analysis. Free, fast, and reliable.',
    url: 'https://globalspeedtrack.com',
    siteName: 'GlobalSpeedTrack',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GlobalSpeedTrack - Professional Internet Speed Test',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlobalSpeedTrack - Professional Internet Speed Test',
    description: 'Test your internet speed with our professional speed test tool. Get accurate download, upload speeds, ping, and network quality analysis.',
    images: ['/og-image.png'],
    creator: '@globalspeedtrack',
    site: '@globalspeedtrack',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-W3TWP66V';
  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-1XB7TBR4PW';
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <GoogleTagManager gtmId={gtmId} />
        <GoogleAnalytics gaId={gaId} />
        {children}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  )
}
