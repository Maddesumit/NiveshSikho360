import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { NiveshProvider } from '@/hooks/use-trade-store';
import AppLayout from '@/components/app-layout';
import { AuthProvider } from '@/hooks/use-auth';

export const metadata: Metadata = {
  title: 'NiveshSikho360',
  description: 'Learn and practice stock trading with NiveshSikho360.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <NiveshProvider>
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster />
          </NiveshProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
