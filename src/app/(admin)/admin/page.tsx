'use client';
import { LoginButton } from '@telegram-auth/react';

export default function AdminPage() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
        <a
          href="/admin"
          className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white"
        >
          <span>TELEHUB</span>
        </a>
        <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800 text-center flex items-center flex-col">
          <h2 className="font-bold text-gray-900 dark:text-white">
            Sign in to manage
          </h2>
          <LoginButton
            botUsername={process.env.NEXT_PUBLIC_TB_BOT_USERNAME as string}
            authCallbackUrl="/api/auth_callback"
            buttonSize="large" // "large" | "medium" | "small"
            cornerRadius={5} // 0 - 20
            showAvatar={true} // true | false
            lang="en"
          />
        </div>
      </div>
    </main>
  );
}
