import { rows, run, now, row, dbEnabled } from "./db";
import { hashPassword } from "./auth-core";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

function rawPath(...parts: string[]): string {
  return path.join(process.cwd(), "data", "raw", ...parts);
}

function loadJson(file: string): any | null {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function listFiles(dir: string): string[] {
  try {
    return readdirSync(dir).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
}

function stripHtml(s: string): string {
  return String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toInt(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function toFloat(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export const DEFAULT_AMENITIES = [
  "Swimming Pool",
  "Gym",
  "Balcony",
  "Maid Room",
  "Study Room",
  "Children's Play Area",
  "BBQ Area",
  "Covered Parking",
  "Security",
  "Concierge",
  "Waterfront",
  "Pet Friendly",
  "Smart Home",
  "Elevator",
  "Central AC",
];

export async function ensureSeeded(): Promise<void> {
  if (!dbEnabled()) return;

  const roleCount = Number((await rows("SELECT COUNT(*) AS n FROM roles"))[0]?.n ?? 0);
  if (roleCount === 0) {
    await run("INSERT INTO roles (name) VALUES ('admin'), ('user'), ('agent')");
  }

  const amenityCount = Number((await rows("SELECT COUNT(*) AS n FROM amenities"))[0]?.n ?? 0);
  if (amenityCount === 0) {
    for (const a of DEFAULT_AMENITIES) {
      await run("INSERT INTO amenities (name) VALUES (?)", a);
    }
  }

  const userCount = Number((await rows("SELECT COUNT(*) AS n FROM users"))[0]?.n ?? 0);
  if (userCount === 0) {
    const adminEmail = (process.env.PROVIDENT_ADMIN_EMAIL || "sameerwork243@gmail.com").toLowerCase();
    const adminPassword = process.env.PROVIDENT_ADMIN_PASSWORD || "Sameer@12";
    const adminRole = Number((await rows<{ id: number }>("SELECT id FROM roles WHERE name = 'admin'"))[0]?.id ?? 1);
    const userRole = Number((await rows<{ id: number }>("SELECT id FROM roles WHERE name = 'user'"))[0]?.id ?? 2);
    await run(
      "INSERT INTO users (email, password_hash, name, role_id, is_active, created_at) VALUES (?, ?, ?, ?, 1, ?)",
      adminEmail,
      hashPassword(adminPassword),
      "Administrator",
      adminRole,
      now()
    );
    await run(
      "INSERT INTO users (email, password_hash, name, role_id, is_active, created_at) VALUES (?, ?, ?, ?, 1, ?)",
      "demo@provident.ae",
      hashPassword("Demo@1234"),
      "Demo User",
      userRole,
      now()
    );
  }

  const catCount = Number((await rows("SELECT COUNT(*) AS n FROM categories"))[0]?.n ?? 0);
  if (catCount === 0) {
    const cats: [string, string][] = [
      ["Apartment", "apartment"],
      ["Villa", "villa"],
      ["Townhouse", "townhouse"],
      ["Penthouse", "penthouse"],
      ["Mansions", "mansions"],
      ["Duplex", "duplex"],
      ["Studio", "studio"],
      ["Commercial", "commercial"],
    ];
    for (let i = 0; i < cats.length; i++) {
      await run("INSERT INTO categories (name, slug, type, sort) VALUES (?, ?, 'property', ?)", cats[i][0], cats[i][1], i);
    }
  }

  const devCount = Number((await rows("SELECT COUNT(*) AS n FROM developers"))[0]?.n ?? 0);
  if (devCount === 0) {
    try {
      const file = path.join(process.cwd(), "data", "raw", "developers.json");
      const devs = JSON.parse(readFileSync(file, "utf8"));
      for (const d of devs) {
        await run(
          "INSERT INTO developers (name, slug, region, img, description, published, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)",
          d.name,
          d.slug,
          d.region || "",
          d.logo || "",
          d.description || "",
          now()
        );
      }
    } catch {
      // developers.json unavailable - admin can add developers manually
    }
  }

  const contactCount = Number((await rows("SELECT COUNT(*) AS n FROM contact_info"))[0]?.n ?? 0);
  if (contactCount === 0) {
    const pairs: [string, string][] = [
      ["phone", "+971 50 539 0249"],
      ["email", "info@providentestate.com"],
      ["whatsapp", "https://wa.provident.ae/inquire?phone=971505423503"],
      ["address", "Dubai, United Arab Emirates"],
    ];
    for (const [k, v] of pairs) {
      await run("INSERT INTO contact_info (key, value) VALUES (?, ?)", k, v);
    }
  }

  await seedAgents();
  await seedJobs();
  await seedProjects();
  await seedProperties();
}

/** Agents from the scraped team pages (data/raw/pages/team/*.json). */
async function seedAgents(): Promise<void> {
  const count = Number((await rows("SELECT COUNT(*) AS n FROM agents"))[0]?.n ?? 0);
  if (count > 0) return;
  const dir = rawPath("pages", "team");
  for (const f of listFiles(dir)) {
    const j = loadJson(path.join(dir, f));
    const t = j?.result?.data?.strapiTeam;
    if (!t || !t.slug) continue;
    try {
      await run(
        `INSERT INTO agents (name, slug, role, phone, email, languages, specialties, img, bio, brn_number, published, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
         ON CONFLICT (slug) DO NOTHING`,
        String(t.name || ""),
        String(t.slug),
        String(t.designation || ""),
        String(t.phone || t.office_phone || ""),
        String(t.email || ""),
        JSON.stringify(t.languages?.strapi_json_value || []),
        JSON.stringify(t.category?.strapi_json_value || []),
        String(t.extra?.profile_image || t.image?.url || ""),
        String(t.about?.data?.about || "").slice(0, 4000),
        String(t.license || ""),
        now()
      );
    } catch (e) {
      console.error("[seed] agent skipped:", f, (e as Error).message);
    }
  }
  console.log("[seed] agents ready");
}

/** Jobs from the scraped careers pages (data/raw/pages/careers/*.json). */
async function seedJobs(): Promise<void> {
  const count = Number((await rows("SELECT COUNT(*) AS n FROM jobs"))[0]?.n ?? 0);
  if (count > 0) return;
  const dir = rawPath("pages", "careers");
  for (const f of listFiles(dir)) {
    const j = loadJson(path.join(dir, f));
    const c = j?.result?.data?.strapiCareer;
    if (!c || !c.slug) continue;
    const details = String(c.job_details?.data?.job_details || "");
    try {
      await run(
        `INSERT INTO jobs (title, slug, location, summary, job_details, published, created_at)
         VALUES (?, ?, ?, ?, ?, 1, ?)
         ON CONFLICT (slug) DO NOTHING`,
        String(c.title || "").trim(),
        String(c.slug),
        String(c.location || ""),
        stripHtml(details).slice(0, 240),
        details,
        now()
      );
    } catch (e) {
      console.error("[seed] job skipped:", f, (e as Error).message);
    }
  }
  console.log("[seed] jobs ready");
}

/** Projects from the scraped new-projects corpus (data/raw/projects/new-projects/*.json). */
async function seedProjects(): Promise<void> {
  const count = Number((await rows("SELECT COUNT(*) AS n FROM projects"))[0]?.n ?? 0);
  if (count > 0) return;
  const dir = rawPath("projects", "new-projects");
  for (const f of listFiles(dir)) {
    const j = loadJson(path.join(dir, f));
    const h = j?.result?.serverData?.data?.hits?.[0];
    if (!h || !h.slug) continue;
    const images = (Array.isArray(h.images) ? h.images : [])
      .map((im: any) => im?.["696x520"] || im?.["464x312"] || im?.["340x252"] || "")
      .filter(Boolean);
    const banner = (Array.isArray(h.banner_image) ? h.banner_image : [])[0];
    const bannerUrl = String(banner?.["1650x"] || banner?.["744x"] || banner?.["376x"] || "");
    try {
      await run(
        `INSERT INTO projects
           (slug, title, category, status, price, currency, community, developer, building_type, department,
            bedrooms_min, bedrooms_max, display_address, about, images, amenities, banner_image, completion_year, published, created_at)
         VALUES (?, ?, 'new-project', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
         ON CONFLICT (slug) DO NOTHING`,
        String(h.slug),
        String(h.title || ""),
        String(h.status || "ready"),
        toInt(h.price),
        String(h.currency || "AED"),
        String(h.community || ""),
        String(h.developer || ""),
        JSON.stringify(Array.isArray(h.building_type) ? h.building_type : [h.building_type].filter(Boolean)),
        String(h.department || ""),
        toInt(h.min_bedrooms),
        toInt(h.max_bedrooms),
        String(h.display_address || ""),
        String(h.about || ""),
        JSON.stringify(images),
        JSON.stringify(Array.isArray(h.amenities) ? h.amenities : []),
        bannerUrl,
        h.completion_year != null ? toInt(h.completion_year) : null,
        now()
      );
    } catch (e) {
      console.error("[seed] project skipped:", f, (e as Error).message);
    }
  }
  console.log("[seed] projects ready");
}

/** Properties + media + amenities from the scraped property detail pages (data/raw/properties/{buy,let}/*.json). */
async function seedProperties(): Promise<void> {
  const marker = await row<{ value: string }>("SELECT value FROM page_content WHERE key = 'properties_imported'");
  if (marker) return;
  const agentRows = await rows<{ id: number; name: string }>("SELECT id, name FROM agents");
  const agentIdByName = new Map<string, number>();
  for (const a of agentRows) agentIdByName.set(String(a.name).trim().toLowerCase(), Number(a.id));

  const kinds: [string, "buy" | "rent"][] = [
    ["buy", "buy"],
    ["let", "rent"],
  ];
  for (const [dirName, txn] of kinds) {
    const dir = rawPath("properties", dirName);
    for (const f of listFiles(dir)) {
      const j = loadJson(path.join(dir, f));
      const p = j?.result?.serverData?.data?.data;
      if (!p || !p.slug) continue;
      const building = (Array.isArray(p.building) ? p.building : []).map((b: any) => String(b)).filter(Boolean);
      const type = (building[0] || p.department || "apartment").toLowerCase();
      const agentName = String(p.link_to_employee?.name || "").trim().toLowerCase();
      const agentId = agentIdByName.get(agentName) || null;
      const parking = Array.isArray(p.parking) ? toInt(p.parking[0]) : toInt(p.parking);
      try {
        const res = await run(
          `INSERT INTO properties
             (slug, title, category, property_type, transaction_type, status, price, price_qualifier,
              community, developer, location, latitude, longitude, display_address, bedroom, bathroom,
              area_sqft, parking, furnished, completion_status, introtext, long_description, featured, published, agent_id, created_at)
           VALUES (?, ?, ?, ?, ?, 'ready', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?, ?)
           ON CONFLICT (slug) DO NOTHING`,
          String(p.slug),
          String(p.title || ""),
          building[0] || p.department || "Apartment",
          type,
          txn,
          toInt(p.price),
          String(p.price_qualifier || "AED"),
          String(p.address?.area || p.area || ""),
          String(p.developer || ""),
          String(p.display_address || ""),
          toFloat(p.latitude),
          toFloat(p.longitude),
          String(p.display_address || ""),
          toInt(p.bedroom),
          toInt(p.bathroom),
          toInt(p.floorarea_min || p.floorarea_max),
          parking,
          String(p.extra?.furnishing_type || p.extra?.furnished || ""),
          String(p.extra?.completion_status || ""),
          String(p.introtext || "").slice(0, 4000),
          String(p.long_description || ""),
          agentId,
          now()
        );
        const pid = res.lastId;
        if (!pid) continue;

        const urls = (Array.isArray(p.images) ? p.images : [])
          .map((im: any) => String(im?.url || im?.srcUrl || ""))
          .filter(Boolean);
        const seen = new Set<string>();
        let order = 0;
        for (const url of urls) {
          if (seen.has(url)) continue;
          seen.add(url);
          await run(
            "INSERT INTO property_media (property_id, kind, url, is_featured, sort_order) VALUES (?, 'image', ?, ?, ?)",
            pid,
            url,
            order === 0 ? 1 : 0,
            order
          );
          order++;
        }

        for (const a of Array.isArray(p.accommodation_summary) ? p.accommodation_summary : []) {
          const name = String(a || "").trim();
          if (!name) continue;
          await run("INSERT INTO amenities (name) VALUES (?) ON CONFLICT (name) DO NOTHING", name);
          const am = await row<{ id: number }>("SELECT id FROM amenities WHERE name = ?", name);
          if (am) await run("INSERT INTO property_amenities (property_id, amenity_id) VALUES (?, ?) ON CONFLICT DO NOTHING", pid, Number(am.id));
        }
      } catch (e) {
        console.error("[seed] property skipped:", f, (e as Error).message);
      }
    }
  }
  await run("INSERT INTO page_content (key, value) VALUES ('properties_imported', '1') ON CONFLICT (key) DO UPDATE SET value = '1'");
  console.log("[seed] properties ready");
}

export async function seed(): Promise<void> {
  await ensureSeeded();
  console.log("[seed] database ready");
}
