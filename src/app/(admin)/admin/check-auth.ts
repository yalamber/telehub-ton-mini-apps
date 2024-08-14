import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import authOptions from '@/app/api/auth/[...nextauth]/authOptions';

export async function checkAuthSessionRedirect(
  allowIfSession: boolean = true,
  redirectTo: string = '/admin'
) {
  const session = await getServerSession(authOptions);
  if (allowIfSession && !session) {
    redirect(redirectTo);
  }
  if (!allowIfSession && session) {
    redirect(redirectTo);
  }
}
