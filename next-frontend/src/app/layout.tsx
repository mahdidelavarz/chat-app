import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'Real-time chat application',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

// Add this to disable the automatic loading indicator
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
  );
}