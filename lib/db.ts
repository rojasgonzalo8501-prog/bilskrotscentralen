import { PrismaClient } from "./generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

type PrismaRecord = Record<string | symbol, unknown>;

function makeClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";

  if (url.startsWith("postgres")) {
    const pool = new Pool({ connectionString: url });
    return new PrismaClient({ adapter: new PrismaPg(pool) });
  }

  try {
    // SQLite adapter is only needed for local dev. It's an optional dep, so
    // require() it lazily to keep Vercel (postgres-only) builds green.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    return new PrismaClient({
      adapter: new PrismaBetterSqlite3({ url: url || "file:./dev.db" }),
    });
  } catch {
    throw new Error("No DATABASE_URL set and better-sqlite3 is not available.");
  }
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = makeClient();
    }
    const client = globalForPrisma.prisma as unknown as PrismaRecord;
    const val = client[prop];
    return typeof val === "function"
      ? (val as (...args: unknown[]) => unknown).bind(globalForPrisma.prisma)
      : val;
  },
});
