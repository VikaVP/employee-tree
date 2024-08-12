/* eslint-disable import/no-extraneous-dependencies */

import '@/styles/global.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { PrimeReactProvider } from 'primereact/api';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export default function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(props.params.locale);

  return (
    <html lang={props.params.locale}>
      <body className="flex min-h-[80vh] flex-col bg-background text-foreground antialiased sm:min-h-[85vh] lg:min-h-[80vh]">
        <PrimeReactProvider>{props.children}</PrimeReactProvider>
      </body>
    </html>
  );
}
