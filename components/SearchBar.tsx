"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  defaultValue?: string;
  size?: "hero" | "compact";
  placeholder?: string;
}

export default function SearchBar({
  defaultValue = "",
  size = "hero",
  placeholder = "City, ZIP, or address",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  const isHero = size === "hero";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden focus-within:border-[#1B4FD8] focus-within:shadow-md transition-all ${
          isHero ? "h-14 sm:h-16" : "h-11"
        }`}
      >
        {/* Icon */}
        <div className={`pl-4 text-gray-400 shrink-0 ${isHero ? "pl-5" : "pl-3"}`}>
          <svg className={isHero ? "w-5 h-5" : "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 font-medium ${
            isHero
              ? "text-base sm:text-lg px-3"
              : "text-sm px-3"
          }`}
        />

        {/* Storage type quick filter (hero only) */}
        {isHero && (
          <div className="hidden sm:flex items-center gap-1 px-3 border-l border-gray-200">
            <span className="text-xs text-gray-400 font-medium">All types</span>
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className={`shrink-0 bg-[#1B4FD8] hover:bg-[#1540B0] text-white font-semibold transition-colors ${
            isHero
              ? "px-5 sm:px-7 h-full text-sm sm:text-base"
              : "px-4 h-full text-sm"
          }`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
