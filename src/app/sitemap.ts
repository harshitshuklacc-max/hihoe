import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-ready";

/** Do not query the DB at build time (Vercel may not have DATABASE_URL yet). */
export const dynamic = "force-dynamic";

async function getProductSitemapEntries() {
  if (!isDatabaseConfigured()) return [];
  try {
    return await prisma.product.findMany({
      where: { isActive: true, quantity: { gt: 0 } },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const products = await getProductSitemapEntries();

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...products.map((p) => ({
      url: `${base}/shop/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
