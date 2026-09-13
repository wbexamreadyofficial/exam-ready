import type { Metadata, Viewport } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: {
    default: 'Exam Ready — Prepare. Practice. Perform.',
    template: '%s | Exam Ready',
  },
  description:
    'Premier competitive exam preparation platform for WB Constable, WB SI, WB Food Inspector, WB Health, PSC Clerkship, PSC Miscellaneous, and Primary Teacher TET.',
  keywords: [
    'Exam Ready',
    'WB Constable',
    'WB SI',
    'WB Food Inspector',
    'WB Health',
    'PSC Clerkship',
    'PSC Miscellaneous',
    'Primary Teacher TET',
    'mock test',
    'quiz',
  ],
  authors: [{ name: 'Exam Ready' }],
  creator: 'Exam Ready',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://examready.in',
    title: 'Exam Ready — Prepare. Practice. Perform.',
    description:
      'Premier competitive exam preparation platform.',
    siteName: 'Exam Ready',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exam Ready',
    description: 'Premier competitive exam preparation platform.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050d1f' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <SmoothScrollProvider>
                {children}
              </SmoothScrollProvider>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    fontFamily: 'Inter, system-ui, sans-serif',
                  },
                }}
              />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
