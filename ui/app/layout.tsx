import type { Metadata } from 'next';
import './globals.css';
import { CriticalCSS } from './CriticalCSS';
import AsyncCSS from './components/AsyncCSS';

export const metadata: Metadata = {
  title: {
    default: 'AIDEVELO.AI - Build Your App Ideas with AI',
    template: '%s | AIDEVELO.AI',
  },
  description: 'Build your app ideas with AI-powered automation. No code, endless possibilities. Create websites, automate processes, and deploy intelligent agents.',
  keywords: ['AI', 'App Builder', 'No Code', 'Automation', 'Voice Agents', 'Website Design', 'Process Automation'],
  authors: [{ name: 'AIDEVELO.AI' }],
  creator: 'AIDEVELO.AI',
  publisher: 'AIDEVELO.AI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'AIDEVELO.AI',
    title: 'AIDEVELO.AI - Build Your App Ideas with AI',
    description: 'Build your app ideas with AI-powered automation. No code, endless possibilities.',
    images: [
      {
        url: '/assets/icons/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AIDEVELO.AI - Build Your App Ideas with AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIDEVELO.AI - Build Your App Ideas with AI',
    description: 'Build your app ideas with AI-powered automation. No code, endless possibilities.',
    images: ['/assets/icons/og-image.jpg'],
    creator: '@aidevelo',
  },
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
  verification: {
    // Add verification codes here if needed
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AIDEVELO.AI',
    description: 'Build your app ideas with AI-powered automation. No code, endless possibilities.',
    url: baseUrl,
    logo: `${baseUrl}/assets/images/IMG_0948_1758859719318-optimized.png`,
    sameAs: [
      // Add social media links here
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      // Add contact information here
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Über uns',
        item: `${baseUrl}#introduction`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Dienstleistungen',
        item: `${baseUrl}#services`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Produkte',
        item: `${baseUrl}#products`,
      },
    ],
  };

  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AIDEVELO.AI',
    url: baseUrl,
    description: 'Build your app ideas with AI-powered automation. No code, endless possibilities.',
    publisher: {
      '@type': 'Organization',
      name: 'AIDEVELO.AI',
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Critical CSS - Inlined to prevent render-blocking */}
        <CriticalCSS />
        {/* Preload non-critical CSS */}
        <link
          rel="preload"
          href="/_next/static/css/app/layout.css"
          as="style"
        />
        <noscript>
          <link rel="stylesheet" href="/_next/static/css/app/layout.css" />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body>
        {/* Load non-critical CSS asynchronously */}
        <AsyncCSS />
        <a
          href="#main-content"
          className="skip-to-content"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}


