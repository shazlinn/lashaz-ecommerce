// lashaz-ecommerce/lib/auth.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './prisma';
import * as bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user || !user.hashedPassword) return null;

        const ok = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role ?? 'customer',
          // Include new fields in initial authorization
          phone: user.phone,
          address: user.address,
        };
      },
    }),
  ],

  callbacks: {
    // The trigger parameter is key to making the frontend update() work
    async jwt({ token, user, trigger, session }) {
      // 1. Handle the manual session update trigger
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.phone = session.user.phone;
        token.address = session.user.address;
      }

      // 2. Initial login: attach user data to the token
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? 'customer';
        token.phone = (user as any).phone;
        token.address = (user as any).address;
      }

      // 3. Always fetch the latest data from DB to keep token fresh
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email! },
      });

      if (dbUser) {
        token.role = dbUser.role;
        token.phone = dbUser.phone;
        token.address = dbUser.address;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) ?? 'customer';
        (session.user as any).phone = token.phone as string; //
        (session.user as any).address = token.address as string; //
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
};

export const getAuthSession = () => getServerSession(authOptions);