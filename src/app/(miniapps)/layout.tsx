import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import NextTopLoader from 'nextjs-toploader';
import { Root } from '@/components/Root/Root';

import '@telegram-apps/telegram-ui/dist/styles.css';
import 'normalize.css/normalize.css';
import '../_assets/globals.css';

export const metadata: Metadata = {
  title: 'Bazaar On TON',
  description: 'Channels directory',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader />
        <Root>{children}</Root>
      </body>
    </html>
  );
}
