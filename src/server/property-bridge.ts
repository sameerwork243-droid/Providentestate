import { rows, dbEnabled } from "@/server/db";
import { ensureSeeded } from "@/server/seed";

export interface DbHit {
  id: number;
  slug: string;
  crm_id: string;
  title: string;
  price: number;
  price_qualifier: string;
  bedroom: number;
  bathroom: number;
  floorarea_min: number | null;
  floorarea_max: number | null;
  display_address: string;
  address_full: { area: string } | null;
  department: string;
  building_type: string;
  building: string[];
  description: string;
  long_description: string;
  introtext: string;
  images: { "340x252": string; "464x312": string; "696x520": string }[];
  imageCount: number;
  search_type: "sale" | "rental";
  crm_negotiator_id: { name: string; phone: string; email: string };
  status: string;
  completion_year: number | null;
  furnished: string;
}

const DEPARTMENT: Record<string, string> = {
  apartment: "apartments",
  apartments: "apartments",
  villa: "villas",
  villas: "villas",
  townhouse: "townhouses",
  townhouses: "townhouses",
  penthouse: "penthouses",
  penthouses: "penthouses",
  studio: "studios",
  studios: "studios",
  duplex: "duplexes",
  duplexes: "duplexes",
  mansion: "mansions",
  mansions: "mansions",
  "commercial-property": "commercial-properties",
  office: "commercial-properties",
  retail: "commercial-properties",
  plot: "plots",
  land: "plots",
};

async function dbQuery(kind: "buy" | "let") {
  if (!dbEnabled()) return [];
  await ensureSeeded();
  const txn = kind === "let" ? "rent" : "buy";
  return rows<Record<string, unknown>>(
    `SELECT p.*,
       (SELECT m.url FROM property_media m WHERE m.property_id = p.id AND m.kind = 'image' ORDER BY m.is_featured DESC, m.sort_order, m.id LIMIT 1) AS thumb
     FROM properties p
     WHERE p.published = 1 AND p.transaction_type = ?
     ORDER BY p.created_at DESC`,
    txn
  );
}

function dbHit(p: Record<string, unknown>): DbHit {
  const thumb = String(p.thumb || "");
  const id = Number(p.id);
  const sqft = Number(p.area_sqft || 0);
  const img = (u: string) => ({
    "340x252": u,
    "464x312": u,
    "696x520": u,
  });
  return {
    id,
    slug: String(p.slug || `property-${id}`),
    crm_id: `PE-${id}`,
    title: String(p.title || ""),
    price: Number(p.price || 0),
    price_qualifier: String(p.price_qualifier || "AED"),
    bedroom: Number(p.bedroom || 0),
    bathroom: Number(p.bathroom || 0),
    floorarea_min: sqft || null,
    floorarea_max: sqft || null,
    display_address: String(p.display_address || p.location || ""),
    address_full: String(p.community || "") ? { area: String(p.community) } : null,
    department: DEPARTMENT[String(p.property_type || "").toLowerCase()] || String(p.property_type || "apartments"),
    building_type: String(p.property_type || ""),
    building: [String(p.property_type || "")].filter(Boolean),
    description: String(p.introtext || ""),
    long_description: String(p.long_description || ""),
    introtext: String(p.introtext || ""),
    images: thumb ? [img(thumb)] : [],
    imageCount: thumb ? 1 : 0,
    search_type: String(p.transaction_type) === "rent" ? "rental" : "sale",
    crm_negotiator_id: { name: "Provident Estate", phone: "+971 50 539 0249", email: "info@providentestate.com" },
    status: String(p.status || "ready"),
    completion_year: p.year_built != null ? Number(p.year_built) : null,
    furnished: String(p.furnished || ""),
  };
}

/** Published DB properties shaped like listing hits for a given kind (buy|let). */
export async function dbPropsToHits(kind: "buy" | "let"): Promise<DbHit[]> {
  return (await dbQuery(kind)).map(dbHit);
}

/** Resolve a route like /buy/my-apartment42/ to a DB property detail. */
export async function dbPropertyByRoute(route: string): Promise<{ data: any; kind: "buy" | "let" } | null> {
  if (!dbEnabled()) return null;
  await ensureSeeded();
  const m = route.match(/^\/(buy|let)\/([^/]+?)\/?$/);
  if (!m) return null;
  const kind: "buy" | "let" = m[1] as "buy" | "let";
  const part = m[2];
  const idMatch = part.match(/(\d+)$/);
  const id = idMatch ? Number(idMatch[1]) : null;
  const slug = idMatch ? part.slice(0, part.length - idMatch[1].length) : part;
  const txn = kind === "let" ? "rent" : "buy";

  let p: Record<string, unknown> | undefined;
  if (id) p = (await rows(`SELECT * FROM properties WHERE id = ? AND published = 1 AND transaction_type = ?`, id, txn))[0];
  if (!p && slug) p = (await rows(`SELECT * FROM properties WHERE slug = ? AND published = 1 AND transaction_type = ?`, slug, txn))[0];
  if (!p) return null;

  const media = await rows(`SELECT * FROM property_media WHERE property_id = ? ORDER BY sort_order, id`, Number(p.id));
  const images = media
    .filter((m2) => m2.kind === "image")
    .map((m2) => ({ url: String(m2.url), srcUrl: String(m2.url) }));
  const amenityNames = (
    await rows(
      `SELECT a.name FROM property_amenities pa JOIN amenities a ON a.id = pa.amenity_id WHERE pa.property_id = ? ORDER BY a.name`,
      Number(p.id)
    )
  ).map((a) => String(a.name));

  const hit = dbHit(p);
  return {
    kind,
    data: {
      ...hit,
      images,
      amenities: amenityNames,
      status: String(p.completion_status || "Ready"),
      furnishing: String(p.furnished || "Unfurnished"),
      crm_negotiator_id: { name: "Provident Estate", phone: "+971 50 539 0249", email: "info@providentestate.com" },
    },
  };
}
