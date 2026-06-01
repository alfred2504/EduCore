import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString =
  process.env.DATABASE_URL!;

const pool = new Pool({
  connectionString,
});

const adapter =
  new PrismaPg(pool);

declare global {
  var __prisma:
    | PrismaClient
    | undefined;
}

const globalForPrisma = globalThis as {
  __prisma?: PrismaClient;
};

const hasExpectedDelegates =
  globalForPrisma.__prisma &&
  "student" in globalForPrisma.__prisma &&
  "teacher" in globalForPrisma.__prisma;

export const prisma: PrismaClient =
  hasExpectedDelegates
    ? globalForPrisma.__prisma!
    : new PrismaClient({
        adapter,
      });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}
