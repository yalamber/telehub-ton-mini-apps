import { checkAuthSessionRedirect } from '@/app/(admin)/admin/check-auth';
import LinkPage from './LinkPage';

export default async function AdminPage() {
  await checkAuthSessionRedirect(true, '/admin');
  return <LinkPage />;
}
