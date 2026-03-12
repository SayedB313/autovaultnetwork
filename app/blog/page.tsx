import Link from "next/link";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Car Storage Guides & Resources",
  description: "Expert guides on car storage — climate controlled storage, indoor storage, costs, and tips for protecting your vehicle.",
};

const GUIDES = [
  {
    title: "Indoor Car Storage: The Complete Guide",
    excerpt: "Everything you need to know about storing your car indoors — from choosing the right facility to preparing your vehicle.",
    href: "/search?type=INDOOR",
    tag: "Guide",
  },
  {
    title: "Climate Controlled Car Storage: Is It Worth It?",
    excerpt: "Climate controlled storage protects against temperature swings, humidity, and condensation. Here's when you need it.",
    href: "/search?type=CLIMATE_CONTROLLED",
    tag: "Guide",
  },
  {
    title: "How Much Does Car Storage Cost in 2026?",
    excerpt: "Average car storage costs by type — indoor ($150-$450/mo), climate controlled ($200-$500/mo), outdoor ($50-$150/mo).",
    href: "/search",
    tag: "Pricing",
  },
  {
    title: "How to Prepare Your Car for Long-Term Storage",
    excerpt: "A checklist for storing your car: fuel stabilizer, battery tender, tire care, cover selection, and insurance considerations.",
    href: "/search",
    tag: "Tips",
  },
  {
    title: "Covered vs Indoor Car Storage: Which Is Better?",
    excerpt: "Compare covered and indoor storage options — protection levels, cost differences, and when each makes sense.",
    href: "/search?type=COVERED",
    tag: "Comparison",
  },
  {
    title: "Car Storage for Classic & Collector Vehicles",
    excerpt: "Special considerations for storing vintage, classic, and collector cars. Why climate control and security matter most.",
    href: "https://autovault.network",
    tag: "Specialty",
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="bg-[#FAFAF8] min-h-screen">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Resources</span>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            Car Storage Guides & Resources
          </h1>
          <p className="text-gray-500 mb-10">
            Expert advice on choosing, preparing for, and getting the most out of car storage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GUIDES.map((g) => (
              <Link
                key={g.title}
                href={g.href}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all"
              >
                <span className="text-xs font-semibold text-[#1B4FD8] bg-blue-50 px-2.5 py-1 rounded-full">
                  {g.tag}
                </span>
                <h2 className="font-bold text-gray-900 mt-3 mb-2 group-hover:text-[#1B4FD8] transition-colors leading-snug" style={{ fontFamily: "Syne, sans-serif" }}>
                  {g.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">{g.excerpt}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-[#1B4FD8]">
                  Read more
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
