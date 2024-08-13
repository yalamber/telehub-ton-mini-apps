import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import NextTopLoader from 'nextjs-toploader';
import { Root } from '@/components/Root/NonMiniAppRoot';
import '@telegram-apps/telegram-ui/dist/styles.css';
import 'normalize.css/normalize.css';
import '../_assets/globals.css';

export const metadata: Metadata = {
  title: 'Bazaar On TON',
  description: 'Admin panel',
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
