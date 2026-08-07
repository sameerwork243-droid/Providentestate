import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows, row, run, now, getDb } from "@/server/db";
import { ensureSeeded } from "@/server/seed";

const TEXT_FIELDS = [
  "title",
  "category",
  "property_type",
  "transaction_type",
  "status",
  "price_qualifier",
  "community",
  "developer",
  "location",
  "display_address",
  "furnished",
  "completion_status",
  "introtext",
  "long_description",
] as const;

const INT_FIELDS = [
  "price",
  "bedroom",
  "bathroom",
  "area_sqft",
  "plot_size",
  "parking",
  "year_built",
  "featured",
  "published",
] as const;

export async function GET(req: Request) {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const where = q ? " WHERE (title LIKE ? OR slug LIKE ? OR developer LIKE ?)" : "";
  const params: unknown[] = q ? [`%${q}%`, `%${q}%`, `%${q}%`] : [];
  const total = Number((row(`SELECT COUNT(*) AS n FROM properties${where}`, ...params) as { n: number }).n);
  const items = rows(
    `SELECT p.*,
      (SELECT COUNT(*) FROM property_media m WHERE m.property_id = p.id AND m.kind = 'image') AS image_count,
      (SELECT COUNT(*) FROM property_amenities a WHERE a.property_id = p.id) AS amenity_count
     FROM properties p${where} ORDER BY p.created_at DESC LIMIT 100`,
    ...params
  );
  return NextResponse.json({ items, total });
}

export async function POST(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const title = String(body.title || "").trim();
  if (title.length < 3) {
    return NextResponse.json({ error: "Property title is required" }, { status: 400 });
  }
  const slug = uniqueSlug(String(body.slug || "").trim() || slugify(title));

  const db = getDb();
  const res = db
    .prepare(
      `INSERT INTO properties (slug, title, category, property_type, transaction_type, status, price, price_qualifier,
        community, developer, location, latitude, longitude, display_address, bedroom, bathroom, area_sqft, plot_size,
        parking, furnished, completion_status, year_built, introtext, long_description, featured, published,
        created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      slug,
      title,
      String(body.category || ""),
      String(body.property_type || "apartment"),
      String(body.transaction_type || "buy"),
      String(body.status || "ready"),
      Number(body.price || 0),
      String(body.price_qualifier || "AED"),
      String(body.community || ""),
      String(body.developer || ""),
      String(body.location || ""),
      body.latitude != null && body.latitude !== "" ? Number(body.latitude) : null,
      body.longitude != null && body.longitude !== "" ? Number(body.longitude) : null,
      String(body.display_address || ""),
      Number(body.bedroom || 0),
      Number(body.bathroom || 0),
      Number(body.area_sqft || 0),
      Number(body.plot_size || 0),
      Number(body.parking || 0),
      String(body.furnished || ""),
      String(body.completion_status || "Ready"),
      body.year_built ? Number(body.year_built) : null,
      String(body.introtext || ""),
      String(body.long_description || ""),
      Number(body.featured || 0),
      Number(body.published || 1),
      null,
      now(),
      now()
    );
  const id = Number(res.lastInsertRowid);
  saveAmenities(id, body.amenities);
  saveMedia(id, body.media);
  return NextResponse.json({ id, slug }, { status: 201 });
}

export async function PUT(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id") || 0);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const sets: string[] = [];
  const params: unknown[] = [];
  for (const f of TEXT_FIELDS) {
    if (f in body) {
      sets.push(`${f} = ?`);
      params.push(String(body[f] ?? ""));
    }
  }
  for (const f of INT_FIELDS) {
    if (f in body) {
      sets.push(`${f} = ?`);
      params.push(Number(body[f] ?? 0));
    }
  }
  if ("latitude" in body) {
    sets.push("latitude = ?");
    params.push(body.latitude != null && body.latitude !== "" ? Number(body.latitude) : null);
  }
  if ("longitude" in body) {
    sets.push("longitude = ?");
    params.push(body.longitude != null && body.longitude !== "" ? Number(body.longitude) : null);
  }
  if (sets.length) {
    sets.push("updated_at = ?");
    params.push(now());
    params.push(id);
    getDb().prepare(`UPDATE properties SET ${sets.join(", ")} WHERE id = ?`).run(...params);
  }
  if (Array.isArray(body.amenities)) saveAmenities(id, body.amenities);
  if (Array.isArray(body.media)) saveMedia(id, body.media);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const id = Number(url.searchParams.get("id") || 0);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  run("DELETE FROM properties WHERE id = ?", id);
  return NextResponse.json({ ok: true });
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "property";
}

function uniqueSlug(slug: string): string {
  const db = getDb();
  let candidate = slug;
  let i = 2;
  while (db.prepare("SELECT 1 FROM properties WHERE slug = ?").get(candidate)) {
    candidate = `${slug}-${i++}`;
  }
  return candidate;
}

function saveAmenities(propertyId: number, amenities: unknown): void {
  const db = getDb();
  db.prepare("DELETE FROM property_amenities WHERE property_id = ?").run(propertyId);
  if (!Array.isArray(amenities)) return;
  for (const name of amenities) {
    const a = row("SELECT id FROM amenities WHERE name = ?", String(name).trim());
    if (a) db.prepare("INSERT OR IGNORE INTO property_amenities (property_id, amenity_id) VALUES (?, ?)").run(propertyId, Number(a.id));
  }
}

function saveMedia(propertyId: number, media: unknown): void {
  const db = getDb();
  db.prepare("DELETE FROM property_media WHERE property_id = ?").run(propertyId);
  if (!Array.isArray(media)) return;
  media.forEach((m, i) => {
    const item = (m || {}) as { kind?: string; url?: string; is_featured?: boolean };
    const url = String(item.url || "").trim();
    if (!url) return;
    const kind = ["image", "video", "floorplan", "brochure"].includes(String(item.kind)) ? String(item.kind) : "image";
    db.prepare(
      "INSERT INTO property_media (property_id, kind, url, is_featured, sort_order) VALUES (?, ?, ?, ?, ?)"
    ).run(propertyId, kind, url, Number(item.is_featured ? 1 : 0), i);
  });
}

ensureSeeded();
