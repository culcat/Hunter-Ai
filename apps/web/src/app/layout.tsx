import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Hunter-AI Platform | AI Job Search & Career Scout',
  description: 'AI-driven job search automation, resume parsing, vacancy scraping, match scoring, and cover letter generation platform.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
