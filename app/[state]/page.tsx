import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const statePage = await prisma.statePage.findUnique({ where: { slug: state } });
  if (!statePage) return { title: "Not Found" };
  return {
    title: statePage.metaTitle || `Car Storage in ${statePage.state} — ${statePage.facilityCount} Facilities`,
    description: statePage.metaDesc || `Find ${statePage.facilityCount} car storage facilities across ${statePage.cityCount} cities in ${statePage.state}. Indoor, climate controlled, and covered options.`,
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;

  const statePage = await prisma.statePage.findUnique({ where: { slug: state } });
  if (!statePage) notFound();

  const cities = await prisma.cityPage.findMany({
    where: { state: statePage.state },
    orderBy: { facilityCount: "desc" },
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
              <span className="text-gray-900 font-medium">{statePage.state}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            Car Storage in {statePage.state}
          </h1>
          <p className="text-gray-500 mb-8">
            {statePage.facilityCount} facilities across {statePage.cityCount} cities
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/${state}/${c.slug.replace(new RegExp(`-${state}$`), "")}`}
                className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-[#1B4FD8] hover:shadow-sm transition-all"
              >
                <div className="font-bold text-sm text-gray-900 group-hover:text-[#1B4FD8]" style={{ fontFamily: "Syne, sans-serif" }}>
                  {c.city}
                </div>
                <div className="text-xs text-gray-500 mt-1">{c.facilityCount} facilities</div>
              </Link>
            ))}
          </div>

          {statePage.content && (
            <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{statePage.content}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
