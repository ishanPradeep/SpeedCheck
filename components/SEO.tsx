'use client';

import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export default function SEO({
  title = 'GlobalSpeedTrack - Professional Internet Speed Test',
  description = 'Test your internet speed with our professional speed test tool. Get accurate download, upload speeds, ping, and network quality analysis. Free, fast, and reliable.',
  keywords = 'internet speed test, speed test, download speed, upload speed, ping test, network quality, broadband test, wifi speed test, mobile speed test, internet performance, speedtest, bandwidth test',
  image = '/og-image.png',
  url = 'https://globalspeedtrack.com',
  type = 'website',
  author = 'GlobalSpeedTrack',
  publishedTime,
  modifiedTime,
  section = 'Technology',
  tags = ['speed test', 'internet', 'network', 'performance']
}: SEOProps) {
  const siteName = 'GlobalSpeedTrack';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Language and Locale */}
      <meta property="og:locale" content="en_US" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="US" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={description} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@globalspeedtrack" />
      <meta name="twitter:creator" content="@globalspeedtrack" />
      
      {/* Article Meta Tags (if applicable) */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:section" content={section} />
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "GlobalSpeedTrack",
            "url": "https://globalspeedtrack.com",
            "logo": "https://globalspeedtrack.com/logo.png",
            "description": "Professional Internet Speed Test Tool",
            "sameAs": [
              "https://twitter.com/globalspeedtrack",
              "https://facebook.com/globalspeedtrack"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": "English"
            }
          })
        }}
      />
      
      {/* Structured Data - WebApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GlobalSpeedTrack",
            "description": "Professional Internet Speed Test Tool",
            "url": "https://globalspeedtrack.com",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Download Speed Test",
              "Upload Speed Test", 
              "Ping Test",
              "Network Quality Analysis",
              "Real-time Results",
              "History Tracking"
            ]
          })
        }}
      />
      
      {/* Structured Data - FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How accurate is the speed test?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our speed test uses advanced algorithms and multiple file sizes to provide highly accurate results. We measure actual data transfer speeds with precision timing."
                }
              },
              {
                "@type": "Question", 
                "name": "What does ping mean?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ping measures the time it takes for data to travel from your device to a server and back. Lower ping values indicate better network responsiveness."
                }
              },
              {
                "@type": "Question",
                "name": "Is the speed test free?",
                "acceptedAnswer": {
                  "@type": "Answer", 
                  "text": "Yes, GlobalSpeedTrack is completely free to use. No registration or payment required."
                }
              }
            ]
          })
        }}
      />
      
      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://www.cloudflare.com" />
      
             {/* DNS Prefetch for performance */}
       <link rel="dns-prefetch" href="//www.google.com" />
       <link rel="dns-prefetch" href="//www.cloudflare.com" />
       <link rel="dns-prefetch" href="//www.amazon.com" />
       <link rel="dns-prefetch" href="//www.microsoft.com" />
     </Head>
   );
 }
