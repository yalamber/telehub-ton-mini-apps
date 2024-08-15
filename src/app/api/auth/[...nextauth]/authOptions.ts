import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { objectToAuthDataMap, AuthDataValidator } from '@telegram-auth/server';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      image: string;
      email: string;
    };
  }
}

const ADMIN_USERS = ['7108516313', '1279815786', '1253120502'];

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'telegram-login',
      name: 'Telegram Login',
      credentials: {},
      async authorize(credentials, req) {
        const validator = new AuthDataValidator({
          botToken: `${process.env.TG_BOT_TOKEN}`,
        });
        const data = objectToAuthDataMap(req.query || {});
        const user = await validator.validate(data);
        if (
          user.id &&
          user.first_name &&
          ADMIN_USERS.includes(user.id.toString())
        ) {
          const returned = {
            id: user.id.toString(),
            email: user.id.toString(),
            name: [user.first_name, user.last_name || ''].join(' '),
            image: user.photo_url,
          };
          return returned;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      session.user.id = session.user.email;
      return session;
    },
  },
  pages: {
    signIn: '/admin',
    error: '/error',
  },
};

export default authOptions;
