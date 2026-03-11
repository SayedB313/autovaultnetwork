"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FacilityCard from "@/components/FacilityCard";

// Lazy-load map to avoid SSR issues
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#1B4FD8] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
});

const STORAGE_TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "INDOOR", label: "Indoor" },
  { value: "CLIMATE_CONTROLLED", label: "Climate Controlled" },
  { value: "COVERED", label: "Covered" },
  { value: "OUTDOOR", label: "Outdoor" },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Best match" },
  { value: "rating", label: "Highest rated" },
  { value: "reviews", label: "Most reviewed" },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";
  const sort = searchParams.get("sort") || "relevance";

  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"split" | "list">("split");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState(type);
  const [selectedSort, setSelectedSort] = useState(sort);

  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (selectedType) params.set("type", selectedType);
      if (selectedSort) params.set("sort", selectedSort);
      const res = await fetch(`/api/facilities?${params}`);
      const data = await res.json();
      setFacilities(data.facilities || []);
      setTotal(data.total || 0);
    } catch {
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  }, [q, selectedType, selectedSort]);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  function applyFilters() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (selectedType) params.set("type", selectedType);
    if (selectedSort) params.set("sort", selectedSort);
    router.push(`/search?${params}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8]">
      <Header />

      {/* Search bar + filters */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <SearchBar defaultValue={q} size="compact" />
            </div>

            {/* Storage type filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-11 px-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:border-[#1B4FD8] cursor-pointer shrink-0"
            >
              {STORAGE_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="h-11 px-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:border-[#1B4FD8] cursor-pointer shrink-0"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* View toggle */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-lg p-1 shrink-0">
              <button
                onClick={() => setViewMode("split")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "split" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "list" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="text-sm text-gray-500">
          {loading ? (
            <span>Searching...</span>
          ) : (
            <span>
              <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> facilities
              {q ? ` near "${q}"` : " across the US"}
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex ${viewMode === "split" ? "lg:flex-row" : "flex-col"}`}>
        {/* Listings panel */}
        <div
          className={`overflow-y-auto ${
            viewMode === "split"
              ? "w-full lg:w-[420px] xl:w-[480px] shrink-0"
              : "w-full"
          }`}
          style={{ maxHeight: viewMode === "split" ? "calc(100vh - 140px)" : undefined }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#1B4FD8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-20 px-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "Syne, sans-serif" }}>No results found</h3>
              <p className="text-sm text-gray-500">Try a different city, ZIP code, or storage type.</p>
            </div>
          ) : (
            <div className={`p-4 ${viewMode === "split" ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto"}`}>
              {facilities.map((f: any) => (
                <div
                  key={f.id}
                  onMouseEnter={() => setActiveId(f.id)}
                  onMouseLeave={() => setActiveId(null)}
                  className={`transition-all rounded-xl ${activeId === f.id && viewMode === "split" ? "ring-2 ring-[#1B4FD8]" : ""}`}
                >
                  <FacilityCard
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
                    compact={viewMode === "split"}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map panel (split view only) */}
        {viewMode === "split" && (
          <div className="hidden lg:block flex-1 relative sticky top-[140px]" style={{ height: "calc(100vh - 140px)" }}>
            <MapView
              facilities={facilities}
              activeId={activeId}
              onFacilityClick={(id) => setActiveId(id)}
            />
          </div>
        )}
      </div>

      {/* AutoVault cross-link (bottom of results) */}
      {!loading && facilities.length > 0 && (
        <div className="border-t border-gray-200 bg-[#FFF8F5] py-5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Storing an exotic or collector car?</span>{" "}
              AutoVault lists vetted luxury car storage facilities.
            </p>
            <a
              href="https://autovault.network"
              target="_blank"
              rel="noopener"
              className="shrink-0 text-sm font-semibold text-[#E85D2F] hover:text-[#c04a22] flex items-center gap-1 transition-colors"
            >
              Browse AutoVault ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
