import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';

import { Root } from '@/components/Root/Root';
import '@telegram-apps/telegram-ui/dist/styles.css';

import 'normalize.css/normalize.css';
import '../_assets/globals.css';

export const metadata: Metadata = {
  title: 'Bazaar On TON',
  description: 'Channels directory',
};

const fonts = localFont({
  variable: '--font-gelix',
  src: [
    {
      path: '../_assets/gelix/Gellix-Regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../_assets/gelix/Gellix-Bold.woff2',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: '../_assets/gelix/Gellix-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../_assets/gelix/Gellix-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../_assets/elix/Gellix-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../_assets/gelix/Gellix-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../_assets/gelix/Gellix-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../_assets/gelix/Gellix-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={`${fonts.variable} font-gelix`}>
      <body>
        <NextTopLoader />
        <Root>{children}</Root>
      </body>
    </html>
  );
}
