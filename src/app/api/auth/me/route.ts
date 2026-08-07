import { NextResponse } from "next/server";
import { getAuthUser } from "@/server/session";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  return NextResponse.json({ user });
}