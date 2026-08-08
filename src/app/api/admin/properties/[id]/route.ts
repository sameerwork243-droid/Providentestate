import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows } from "@/server/db";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await ctx.params;
  const item = (await rows("SELECT * FROM properties WHERE id = ?", Number(id)))[0];
  if (!item) return NextResponse.json({ error: "Property not found" }, { status: 404 });
  const amenities = (
    await rows(
      "SELECT a.name FROM property_amenities pa JOIN amenities a ON a.id = pa.amenity_id WHERE pa.property_id = ? ORDER BY a.name",
      Number(id)
    )
  ).map((a) => String(a.name));
  const media = await rows("SELECT * FROM property_media WHERE property_id = ? ORDER BY sort_order, id", Number(id));
  return NextResponse.json({ item: { ...item, amenities, media } });
}
