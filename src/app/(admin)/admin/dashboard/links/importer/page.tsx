import { checkAuthSessionRedirect } from '@/app/(admin)/admin/check-auth';
import LinkImporterPage from './LinkImporterPage';

export default async function AdminPage() {
  await checkAuthSessionRedirect(true, '/admin');
  return <LinkImporterPage />;
}
