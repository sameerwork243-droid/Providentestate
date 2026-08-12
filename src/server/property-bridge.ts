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
  crm_negotiator_id: {
    name: string;
    phone: string;
    email: string;
    url?: string;
    designation?: string;
    brn_number?: string;
  };
  status: string;
  completion_year: number | null;
  furnished: string;
}

const DEFAULT_NEGOTIATOR = { name: "Zoya Ventures Real Estate", phone: "+971 568 308 221", email: "zoyaventure15@gmail.com" };

function negotiatorFromRow(p: Record<string, unknown>) {
  const name = String(p.agent_name || "").trim();
  if (!name) return DEFAULT_NEGOTIATOR;
  return {
    name,
    url: String(p.agent_img || ""),
    designation: String(p.agent_role || "Sales Associate"),
    brn_number: String(p.agent_brn || ""),
    phone: String(p.agent_phone || DEFAULT_NEGOTIATOR.phone),
    email: String(p.agent_email || DEFAULT_NEGOTIATOR.email),
  };
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
       ag.name AS agent_name, ag.img AS agent_img, ag.role AS agent_role,
       ag.brn_number AS agent_brn, ag.phone AS agent_phone, ag.email AS agent_email,
       (SELECT m.url FROM property_media m WHERE m.property_id = p.id AND m.kind = 'image' ORDER BY m.is_featured DESC, m.sort_order, m.id LIMIT 1) AS thumb
     FROM properties p
     LEFT JOIN agents ag ON ag.id = p.agent_id
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
  const placeholder = "/images/property-placeholder.svg";
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
    images: thumb ? [img(thumb)] : [img(placeholder)],
    imageCount: thumb ? 1 : 1,
    search_type: String(p.transaction_type) === "rent" ? "rental" : "sale",
    crm_negotiator_id: negotiatorFromRow(p),
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
  const txn = kind === "let" ? "rent" : "buy";

  // The card link is `{slug}{id}` concatenated, so a slug ending in digits is
  // ambiguous (e.g. slug "dsav-2" + id 27 -> "dsav-227"). Try progressive
  // splits, longest id first, until a row matches.
  let p: Record<string, unknown> | undefined;
  const digits = (part.match(/\d+$/) || [""])[0];
  for (let idLen = digits.length; idLen >= 0; idLen--) {
    const id = idLen > 0 ? Number(digits.slice(digits.length - idLen)) : null;
    const slug = idLen < digits.length ? part.slice(0, part.length - idLen) : part;
    if (id != null && id > 0 && id <= 2147483647) {
      p = (
        await rows(
          `SELECT p.*, ag.name AS agent_name, ag.img AS agent_img, ag.role AS agent_role,
             ag.brn_number AS agent_brn, ag.phone AS agent_phone, ag.email AS agent_email
           FROM properties p
           LEFT JOIN agents ag ON ag.id = p.agent_id
           WHERE p.id = ? AND p.published = 1 AND p.transaction_type = ?`,
          id,
          txn
        )
      )[0];
      if (p) break;
    }
    if (slug) {
      p = (
        await rows(
          `SELECT p.*, ag.name AS agent_name, ag.img AS agent_img, ag.role AS agent_role,
             ag.brn_number AS agent_brn, ag.phone AS agent_phone, ag.email AS agent_email
           FROM properties p
           LEFT JOIN agents ag ON ag.id = p.agent_id
           WHERE p.slug = ? AND p.published = 1 AND p.transaction_type = ?`,
          slug,
          txn
        )
      )[0];
      if (p) break;
    }
  }
  if (!p) return null;

  return { kind, data: await detailFromRow(p) };
}

/** Detail-page shape (images + amenities) for a property row. */
async function detailFromRow(p: Record<string, unknown>): Promise<any> {
  const media = await rows(`SELECT * FROM property_media WHERE property_id = ? ORDER BY sort_order, id`, Number(p.id));
  let images = media
    .filter((m2) => m2.kind === "image")
    .map((m2) => ({ url: String(m2.url), srcUrl: String(m2.url) }));
  if (!images.length) images = [{ url: "/images/property-placeholder.svg", srcUrl: "/images/property-placeholder.svg" }];
  const amenityNames = (
    await rows(
      `SELECT a.name FROM property_amenities pa JOIN amenities a ON a.id = pa.amenity_id WHERE pa.property_id = ? ORDER BY a.name`,
      Number(p.id)
    )
  ).map((a) => String(a.name));

  const hit = dbHit(p);
  return {
    ...hit,
    images,
    amenities: amenityNames,
    status: String(p.completion_status || "Ready"),
    furnishing: String(p.furnished || "Unfurnished"),
  };
}

/** Resolve a published DB property by numeric id. CRM references (e.g. "PS-1305268")
 *  come from the Strapi corpus and are matched by the caller. */
export async function dbPropertyByRef(ref: string): Promise<{ data: any; kind: "buy" | "let" } | null> {
  if (!dbEnabled()) return null;
  await ensureSeeded();
  const r = String(ref || "").trim();
  if (!r || !/^\d+$/.test(r)) return null;
  const p = (
    await rows(
      `SELECT p.*, ag.name AS agent_name, ag.img AS agent_img, ag.role AS agent_role,
         ag.brn_number AS agent_brn, ag.phone AS agent_phone, ag.email AS agent_email
       FROM properties p
       LEFT JOIN agents ag ON ag.id = p.agent_id
       WHERE p.published = 1 AND p.id = ?
       ORDER BY p.id LIMIT 1`,
      Number(r)
    )
  )[0];
  if (!p) return null;
  const kind: "buy" | "let" = String(p.transaction_type) === "rent" ? "let" : "buy";
  return { kind, data: await detailFromRow(p) };
}
