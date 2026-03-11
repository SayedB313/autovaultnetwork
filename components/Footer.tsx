import Link from "next/link";

const TOP_CITIES = [
  { label: "Los Angeles, CA", href: "/california/los-angeles" },
  { label: "Phoenix, AZ", href: "/arizona/phoenix" },
  { label: "Houston, TX", href: "/texas/houston" },
  { label: "Las Vegas, NV", href: "/nevada/las-vegas" },
  { label: "Miami, FL", href: "/florida/miami" },
  { label: "Dallas, TX", href: "/texas/dallas" },
  { label: "Chicago, IL", href: "/illinois/chicago" },
  { label: "Denver, CO", href: "/colorado/denver" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0C1A2E] text-white">
      {/* Cross-link banner */}
      <div className="border-b border-white/10 bg-[#E85D2F]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">
              Have a collector, exotic, or luxury vehicle?
            </p>
            <p className="text-sm text-white/70 mt-0.5">
              AutoVault is our curated directory for high-end storage facilities.
            </p>
          </div>
          <a
            href="https://autovault.network"
            target="_blank"
            rel="noopener"
            className="shrink-0 bg-[#E85D2F] hover:bg-[#c04a22] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
          >
            Browse AutoVault
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#1B4FD8] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                  <path fillRule="evenodd" d="M4 12a1 1 0 000 2h4a1 1 0 000-2H4zm6 0a1 1 0 000 2h4a1 1 0 000-2h-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="font-bold text-white text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                AutoVault<span className="text-[#1B4FD8]">Network</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              The largest directory of car storage facilities in the US. Find indoor, climate-controlled, and covered storage near you.
            </p>
            <div className="mt-5 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-xs text-white/50">9,413 facilities listed</span>
            </div>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Top Cities</h4>
            <ul className="space-y-2.5">
              {TOP_CITIES.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-sm text-white/65 hover:text-white transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><Link href="/blog" className="text-sm text-white/65 hover:text-white transition-colors">Storage Guides</Link></li>
              <li><Link href="/blog/climate-controlled-car-storage" className="text-sm text-white/65 hover:text-white transition-colors">Climate Controlled Storage</Link></li>
              <li><Link href="/blog/car-storage-cost" className="text-sm text-white/65 hover:text-white transition-colors">Car Storage Costs</Link></li>
              <li><Link href="/blog/indoor-car-storage" className="text-sm text-white/65 hover:text-white transition-colors">Indoor Car Storage</Link></li>
              <li>
                <a href="https://autovault.network" target="_blank" rel="noopener" className="text-sm text-[#E85D2F]/80 hover:text-[#E85D2F] transition-colors">
                  AutoVault (Luxury) ↗
                </a>
              </li>
            </ul>
          </div>

          {/* For Facilities */}
          <div>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">For Facilities</h4>
            <ul className="space-y-2.5">
              <li><Link href="/claim" className="text-sm text-white/65 hover:text-white transition-colors">Claim Your Listing</Link></li>
              <li><Link href="/pricing" className="text-sm text-white/65 hover:text-white transition-colors">Pricing & Plans</Link></li>
              <li><Link href="/contact" className="text-sm text-white/65 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-white/50 mb-2">Is your facility listed?</p>
              <Link
                href="/claim"
                className="text-xs font-semibold text-[#1B4FD8] hover:text-blue-400 transition-colors"
              >
                Claim it for free →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/35">
            © 2026 AutoVaultNetwork. Part of the AutoVault family of directories.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-white/35 hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-white/35 hover:text-white/60 transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="text-xs text-white/35 hover:text-white/60 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
