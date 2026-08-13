import { rows, dbEnabled } from "@/server/db";
import { ensureSeeded } from "@/server/seed";

/** Key/value overrides stored for the About page (page_content table). */
export async function dbPageContent(): Promise<Record<string, string>> {
  if (!dbEnabled()) return {};
  await ensureSeeded();
  const items = await rows<{ key: string; value: string }>("SELECT key, value FROM page_content");
  const out: Record<string, string> = {};
  for (const it of items) out[it.key] = it.value;
  return out;
}

function jsonArr(v: string | null | undefined): string[] {
  if (!v) return [];
  try {
    const p = JSON.parse(v);
    return Array.isArray(p) ? p.map(String) : [];
  } catch {
    return String(v)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

/** Map a stored agent role onto the team page category tabs. */
function roleCategories(role: string | null | undefined): string[] {
  const r = (role || "").toLowerCase();
  const cats: string[] = [];
  if (/associate|consultant|negotiator/.test(r)) cats.push("Associate");
  if (/sales manager|manager/.test(r)) cats.push("Manager - Sales");
  if (/primary broker|broker/.test(r)) cats.push("Primary Brokers");
  if (/secondary broker/.test(r)) cats.push("Secondary Brokers");
  if (/management|ceo|director|founder|head of|general manager|president/.test(r)) cats.push("Management");
  return cats;
}

function toTeamMember(a: Record<string, unknown>) {
  return {
    slug: String(a.slug || ""),
    name: String(a.name || ""),
    designation: String(a.role || ""),
    image: String(a.img || ""),
    phone: String(a.phone || ""),
    email: String(a.email || ""),
    license: String(a.brn_number || ""),
    bio: String(a.bio || ""),
    category: roleCategories(String(a.role || "")),
    languages: jsonArr(String(a.languages || "")),
  };
}

/** Published agents from the database, shaped like static team members. */
export async function dbTeamMembers(): Promise<any[]> {
  if (!dbEnabled()) return [];
  await ensureSeeded();
  const items = await rows<Record<string, unknown>>("SELECT * FROM agents WHERE published = 1 ORDER BY name ASC");
  return items.map(toTeamMember);
}

/** A published agent by slug. */
export async function dbTeamBySlug(slug: string): Promise<Record<string, unknown> | undefined> {
  if (!dbEnabled()) return undefined;
  await ensureSeeded();
  const a = (await rows<Record<string, unknown>>("SELECT * FROM agents WHERE slug = ? AND published = 1 LIMIT 1", slug))[0];
  if (!a) return undefined;
  const t = toTeamMember(a);
  return {
    slug: t.slug,
    name: t.name,
    designation: t.designation,
    phone: t.phone,
    email: t.email,
    license: t.license,
    languages: t.languages,
    category: t.category,
    image: t.image ? { url: t.image } : null,
    extra: { profile_image: t.image },
    about: t.bio ? { data: { about: t.bio } } : null,
  };
}

function toJob(j: Record<string, unknown>) {
  return {
    id: j.id,
    slug: String(j.slug || ""),
    title: String(j.title || ""),
    location: String(j.location || ""),
    summary: String(j.summary || ""),
    job_details: String(j.job_details || ""),
  };
}

/** Published jobs from the database. */
export async function dbJobs(): Promise<any[]> {
  if (!dbEnabled()) return [];
  await ensureSeeded();
  const items = await rows<Record<string, unknown>>("SELECT * FROM jobs WHERE published = 1 ORDER BY id DESC");
  return items.map(toJob);
}

/** A published job by slug. */
export async function dbJobBySlug(slug: string): Promise<Record<string, unknown> | undefined> {
  if (!dbEnabled()) return undefined;
  await ensureSeeded();
  const j = (await rows<Record<string, unknown>>("SELECT * FROM jobs WHERE slug = ? AND published = 1 LIMIT 1", slug))[0];
  if (!j) return undefined;
  return toJob(j);
}

/** Shape a stored project like the scraped new-projects hits the public pages consume. */
function toProjectHit(p: Record<string, unknown>) {
  const images = jsonArr(String(p.images || "")).map((u) => ({ "340x252": u, "464x312": u, "696x520": u }));
  const banner = String(p.banner_image || "");
  return {
    id: Number(p.id),
    slug: String(p.slug || ""),
    title: String(p.title || ""),
    status: String(p.status || "ready"),
    price: Number(p.price || 0),
    currency: String(p.currency || "AED"),
    community: String(p.community || ""),
    developer: String(p.developer || ""),
    building_type: jsonArr(String(p.building_type || "")),
    department: String(p.department || ""),
    min_bedrooms: Number(p.bedrooms_min || 0),
    max_bedrooms: Number(p.bedrooms_max || 0),
    display_address: String(p.display_address || ""),
    about: String(p.about || ""),
    images,
    amenities: jsonArr(String(p.amenities || "")),
    banner_image: banner ? [{ "376x": banner, "744x": banner, "1650x": banner }] : [],
    completion_year: p.completion_year != null ? Number(p.completion_year) : null,
    publish: Number(p.published) === 1,
  };
}

/** Published projects from the database, shaped like raw new-projects hits. */
export async function dbProjects(): Promise<any[]> {
  if (!dbEnabled()) return [];
  await ensureSeeded();
  const items = await rows<Record<string, unknown>>("SELECT * FROM projects WHERE published = 1 ORDER BY id DESC");
  return items.map(toProjectHit);
}

/** A published project by slug. */
export async function dbProjectBySlug(slug: string): Promise<any | undefined> {
  if (!dbEnabled()) return undefined;
  await ensureSeeded();
  const p = (await rows<Record<string, unknown>>("SELECT * FROM projects WHERE slug = ? AND published = 1 LIMIT 1", slug))[0];
  if (!p) return undefined;
  return toProjectHit(p);
}

/** All developer rows (regardless of publish state) so callers can detect a fully empty table. */
export async function dbDevelopersTable(): Promise<{ rows: Record<string, unknown>[]; live: Record<string, unknown>[] }> {
  if (!dbEnabled()) return { rows: [], live: [] };
  await ensureSeeded();
  const all = await rows("SELECT * FROM developers ORDER BY name ASC");
  return { rows: all, live: all.filter((d) => Number(d.published) === 1) };
}

/** All community/area rows (regardless of publish state) so callers can detect a fully empty table. */
export async function dbCommunitiesTable(): Promise<{ rows: Record<string, unknown>[]; live: Record<string, unknown>[] }> {
  if (!dbEnabled()) return { rows: [], live: [] };
  await ensureSeeded();
  const all = await rows("SELECT * FROM communities ORDER BY name ASC");
  return { rows: all, live: all.filter((c) => Number(c.published) === 1) };
}

/** Real counts from the database for site-wide stats (hero, team page, etc.). */
export async function dbSiteStats(): Promise<{ properties: number; agents: number; projects: number; communities: number; jobs: number }> {
  const out = { properties: 0, agents: 0, projects: 0, communities: 0, jobs: 0 };
  if (!dbEnabled()) return out;
  await ensureSeeded();
  const n = async (sql: string): Promise<number> => Number((await rows(sql))[0]?.n ?? 0);
  out.properties = await n("SELECT COUNT(*) AS n FROM properties WHERE published = 1");
  out.agents = await n("SELECT COUNT(*) AS n FROM agents WHERE published = 1");
  out.projects = await n("SELECT COUNT(*) AS n FROM projects WHERE published = 1");
  out.communities = await n("SELECT COUNT(*) AS n FROM communities WHERE published = 1");
  out.jobs = await n("SELECT COUNT(*) AS n FROM jobs WHERE published = 1");
  return out;
}