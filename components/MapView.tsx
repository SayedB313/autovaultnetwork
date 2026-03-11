"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Facility {
  id: string;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number | null;
  storageTypes?: string[];
}

interface MapViewProps {
  facilities: Facility[];
  activeId: string | null;
  onFacilityClick: (id: string) => void;
}

export default function MapView({ facilities, activeId, onFacilityClick }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-98.5795, 39.8283], // US center
      zoom: 3.5,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    return () => {
      map.current?.remove();
    };
  }, []);

  // Add/update markers when facilities change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((m) => m.remove());
    markers.current.clear();

    facilities.forEach((f) => {
      const el = document.createElement("div");
      el.className = "map-marker";
      el.style.cssText = `
        width: 28px;
        height: 28px;
        background: #1B4FD8;
        border: 2px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: transform 0.15s ease, background 0.15s ease;
      `;

      el.addEventListener("click", () => {
        onFacilityClick(f.id);
        window.open(`/facility/${f.slug}`, "_self");
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        className: "av-popup",
      }).setHTML(`
        <div style="font-family: Figtree, sans-serif; padding: 6px 2px;">
          <p style="font-weight: 700; font-size: 13px; color: #111827; margin: 0 0 2px;">${f.name}</p>
          ${f.rating ? `<p style="font-size: 11px; color: #6B7280; margin: 0;">★ ${f.rating.toFixed(1)}</p>` : ""}
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([f.lng, f.lat])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener("mouseenter", () => popup.addTo(map.current!));
      el.addEventListener("mouseleave", () => popup.remove());

      markers.current.set(f.id, marker);
    });

    // Fit bounds to facilities
    if (facilities.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      facilities.forEach((f) => bounds.extend([f.lng, f.lat]));
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 500 });
    }
  }, [facilities, onFacilityClick]);

  // Highlight active marker
  useEffect(() => {
    markers.current.forEach((marker, id) => {
      const el = marker.getElement();
      if (id === activeId) {
        el.style.background = "#E85D2F";
        el.style.transform = "rotate(-45deg) scale(1.3)";
        el.style.zIndex = "10";
      } else {
        el.style.background = "#1B4FD8";
        el.style.transform = "rotate(-45deg) scale(1)";
        el.style.zIndex = "1";
      }
    });
  }, [activeId]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
