import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { crudByResource } from "@/server/admin-resources";
import { listRows, createRow } from "@/server/crud";

export async function GET(req: Request, ctx: { params: Promise<{ resource: string }> }) {
  await requireAdmin();
  const { resource } = await ctx.params;
  const cfg = crudByResource(resource);
  if (!cfg) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const { searchParams } = new URL(req.url);
  const result = await listRows(cfg, {
    search: searchParams.get("q") || "",
    page: Number(searchParams.get("page") || 1),
  });
  return NextResponse.json(result);
}

export async function POST(req: Request, ctx: { params: Promise<{ resource: string }> }) {
  await requireAdmin();
  const { resource } = await ctx.params;
  const cfg = crudByResource(resource);
  if (!cfg) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const res = await createRow(cfg, body || {});
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json({ id: res.id }, { status: 201 });
}
