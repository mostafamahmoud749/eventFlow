import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DemoProvider from '@/components/common/DemoProvider';
import './globals.css';

export const metadata: Metadata = {
  icons: { icon: '/icon.svg' },
  title: { default: 'EventFlow — Good plans start here', template: '%s | EventFlow' },
  description:
    'Discover live music, arts, theatre, sports, and workshops in Cairo. Find your next great experience with EventFlow.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>
          <a
            href="#main-content"
            className="sr-only fixed top-4 left-4 z-50 rounded-lg bg-white p-4 focus:not-sr-only"
          >
            Skip to content
          </a>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </DemoProvider>
      </body>
    </html>
  );
}
