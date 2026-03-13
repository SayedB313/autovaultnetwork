import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://carstoragefinder.co";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  // State pages
  const states = await prisma.statePage.findMany({ select: { slug: true, updatedAt: true } });
  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${baseUrl}/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // City pages — transform slug from "los-angeles-ca" to "/ca/los-angeles"
  const cities = await prisma.cityPage.findMany({ select: { slug: true, updatedAt: true } });
  const cityPages: MetadataRoute.Sitemap = cities.map((c) => {
    const parts = c.slug.split("-");
    const stateCode = parts[parts.length - 1];
    const citySlug = parts.slice(0, -1).join("-");
    return {
      url: `${baseUrl}/${stateCode}/${citySlug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  // Facility pages (top 5000 by rating for sitemap size limit)
  const facilities = await prisma.facility.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { rating: "desc" },
    take: 5000,
  });
  const facilityPages: MetadataRoute.Sitemap = facilities.map((f) => ({
    url: `${baseUrl}/facility/${f.slug}`,
    lastModified: f.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...statePages, ...cityPages, ...facilityPages];
}
