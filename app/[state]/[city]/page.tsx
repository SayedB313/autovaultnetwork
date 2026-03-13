import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FacilityCard from "@/components/FacilityCard";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ state: string; city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params;
  const slug = `${city}-${state}`;
  const cityPage = await prisma.cityPage.findUnique({ where: { slug } });
  if (!cityPage) return { title: "Not Found" };
  return {
    title: cityPage.metaTitle || `Car Storage in ${cityPage.city}, ${cityPage.stateCode} — ${cityPage.facilityCount} Facilities`,
    description: cityPage.metaDesc || `Compare ${cityPage.facilityCount} car storage facilities in ${cityPage.city}, ${cityPage.state}. Indoor, climate controlled, covered and outdoor options.`,
  };
}

export default async function CityPage({ params }: Props) {
  const { state, city } = await params;
  const slug = `${city}-${state}`;

  const cityPage = await prisma.cityPage.findUnique({ where: { slug } });
  if (!cityPage) notFound();

  const facilities = await prisma.facility.findMany({
    where: { city: cityPage.city, state: cityPage.state },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
    select: {
      id: true, slug: true, name: true, address: true, city: true, state: true,
      lat: true, lng: true, rating: true, reviewCount: true, phone: true,
      storageTypes: true, featured: true, claimed: true, priceMonthly: true,
      photos: { where: { isPrimary: true }, select: { url: true }, take: 1 },
    },
  });

  return (
    <>
      <Header />
      <main className="bg-[#FAFAF8] min-h-screen">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/${state}`} className="hover:text-gray-900 transition-colors">{cityPage.state}</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{cityPage.city}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            Car Storage in {cityPage.city}, {cityPage.stateCode}
          </h1>
          <p className="text-gray-500 mb-8">
            {cityPage.facilityCount} facilities found
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((f) => (
              <FacilityCard
                key={f.id}
                slug={f.slug}
                name={f.name}
                address={f.address}
                city={f.city}
                state={f.state}
                rating={f.rating}
                reviewCount={f.reviewCount}
                phone={f.phone}
                storageTypes={f.storageTypes}
                claimed={f.claimed}
                featured={f.featured}
                priceMonthly={f.priceMonthly}
                photoUrl={f.photos[0]?.url || null}
              />
            ))}
          </div>

          {cityPage.content && (
            <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
                About Car Storage in {cityPage.city}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{cityPage.content}</p>
            </div>
          )}

          {/* Back to state */}
          <div className="mt-8">
            <Link href={`/${state}`} className="text-sm font-semibold text-[#1B4FD8] hover:text-[#1540B0]">
              ← All cities in {cityPage.state}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
