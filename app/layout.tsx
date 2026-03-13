import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

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
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://carstoragefinder.co",
  },
};

// Organization + FAQ structured data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CarStorageFinder",
  url: "https://carstoragefinder.co",
  description:
    "The largest directory of car storage facilities in the US. Search 8,900+ indoor, climate-controlled, and covered car storage options.",
  foundingDate: "2026",
  sameAs: [],
  knowsAbout: [
    "car storage",
    "vehicle storage",
    "indoor car storage",
    "climate controlled car storage",
    "luxury car storage",
    "covered car storage",
  ],
  parentOrganization: {
    "@type": "Organization",
    name: "AutoVault",
    url: "https://autovault.network",
    description:
      "Curated directory of 405 luxury and exotic car storage facilities.",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CarStorageFinder",
  url: "https://carstoragefinder.co",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://carstoragefinder.co/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does car storage cost per month?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mass-market car storage costs $29-$79/month for outdoor lots and $100-$250/month for indoor/climate-controlled. Luxury storage at premium facilities (like those on AutoVault.network) ranges from $149-$500+/month with concierge services.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between indoor and climate-controlled car storage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Indoor storage protects your car from weather in an enclosed building. Climate-controlled storage adds temperature and humidity regulation, ideal for classic, luxury, or exotic cars that need stable conditions year-round.",
      },
    },
    {
      "@type": "Question",
      name: "How many car storage facilities are listed on CarStorageFinder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CarStorageFinder lists over 8,900 car storage facilities across 49 US states and Canada. Our sister site AutoVault.network features 405 premium luxury car storage facilities.",
      },
    },
  ],
};

const schemaScripts = [organizationSchema, websiteSchema, faqSchema]
  .map((s) => JSON.stringify(s))
  .join("");

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
        {/* Structured Data - Organization */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
        >{JSON.stringify(organizationSchema)}</Script>
        {/* Structured Data - WebSite */}
        <Script
          id="schema-website"
          type="application/ld+json"
          strategy="afterInteractive"
        >{JSON.stringify(websiteSchema)}</Script>
        {/* Structured Data - FAQ */}
        <Script
          id="schema-faq"
          type="application/ld+json"
          strategy="afterInteractive"
        >{JSON.stringify(faqSchema)}</Script>
      </head>
      <body>
        {children}
        {/* Google Analytics 4 */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
