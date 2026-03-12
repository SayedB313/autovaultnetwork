"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#1B4FD8] flex items-center justify-center shadow-sm group-hover:bg-[#1540B0] transition-colors">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                <path fillRule="evenodd" d="M4 12a1 1 0 000 2h4a1 1 0 000-2H4zm6 0a1 1 0 000 2h4a1 1 0 000-2h-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-[#0C1A2E] text-lg tracking-tight leading-none" style={{ fontFamily: 'Syne, sans-serif' }}>
                CarStorage<span className="text-[#1B4FD8]">Finder</span>
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Find Storage
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Resources
            </Link>
            <a
              href="https://autovault.network"
              target="_blank"
              rel="noopener"
              className="text-sm font-medium text-[#E85D2F] hover:text-[#c04a22] transition-colors flex items-center gap-1"
            >
              <span>Luxury Storage</span>
              <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              Browse All
            </Link>
            <Link
              href="/search"
              className="text-sm font-semibold bg-[#1B4FD8] text-white px-4 py-2 rounded-lg hover:bg-[#1540B0] transition-colors shadow-sm"
            >
              Find Storage
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
          <Link href="/search" className="text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Find Storage</Link>
          <Link href="/blog" className="text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Resources</Link>
          <a href="https://autovault.network" target="_blank" rel="noopener" className="text-sm font-medium text-[#E85D2F] py-2">Luxury Storage ↗</a>
          <Link href="/search" className="text-sm font-medium text-gray-700 py-2">Browse All</Link>
          <Link href="/search" className="text-sm font-semibold bg-[#1B4FD8] text-white px-4 py-2.5 rounded-lg text-center">Find Storage</Link>
        </div>
      )}
    </header>
  );
}
