// Path: lib/auth.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions, User, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';
import * as bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) {
          throw new Error('Invalid credentials');
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // Redirect users to /login if they are not signed in
  },
  // Callbacks are defined in the next step
  // In lib/auth.ts, add this `callbacks` block inside your `authOptions` object
    callbacks: {
        async jwt({ token, user }) {
        // On initial sign in, the `user` object is available
        if (user) {
            token.id = user.id;
            token.role = user.role; // The role is from your Prisma schema
        }
        return token;
        },
        async session({ session, token }) {
        // The token object has the properties we added in the `jwt` callback
        if (session.user) {
            session.user.id = token.id;
            session.user.role = token.role;
        }
        return session;
        },
    },
};

// Helper function to get the session on the server side
export const getAuthSession = () => getServerSession(authOptions);