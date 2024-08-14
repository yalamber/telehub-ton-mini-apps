import { checkAuthSessionRedirect } from '@/app/(admin)/admin/check-auth';
import FilterOptionsPage from '../FilterOptionPage';

export default async function AdminPage() {
  await checkAuthSessionRedirect(true, '/admin');
  return <FilterOptionsPage title="Languages" type="LANGUAGE" />;
}
