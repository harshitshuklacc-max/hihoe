import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getTursoConfig(): { url: string; authToken: string } | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url?.startsWith("libsql://")) return null;

  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (authToken) {
    const baseUrl = url.split("?")[0];
    return { url: baseUrl, authToken };
  }

  const parsed = new URL(url.replace(/^libsql:/, "https:"));
  const tokenFromUrl = parsed.searchParams.get("authToken");
  if (!tokenFromUrl) return null;

  return {
    url: `libsql://${parsed.host}${parsed.pathname}`,
    authToken: tokenFromUrl,
  };
}

function createPrismaClient() {
  const turso = getTursoConfig();
  const log =
    process.env.NODE_ENV === "development" ? (["error", "warn"] as const) : (["error"] as const);

  if (turso) {
    const adapter = new PrismaLibSql({
      url: turso.url,
      authToken: turso.authToken,
    });
    return new PrismaClient({ adapter, log: [...log] });
  }

  return new PrismaClient({ log: [...log] });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
