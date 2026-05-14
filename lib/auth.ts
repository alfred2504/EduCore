import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "./prisma";

export const authOptions = {
  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        const userStatus = (user as any).status ?? "APPROVED";

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
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.status = (user as any).status ?? "APPROVED";
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.status = token.status;
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