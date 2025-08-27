import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlobalLoadingSpinner from '../components/GlobalLoadingSpinner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Esperar params y validar locale
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale}>
      <html lang={locale}>
        <body className={`${inter.className} text-gray-100`}>
          <div className="fixed inset-0 -z-20">
            <Image
              src="/images/background-clouds.webp"
              alt="Cielo dramático con nubes y sol brillante como fondo global"
              fill
              style={{ objectFit: 'cover' }}
              quality={100}
              priority
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>

          <div className="relative z-10 flex flex-col h-screen">
            <Header />
            <main className="flex-1 overflow-hidden">{children}</main>
            <Footer />
          </div>
          
          <GlobalLoadingSpinner />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
