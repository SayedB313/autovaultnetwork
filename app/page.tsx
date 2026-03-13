import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";

const TOP_CITIES = [
  { name: "Los Angeles", state: "CA", count: 71, href: "/ca/los-angeles" },
  { name: "Phoenix", state: "AZ", count: 60, href: "/az/phoenix" },
  { name: "Las Vegas", state: "NV", count: 59, href: "/nv/las-vegas" },
  { name: "Houston", state: "TX", count: 56, href: "/tx/houston" },
  { name: "Miami", state: "FL", count: 54, href: "/fl/miami" },
  { name: "Dallas", state: "TX", count: 52, href: "/tx/dallas" },
  { name: "Chicago", state: "IL", count: 48, href: "/il/chicago" },
  { name: "Denver", state: "CO", count: 47, href: "/co/denver" },
  { name: "Atlanta", state: "GA", count: 45, href: "/ga/atlanta" },
  { name: "San Diego", state: "CA", count: 44, href: "/ca/san-diego" },
  { name: "Nashville", state: "TN", count: 43, href: "/tn/nashville" },
  { name: "Seattle", state: "WA", count: 41, href: "/wa/seattle" },
];

const STORAGE_TYPES = [
  {
    icon: "🏢",
    title: "Indoor Storage",
    desc: "Fully enclosed, protected from weather and theft",
    href: "/search?type=INDOOR",
    color: "bg-blue-50 border-blue-200",
    tag: "Most popular",
  },
  {
    icon: "🌡️",
    title: "Climate Controlled",
    desc: "Stable temperature & humidity — ideal for long-term storage",
    href: "/search?type=CLIMATE_CONTROLLED",
    color: "bg-emerald-50 border-emerald-200",
    tag: "Best protection",
  },
  {
    icon: "🏗️",
    title: "Covered Storage",
    desc: "Shaded and protected from sun, rain, and debris",
    href: "/search?type=COVERED",
    color: "bg-orange-50 border-orange-200",
    tag: "Budget-friendly",
  },
  {
    icon: "🅿️",
    title: "Outdoor Storage",
    desc: "Open lots with security — lowest cost option",
    href: "/search?type=OUTDOOR",
    color: "bg-gray-50 border-gray-200",
    tag: "Lowest cost",
  },
];

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Search your area",
    desc: "Enter your city, ZIP code, or address to see facilities near you on an interactive map.",
  },
  {
    num: "02",
    title: "Filter by what matters",
    desc: "Climate controlled, indoor, covered — narrow down by storage type, price range, and ratings.",
  },
  {
    num: "03",
    title: "Contact directly",
    desc: "Call or visit the facility website. No middleman, no booking fees.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#0C1A2E] text-white">
          {/* Grid bg */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Blue accent glow */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#1B4FD8] rounded-full opacity-10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#E85D2F] rounded-full opacity-5 blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#E85D2F] animate-pulse" />
              <span className="text-sm font-medium text-white/60 tracking-wide">
                8,900+ facilities across the US
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl mb-4"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Find Car Storage{" "}
              <span className="text-[#1B4FD8]">Near You</span>
            </h1>
            <p className="text-lg text-white/60 max-w-xl mb-10 leading-relaxed">
              The largest directory of indoor, climate-controlled, and covered car storage facilities. Search free, contact directly.
            </p>

            {/* Search bar */}
            <div className="max-w-2xl">
              <SearchBar size="hero" />
              <div className="flex items-center gap-5 mt-4">
                <button className="text-sm text-white/50 hover:text-white/80 transition-colors flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Use my location
                </button>
                <span className="text-white/20">·</span>
                <Link href="/search" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                  Browse all cities
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/10">
              {[
                { val: "8,900+", label: "Facilities listed" },
                { val: "234", label: "Cities covered" },
                { val: "50", label: "States + Canada" },
                { val: "Free", label: "To search & contact" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                    {s.val}
                  </div>
                  <div className="text-sm text-white/45 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Storage Types ── */}
        <section className="py-16 sm:py-20 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "Syne, sans-serif" }}>
                  Search by Storage Type
                </h2>
                <p className="text-gray-500 mt-2 text-sm">Not all car storage is created equal</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STORAGE_TYPES.map((t) => (
                <Link
                  key={t.title}
                  href={t.href}
                  className={`group relative p-6 rounded-xl border-2 ${t.color} hover:shadow-md transition-all`}
                >
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-medium text-gray-500 bg-white/70 px-2 py-0.5 rounded-full">
                      {t.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5" style={{ fontFamily: "Syne, sans-serif" }}>
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
                  <div className="mt-4 text-sm font-semibold text-[#1B4FD8] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Search facilities
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Top Cities ── */}
        <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "Syne, sans-serif" }}>
                  Browse by City
                </h2>
                <p className="text-gray-500 mt-2 text-sm">234 cities with verified listings</p>
              </div>
              <Link href="/search" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#1B4FD8] hover:text-[#1540B0] transition-colors">
                All cities
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {TOP_CITIES.map((city) => (
                <Link
                  key={city.href}
                  href={city.href}
                  className="group flex flex-col items-start p-4 bg-gray-50 hover:bg-[#1B4FD8] rounded-xl border border-gray-200 hover:border-[#1B4FD8] transition-all"
                >
                  <span className="font-bold text-sm text-gray-900 group-hover:text-white transition-colors" style={{ fontFamily: "Syne, sans-serif" }}>
                    {city.name}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-blue-200 transition-colors mt-0.5">
                    {city.state}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-blue-300 transition-colors mt-2">
                    {city.count} facilities
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-16 sm:py-20 bg-[#FAFAF8] border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
                How CarStorageFinder Works
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Search, compare, and contact storage facilities directly — no signup, no fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.num} className="relative">
                  <div className="text-5xl font-extrabold text-gray-100 mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-[#1B4FD8] hover:bg-[#1540B0] text-white font-semibold px-8 py-3.5 rounded-xl shadow-sm transition-colors text-sm"
              >
                Find storage near you
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── AutoVault Cross-Link Banner ── */}
        <section className="bg-[#0C1A2E] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-[#E85D2F] bg-[#E85D2F]/10 px-3 py-1 rounded-full">
                    LUXURY STORAGE
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
                  Storing a collector or exotic vehicle?
                </h2>
                <p className="text-white/60 leading-relaxed text-sm">
                  AutoVault is our curated directory of high-end car storage facilities — vetted for exotic, classic, and luxury vehicles. Climate-controlled, concierge-level service.
                </p>
                <div className="flex flex-wrap gap-3 mt-4 text-xs text-white/40">
                  <span>✓ 405 premium facilities</span>
                  <span>✓ Ferrari-friendly storage</span>
                  <span>✓ Collector car specialists</span>
                </div>
              </div>
              <div className="shrink-0">
                <a
                  href="https://autovault.network"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2.5 bg-[#E85D2F] hover:bg-[#c04a22] text-white font-semibold px-7 py-4 rounded-xl transition-colors shadow-sm text-sm"
                >
                  Browse AutoVault
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-xs text-white/30 mt-3 text-center">autovault.network</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── List your facility CTA ── */}
        <section className="py-14 bg-[#F1F3F7] border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
              Own a car storage facility?
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Your business may already be listed. Claim your free listing to manage photos, pricing, and contact info.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/search"
                className="bg-[#0C1A2E] hover:bg-[#1B2E47] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                Search facilities
              </Link>
              <a
                href="https://autovault.network"
                target="_blank"
                rel="noopener"
                className="text-sm font-medium text-[#E85D2F] hover:text-[#c04a22] transition-colors flex items-center gap-1"
              >
                Luxury storage on AutoVault ↗
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
