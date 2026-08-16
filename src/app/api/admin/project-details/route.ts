import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows, run, now } from "@/server/db";

export async function GET(req: Request) {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (slug) {
    const p = (
      await rows(
        `SELECT pd.slug, pd.data, pd.updated_at, pr.title, pr.developer, pr.display_address, pr.completion_year
         FROM project_details pd
         LEFT JOIN projects pr ON pr.slug = pd.slug
         WHERE pd.slug = ?`,
        slug
      )
    )[0];
    if (!p) return NextResponse.json({ error: "Project detail not found" }, { status: 404 });
    let data: unknown = null;
    try {
      data = JSON.parse(String(p.data));
    } catch {
      data = null;
    }
    return NextResponse.json({
      item: { slug: p.slug, title: p.title, developer: p.developer, updated_at: p.updated_at, data },
    });
  }
  const items = await rows(
    `SELECT pd.slug, pr.title, pr.developer, pr.display_address, pr.completion_year, pd.updated_at
     FROM project_details pd
     LEFT JOIN projects pr ON pr.slug = pd.slug
     ORDER BY pr.title IS NULL, pr.title ASC`
  );
  return NextResponse.json({ items });
}

export async function PUT(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  const slug = String(body?.slug || "").trim();
  const data = body?.data;
  if (!slug || data == null) {
    return NextResponse.json({ error: "slug and data are required" }, { status: 400 });
  }
  await run(
    `INSERT INTO project_details (slug, data, updated_at)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = VALUES(updated_at)`,
    slug,
    JSON.stringify(data),
    now()
  );
  return NextResponse.json({ ok: true });
}