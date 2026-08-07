import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { crudByResource } from "@/server/admin-resources";
import { getRow, updateRow, deleteRow } from "@/server/crud";

export async function GET(_req: Request, ctx: { params: Promise<{ resource: string; id: string }> }) {
  await requireAdmin();
  const { resource, id } = await ctx.params;
  const cfg = crudByResource(resource);
  if (!cfg) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const item = getRow(cfg, Number(id));
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PUT(req: Request, ctx: { params: Promise<{ resource: string; id: string }> }) {
  await requireAdmin();
  const { resource, id } = await ctx.params;
  const cfg = crudByResource(resource);
  if (!cfg) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const res = updateRow(cfg, Number(id), body || {});
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ resource: string; id: string }> }) {
  await requireAdmin();
  const { resource, id } = await ctx.params;
  const cfg = crudByResource(resource);
  if (!cfg) return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  deleteRow(cfg, Number(id));
  return NextResponse.json({ ok: true });
}
