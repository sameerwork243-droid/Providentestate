import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { put } from "@vercel/blob";

export const maxDuration = 60;

export async function POST(req: Request) {
  await requireAdmin();
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid upload" }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }

  const safe = file.name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-");
  const blob = await put(`provident/${Date.now()}-${safe}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
