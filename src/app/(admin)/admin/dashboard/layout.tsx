import type { PropsWithChildren } from 'react';
import LayoutWrap from './LayoutWrap';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <LayoutWrap>{children}</LayoutWrap>;
}
