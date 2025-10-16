import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { MongoDBProvider } from '@/context/MongoDBContext';
import { CurrencyProvider } from '@/context/CurrencyContext';

export const metadata: Metadata = {
  title: 'Culinary Canvas',
  description: 'Personalized meal plans by chefs and AI.',
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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CurrencyProvider>
          <MongoDBProvider>
            <div className="flex h-min-screen flex-col">
              <Header />
              <main className="main">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </MongoDBProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
