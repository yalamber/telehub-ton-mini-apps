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

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'telegram-login',
      name: 'Telegram Login',
      credentials: {},
      async authorize(credentials, req) {
        const validator = new AuthDataValidator({
          botToken: `${process.env.TG_TOKEN}`,
        });

        const data = objectToAuthDataMap(req.query || {});
        const user = await validator.validate(data);
        console.log('user ======>', user);
        if (user.id && user.first_name) {
          const returned = {
            id: user.id.toString(),
            email: user.id.toString(),
            name: [user.first_name, user.last_name || ''].join(' '),
            image: user.photo_url,
          };

          try {
            // TODO create or update user in database
          } catch {
            console.log('Something went wrong while creating the user.');
          }

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
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

export default authOptions;
