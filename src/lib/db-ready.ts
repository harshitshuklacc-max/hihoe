function getTursoAuthToken(): string | undefined {
  const fromEnv = process.env.TURSO_AUTH_TOKEN?.trim();
  if (fromEnv) return fromEnv;

  const url = process.env.DATABASE_URL?.trim();
  if (!url?.startsWith("libsql://")) return undefined;

  try {
    const parsed = new URL(url.replace(/^libsql:/, "https:"));
    return parsed.searchParams.get("authToken") || undefined;
  } catch {
    return undefined;
  }
}

/** True when Prisma can connect (Turso needs DATABASE_URL + TURSO_AUTH_TOKEN). */
export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  if (url.startsWith("libsql://")) return Boolean(getTursoAuthToken());
  return true;
}
