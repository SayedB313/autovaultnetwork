import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "relevance";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 40;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (q) {
    where.OR = [
      { city: { contains: q, mode: "insensitive" } },
      { state: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { zip: { contains: q, mode: "insensitive" } },
    ];
  }

  if (type) {
    where.storageTypes = { has: type };
  }

  let orderBy: any = { featured: "desc" };
  if (sort === "rating") orderBy = [{ featured: "desc" }, { rating: "desc" }];
  if (sort === "reviews") orderBy = [{ featured: "desc" }, { reviewCount: "desc" }];

  const [facilities, total] = await Promise.all([
    prisma.facility.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        address: true,
        city: true,
        state: true,
        lat: true,
        lng: true,
        rating: true,
        reviewCount: true,
        phone: true,
        storageTypes: true,
        featured: true,
        claimed: true,
        priceMonthly: true,
        photos: { where: { isPrimary: true }, select: { url: true }, take: 1 },
      },
    }),
    prisma.facility.count({ where }),
  ]);

  return NextResponse.json({
    facilities: facilities.map((f) => ({
      ...f,
      photoUrl: f.photos[0]?.url || null,
    })),
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
