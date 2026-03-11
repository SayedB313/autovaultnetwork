/**
 * Migration: carstorage_raw.facilities_raw → autovaultnetwork_db
 * 
 * Run ON OP3:
 *   node prisma/migrate-from-raw.mjs
 * 
 * Requires:
 *   DATABASE_URL=postgresql://coolify_apps:coolify_apps_op3_2026@127.0.0.1:5432/autovaultnetwork_db
 *   SOURCE_DB_URL=postgresql://postgres@127.0.0.1:5432/carstorage_raw
 */

import { PrismaClient } from "@prisma/client";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pg = require("pg");

const TARGET_DB = process.env.DATABASE_URL || 
  "postgresql://coolify_apps:coolify_apps_op3_2026@127.0.0.1:5432/autovaultnetwork_db";

const SOURCE_DB = process.env.SOURCE_DB_URL || 
  "postgresql://postgres@127.0.0.1:5432/carstorage_raw";

const STATE_CODES = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
  "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH",
  "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
  "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA",
  "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN",
  "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA",
  "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
  // State codes passed directly
  "AL":"AL","AK":"AK","AZ":"AZ","AR":"AR","CA":"CA","CO":"CO","CT":"CT","DE":"DE",
  "FL":"FL","GA":"GA","HI":"HI","ID":"ID","IL":"IL","IN":"IN","IA":"IA","KS":"KS",
  "KY":"KY","LA":"LA","ME":"ME","MD":"MD","MA":"MA","MI":"MI","MN":"MN","MS":"MS",
  "MO":"MO","MT":"MT","NE":"NE","NV":"NV","NH":"NH","NJ":"NJ","NM":"NM","NY":"NY",
  "NC":"NC","ND":"ND","OH":"OH","OK":"OK","OR":"OR","PA":"PA","RI":"RI","SC":"SC",
  "SD":"SD","TN":"TN","TX":"TX","UT":"UT","VT":"VT","VA":"VA","WA":"WA","WV":"WV",
  "WI":"WI","WY":"WY","DC":"DC",
  // Canada
  "Ontario": "ON", "British Columbia": "BC", "Alberta": "AB", "Quebec": "QC",
  "Manitoba": "MB", "Saskatchewan": "SK", "Nova Scotia": "NS", "New Brunswick": "NB",
  "ON":"ON","BC":"BC","AB":"AB","QC":"QC","MB":"MB","SK":"SK","NS":"NS","NB":"NB",
};

