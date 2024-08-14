import { checkAuthSessionRedirect } from '@/app/(admin)/admin/check-auth';
import FilterOptionsPage from '../FilterOptionPage';

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: {
    parent?: string;
  };
}) {
  await checkAuthSessionRedirect(true, '/admin');
  return (
    <FilterOptionsPage
      title="Cities"
      type="CITY"
      parent={searchParams?.parent}
    />
  );
}
