import { checkAuthSessionRedirect } from '@/app/(admin)/admin/check-auth';

export default async function AdminPage() {
  await checkAuthSessionRedirect(true, '/admin');
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 mt-4 xl:grid-cols-2 2xl:grid-cols-3">
        <div className="h-screen">
          <h2 className="text-white">This is dashboard</h2>
        </div>
      </div>
    </>
  );
}