function toStateCode(state) {
  return STATE_CODES[state] || state?.substring(0, 2).toUpperCase() || "??";
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

function generateSlug(name, city, state) {
  return `${slugify(name)}-${slugify(city)}-${toStateCode(state).toLowerCase()}`;
}

function classifyStorageTypes(types) {
  if (!types || types.length === 0) return ["INDOOR"];
  const combined = types.join(" ").toLowerCase();
  const result = [];
  if (combined.includes("climate") || combined.includes("temperature") || combined.includes("heated")) {
    result.push("CLIMATE_CONTROLLED");
  }
  if (combined.includes("indoor") || combined.includes("garage") || combined.includes("warehouse") || combined.includes("storage")) {
    result.push("INDOOR");
  }
  if (combined.includes("covered") || combined.includes("carport")) {
    result.push("COVERED");
  }
  if (combined.includes("outdoor") || combined.includes("lot") || combined.includes("open")) {
    result.push("OUTDOOR");
  }
  return result.length > 0 ? result : ["INDOOR"];
}

async function main() {
  console.log("🚀 AutoVaultNetwork data migration starting...");
  
  // Connect to source DB
  const sourceClient = new pg.Client({ connectionString: SOURCE_DB });
  await sourceClient.connect();
  console.log("✅ Connected to source DB (carstorage_raw)");

  // Connect to target DB
  const prisma = new PrismaClient({ datasources: { db: { url: TARGET_DB } } });
  console.log("✅ Connected to target DB (autovaultnetwork_db)");

  // Fetch all raw facilities
  const result = await sourceClient.query(`
    SELECT * FROM facilities_raw 
    WHERE business_status = 'OPERATIONAL' OR business_status IS NULL
    ORDER BY rating DESC NULLS LAST, review_count DESC NULLS LAST
  `);
  console.log(`📦 Fetched ${result.rows.length} facilities from raw DB`);

  // Dedup by google_place_id (already unique in source) + name+city+state
  const seen = new Set();
  const dedupedSlugMap = new Map();
  let inserted = 0;
  let skipped = 0;

  for (const row of result.rows) {
    const key = `${row.name?.toLowerCase()}-${row.city?.toLowerCase()}-${row.state?.toLowerCase()}`;
    if (seen.has(key)) { skipped++; continue; }
    seen.add(key);

    let slug = generateSlug(row.name, row.city, row.state);
    // Ensure unique slug
    if (dedupedSlugMap.has(slug)) {
      const count = dedupedSlugMap.get(slug) + 1;
      dedupedSlugMap.set(slug, count);
      slug = `${slug}-${count}`;
    } else {
      dedupedSlugMap.set(slug, 1);
    }

    const storageTypes = classifyStorageTypes(row.types);
    const stateCode = toStateCode(row.state);

    try {
      await prisma.facility.upsert({
        where: { slug },
        create: {
          slug,
          googlePlaceId: row.google_place_id,
          name: row.name,
          address: row.address || "",
          city: row.city || "",
          state: row.state || "",
          zip: row.zip,
          country: row.country || "US",
          lat: row.lat,
          lng: row.lng,
          phone: row.phone,
          website: row.website,
          rating: row.rating,
          reviewCount: row.review_count,
          businessStatus: row.business_status,
          types: row.types || [],
          storageTypes,
          tier: "FREE",
          featured: false,
          verified: false,
          claimed: false,
        },
        update: {},
      });
      inserted++;
    } catch (err) {
      console.error(`❌ Error inserting ${row.name}: ${err.message}`);
    }

    if (inserted % 500 === 0) {
      console.log(`  → ${inserted} inserted, ${skipped} skipped...`);
    }
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Skipped (dedup): ${skipped}`);

  // Generate city pages
  console.log("\n📍 Generating city pages...");
  const cityCounts = await prisma.$queryRaw`
    SELECT city, state, COUNT(*) as count, AVG(lat) as lat, AVG(lng) as lng
    FROM facilities
    GROUP BY city, state
    HAVING COUNT(*) >= 1
    ORDER BY COUNT(*) DESC
  `;

  let cityPagesCreated = 0;
  for (const row of cityCounts) {
    const stateCode = toStateCode(row.state);
    const citySlug = `${slugify(row.city)}-${stateCode.toLowerCase()}`;
    const count = parseInt(row.count);
    try {
      await prisma.cityPage.upsert({
        where: { slug: citySlug },
        create: {
          city: row.city,
          state: row.state,
          stateCode,
          slug: citySlug,
          facilityCount: count,
          lat: row.lat,
          lng: row.lng,
          metaTitle: `Car Storage in ${row.city}, ${stateCode} — Find Indoor & Climate Controlled Storage`,
          metaDesc: `Find ${count} car storage facilit${count === 1 ? "y" : "ies"} in ${row.city}, ${stateCode}. Compare indoor, climate-controlled, and covered storage options. Contact facilities directly.`,
        },
        update: { facilityCount: count },
      });
      cityPagesCreated++;
    } catch (err) {
      console.error(`❌ City page error ${row.city}: ${err.message}`);
    }
  }
  console.log(`✅ ${cityPagesCreated} city pages created`);

  // Generate state pages
  console.log("\n🗺️ Generating state pages...");
  const stateCounts = await prisma.$queryRaw`
    SELECT state, COUNT(*) as facility_count, COUNT(DISTINCT city) as city_count
    FROM facilities
    GROUP BY state
    ORDER BY COUNT(*) DESC
  `;

  let statePagesCreated = 0;
  for (const row of stateCounts) {
    const stateCode = toStateCode(row.state);
    const stateSlug = slugify(stateCode);
    const fc = parseInt(row.facility_count);
    const cc = parseInt(row.city_count);
    try {
      await prisma.statePage.upsert({
        where: { stateCode },
        create: {
          state: row.state,
          stateCode,
          slug: stateSlug,
          facilityCount: fc,
          cityCount: cc,
          metaTitle: `Car Storage in ${row.state} — ${fc} Facilities Across ${cc} Cities`,
          metaDesc: `Browse ${fc} car storage facilities across ${cc} cities in ${row.state}. Find indoor, climate-controlled, and covered car storage options near you.`,
        },
        update: { facilityCount: fc, cityCount: cc },
      });
      statePagesCreated++;
    } catch (err) {
      console.error(`❌ State page error ${row.state}: ${err.message}`);
    }
  }
  console.log(`✅ ${statePagesCreated} state pages created`);

  await sourceClient.end();
  await prisma.$disconnect();
  console.log("\n🎉 All done! AutoVaultNetwork DB is ready.");
}

main().catch(console.error);
