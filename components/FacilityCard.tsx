import Link from "next/link";
import Image from "next/image";

interface FacilityCardProps {
  slug: string;
  name: string;
  address: string;
  city: string;
  state: string;
  rating?: number | null;
  reviewCount?: number | null;
  phone?: string | null;
  website?: string | null;
  storageTypes?: string[];
  claimed?: boolean;
  featured?: boolean;
  priceMonthly?: number | null;
  photoUrl?: string | null;
  distance?: number | null;
  compact?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function StorageTypeBadge({ type }: { type: string }) {
  const labels: Record<string, { label: string; color: string }> = {
    INDOOR: { label: "Indoor", color: "bg-blue-50 text-blue-700 border-blue-100" },
    CLIMATE_CONTROLLED: { label: "Climate Controlled", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    COVERED: { label: "Covered", color: "bg-orange-50 text-orange-700 border-orange-100" },
    OUTDOOR: { label: "Outdoor", color: "bg-gray-50 text-gray-600 border-gray-200" },
  };
  const meta = labels[type] || { label: type, color: "bg-gray-50 text-gray-600 border-gray-200" };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${meta.color}`}>
      {meta.label}
    </span>
  );
}

export default function FacilityCard({
  slug,
  name,
  address,
  city,
  state,
  rating,
  reviewCount,
  phone,
  website,
  storageTypes = [],
  claimed,
  featured,
  priceMonthly,
  photoUrl,
  distance,
  compact = false,
}: FacilityCardProps) {
  return (
    <Link
      href={`/facility/${slug}`}
      className="facility-card block bg-white rounded-xl border border-gray-200 overflow-hidden group"
    >
      {/* Photo */}
      <div className={`relative bg-gray-100 overflow-hidden ${compact ? "h-40" : "h-48"}`}>
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 left-3 bg-[#E85D2F] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Featured
          </div>
        )}

        {/* Distance badge */}
        {distance != null && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
            {distance < 1 ? `${(distance * 5280).toFixed(0)} ft` : `${distance.toFixed(1)} mi`}
          </div>
        )}

        {/* Price overlay */}
        {priceMonthly && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            From ${Math.round(priceMonthly)}/mo
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Storage types */}
        {storageTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {storageTypes.slice(0, 2).map((t) => (
              <StorageTypeBadge key={t} type={t} />
            ))}
          </div>
        )}

        {/* Name */}
        <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-[#1B4FD8] transition-colors line-clamp-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          {name}
        </h3>

        {/* Location */}
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="truncate">{city}, {state}</span>
        </p>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-2 mt-2.5">
            <StarRating rating={rating} />
            <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
            {reviewCount && (
              <span className="text-xs text-gray-400">({reviewCount.toLocaleString()})</span>
            )}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          {phone ? (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {phone}
            </span>
          ) : (
            <span className="text-xs text-[#1B4FD8] font-medium">
              {claimed ? "Verified ✓" : "Free Listing"}
            </span>
          )}
          <span className="text-xs font-semibold text-[#1B4FD8] group-hover:text-[#1540B0] flex items-center gap-1">
            View details
            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
