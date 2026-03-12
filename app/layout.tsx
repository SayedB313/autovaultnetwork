import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CarStorageFinder — Find Car Storage Near You",
    template: "%s | CarStorageFinder",
  },
  description:
    "Search 8,900+ indoor and climate-controlled car storage facilities across the US. Find the best car storage in your city — filter by type, price, and rating.",
  metadataBase: new URL("https://carstoragefinder.co"),
  openGraph: {
    siteName: "CarStorageFinder",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
