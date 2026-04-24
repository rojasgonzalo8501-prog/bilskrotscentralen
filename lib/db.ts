import { PrismaClient } from "./generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makeClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";

  if (url.startsWith("postgres")) {
    const { Pool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new Pool({ connectionString: url });
    return new PrismaClient({ adapter: new PrismaPg(pool) });
  }

  try {
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    return new PrismaClient({
      adapter: new PrismaBetterSqlite3({ url: url || "file:./dev.db" }),
    });
  } catch {
    throw new Error("No DATABASE_URL set and better-sqlite3 is not available.");
  }
}

// Lazy proxy — only creates the real client on first property access (not at import time)
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = makeClient();
    }
    const val = (globalForPrisma.prisma as any)[prop];
    return typeof val === "function" ? val.bind(globalForPrisma.prisma) : val;
  },
});
