import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows, run } from "@/server/db";

export async function GET() {
  await requireAdmin();
  return NextResponse.json({ items: await rows("SELECT * FROM page_content ORDER BY \`key\`") });
}

export async function PUT(req: Request) {
  await requireAdmin();
  const body = await req.json().catch(() => null);
  const updates = Array.isArray(body?.items) ? body.items : body ? [body] : [];
  for (const it of updates) {
    const key = String(it?.key || "").trim();
    if (!key) continue;
    await run("INSERT INTO page_content (\`key\`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)", key, String(it?.value ?? ""));
  }
  return NextResponse.json({ ok: true });
}