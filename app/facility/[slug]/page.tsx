import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const facility = await prisma.facility.findUnique({
    where: { slug },
    select: { name: true, city: true, state: true, metaTitle: true, metaDesc: true },
  });
  if (!facility) return { title: "Not Found" };
  return {
    title: facility.metaTitle || `${facility.name} — Car Storage in ${facility.city}, ${facility.state}`,
    description: facility.metaDesc || `Find car storage at ${facility.name} in ${facility.city}, ${facility.state}. View ratings, photos, contact info, and storage types.`,
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const TYPE_LABELS: Record<string, string> = {
  INDOOR: "Indoor Storage",
  CLIMATE_CONTROLLED: "Climate Controlled",
  COVERED: "Covered Storage",
  OUTDOOR: "Outdoor Storage",
};

const TYPE_COLORS: Record<string, string> = {
  INDOOR: "bg-blue-50 text-blue-700 border-blue-200",
  CLIMATE_CONTROLLED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  COVERED: "bg-orange-50 text-orange-700 border-orange-200",
  OUTDOOR: "bg-gray-50 text-gray-600 border-gray-200",
};

export default async function FacilityPage({ params }: Props) {
  const { slug } = await params;

  const facility = await prisma.facility.findUnique({
    where: { slug },
    include: {
      photos: { orderBy: { isPrimary: "desc" }, take: 6 },
    },
  });

  if (!facility) notFound();

  const stateSlug = facility.state.toLowerCase().replace(/\s+/g, "-");
  const citySlug = facility.city.toLowerCase().replace(/\s+/g, "-");

  // Nearby facilities (same city, different facility)
  const nearby = await prisma.facility.findMany({
    where: { city: facility.city, state: facility.state, id: { not: facility.id } },
    take: 4,
    orderBy: { rating: "desc" },
    select: { slug: true, name: true, rating: true, reviewCount: true, storageTypes: true, address: true },
  });

  return (
    <>
      <Header />
      <main className="bg-[#FAFAF8] min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/${stateSlug}`} className="hover:text-gray-900 transition-colors">{facility.state}</Link>
              <span>/</span>
              <Link href={`/${stateSlug}/${citySlug}`} className="hover:text-gray-900 transition-colors">{facility.city}</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate max-w-[200px]">{facility.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div>
                {facility.storageTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {facility.storageTypes.map((t) => (
                      <span key={t} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${TYPE_COLORS[t] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                        {TYPE_LABELS[t] || t}
                      </span>
                    ))}
                    {facility.verified && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
                        Verified
                      </span>
                    )}
                  </div>
                )}

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "Syne, sans-serif" }}>
                  {facility.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {facility.address}, {facility.city}, {facility.state} {facility.zip}
                  </span>
                </div>

                {facility.rating && (
                  <div className="flex items-center gap-3 mt-4">
                    <StarRating rating={facility.rating} />
                    <span className="text-lg font-bold text-gray-900">{facility.rating.toFixed(1)}</span>
                    {facility.reviewCount && (
                      <span className="text-sm text-gray-500">({facility.reviewCount.toLocaleString()} reviews)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Photo grid */}
              {facility.photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-xl overflow-hidden">
                  {facility.photos.map((p, i) => (
                    <div key={p.id} className={`relative bg-gray-100 ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"}`}>
                      <img src={p.url} alt={`${facility.name} photo ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {facility.description && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-bold text-gray-900 mb-3" style={{ fontFamily: "Syne, sans-serif" }}>About This Facility</h2>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{facility.description}</p>
                </div>
              )}

              {/* Storage Types Detail */}
              {facility.storageTypes.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Storage Options</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {facility.storageTypes.map((t) => (
                      <div key={t} className={`p-4 rounded-lg border ${TYPE_COLORS[t] || "bg-gray-50 border-gray-200"}`}>
                        <span className="font-semibold text-sm">{TYPE_LABELS[t] || t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby */}
              {nearby.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                    More Storage in {facility.city}
                  </h2>
                  <div className="space-y-3">
                    {nearby.map((n) => (
                      <Link key={n.slug} href={`/facility/${n.slug}`} className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                        <div className="font-semibold text-sm text-gray-900">{n.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{n.address}</div>
                        {n.rating && (
                          <div className="text-xs text-gray-500 mt-1">
                            {"★".repeat(Math.round(n.rating))} {n.rating.toFixed(1)} ({n.reviewCount} reviews)
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                  <Link href={`/${stateSlug}/${citySlug}`} className="inline-block mt-4 text-sm font-semibold text-[#1B4FD8] hover:text-[#1540B0]">
                    View all in {facility.city} →
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Contact card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Contact</h3>

                {facility.phone && (
                  <a href={`tel:${facility.phone}`} className="flex items-center gap-3 p-3 bg-[#1B4FD8] text-white rounded-lg hover:bg-[#1540B0] transition-colors mb-3">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-semibold text-sm">{facility.phone}</span>
                  </a>
                )}

                {facility.website && (
                  <a href={facility.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-3">
                    <svg className="w-5 h-5 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="font-medium text-sm text-gray-700">Visit Website</span>
                  </a>
                )}

                {/* Address */}
                <div className="pt-3 border-t border-gray-100 mt-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Address</div>
                  <p className="text-sm text-gray-700">{facility.address}</p>
                  <p className="text-sm text-gray-700">{facility.city}, {facility.state} {facility.zip}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${facility.name} ${facility.address} ${facility.city} ${facility.state}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B4FD8] mt-2 hover:text-[#1540B0]"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>

                {/* Price */}
                {facility.priceMonthly && (
                  <div className="pt-3 border-t border-gray-100 mt-3">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Starting At</div>
                    <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Syne, sans-serif" }}>
                      ${Math.round(facility.priceMonthly)}<span className="text-sm font-normal text-gray-500">/month</span>
                    </div>
                  </div>
                )}

              </div>

              {/* AutoVault Cross-Link CTA */}
              <div className="bg-gradient-to-br from-[#0C1A2E] to-[#1B2E47] rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-[#E85D2F] bg-[#E85D2F]/15 px-2.5 py-0.5 rounded-full">
                    LUXURY
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                  Need Premium Storage?
                </h3>
                <p className="text-sm text-white/60 mb-4 leading-relaxed">
                  Exotic, classic, or luxury vehicle? Browse 405 vetted premium facilities on AutoVault.
                </p>
                <a
                  href="https://autovault.network/search"
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center gap-2 bg-[#E85D2F] hover:bg-[#c04a22] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors w-full"
                >
                  Browse AutoVault
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
