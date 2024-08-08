import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import { Root } from '@/components/Root/Root';

import '@telegram-apps/telegram-ui/dist/styles.css';
import 'normalize.css/normalize.css';
import './_assets/globals.css';

export const metadata: Metadata = {
  title: 'Bazaar On TON',
  description: "Let's sell your stuffs",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
