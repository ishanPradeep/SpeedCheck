import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SpeedCheck Pro - Professional Network Analysis',
  description: 'Advanced speed test tool with detailed network analysis, quality metrics, and comprehensive reporting.',
  keywords: 'speed test, internet speed, network analysis, bandwidth test, ping test, jitter test',
  authors: [{ name: 'SpeedCheck Pro' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'SpeedCheck Pro - Professional Network Analysis',
    description: 'Advanced speed test tool with detailed network analysis and comprehensive reporting.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpeedCheck Pro - Professional Network Analysis',
    description: 'Advanced speed test tool with detailed network analysis and comprehensive reporting.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
