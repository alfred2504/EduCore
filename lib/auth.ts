import NextAuth from "next-auth";
import type { Session } from "next-auth";
import type { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";

import { prisma } from "./prisma";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

type CredentialsInput = {
  email?: string;
  password?: string;
};

type SessionUser = {
  role?: string;
  status?: string;
} | null | undefined;

export const authOptions = {
  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials: CredentialsInput | undefined): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          return null;
        }

        const userStatus = user.status ?? "APPROVED";

        if (userStatus !== "APPROVED") {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: userStatus,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role;
        token.status = user.status ?? "APPROVED";
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT & { role?: string; status?: string } }) {
      if (session.user) {
        session.user.role = token.role ?? "STUDENT";
        session.user.status = token.status ?? "APPROVED";
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };