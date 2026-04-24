import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import './globals.css'; // Global styles
import { Analytics } from "@vercel/analytics/next"

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
});

import { endpoints, getImageUrl } from '@/lib/api';

export async function generateMetadata(): Promise<Metadata> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  let settings;
  try {
    const res = await fetch(`${API_URL}${endpoints.settings}`, { cache: 'no-store' });
    if (res.ok) {
      settings = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch settings for metadata:', error);
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Daily Grind';
  const faviconUrl = settings?.favicon ? getImageUrl(settings.favicon) : '/favicon.ico';
  const logoUrl = settings?.logo ? getImageUrl(settings.logo) : '/favicon.ico';
  const seoImageUrl = settings?.seoImage ? getImageUrl(settings.seoImage) : logoUrl;
  const description = settings?.footerDescription || 'Experience the Perfect Brew';

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: description,
    icons: {
      icon: faviconUrl,
    },
    openGraph: {
      title: siteName,
      description: description,
      siteName: siteName,
      images: [
        {
          url: seoImageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} SEO Image`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: description,
      images: [seoImageUrl],
    },
  };
}

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${workSans.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
