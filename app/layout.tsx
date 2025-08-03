import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpeedCheck - Internet Speed Test',
  description: 'Test your internet speed with our free, accurate speed test. Check download, upload speeds and ping from anywhere in the world.',
  keywords: 'internet speed test, speed check, bandwidth test, ping test, download speed, upload speed',
  openGraph: {
    title: 'SpeedCheck - Free Internet Speed Test',
    description: 'Test your internet speed accurately and for free. Check your download, upload speeds and ping.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}