/** True when Prisma can connect (required on Vercel — set DATABASE_URL in project env). */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
