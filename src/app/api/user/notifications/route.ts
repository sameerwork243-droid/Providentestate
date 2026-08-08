import { NextResponse } from "next/server";
import { getAuthUser } from "@/server/session";
import { run, row, now } from "@/server/db";

export async function GET(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const preferences = await row(
    `SELECT subscribe_news, email_notifications, property_alerts
     FROM notification_preferences WHERE user_id = ?`,
    user.id
  ) || {
    subscribe_news: true,
    email_notifications: true,
    property_alerts: true
  };

  return NextResponse.json({
    ok: true,
    preferences: {
      subscribe_news: Boolean(Number(preferences.subscribe_news)),
      email_notifications: Boolean(Number(preferences.email_notifications)),
      property_alerts: Boolean(Number(preferences.property_alerts)),
    }
  });
}

export async function PUT(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const preferences = body.preferences || {};
  const subscribe_news = Number(Boolean(preferences.subscribe_news));
  const email_notifications = Number(Boolean(preferences.email_notifications));
  const property_alerts = Number(Boolean(preferences.property_alerts));

  const existingPrefs = await row("SELECT id FROM notification_preferences WHERE user_id = ?", user.id);
  if (existingPrefs) {
    await run(
      `UPDATE notification_preferences SET
        subscribe_news = ?,
        email_notifications = ?,
        property_alerts = ?,
        updated_at = ?
       WHERE id = ?`,
      subscribe_news,
      email_notifications,
      property_alerts,
      now(),
      (existingPrefs as { id: number }).id
    );
  } else {
    await run(
      `INSERT INTO notification_preferences (
        user_id, subscribe_news, email_notifications, property_alerts, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      user.id,
      subscribe_news,
      email_notifications,
      property_alerts,
      now(),
      now()
    );
  }

  return NextResponse.json({ ok: true });
}