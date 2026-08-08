import { NextResponse } from "next/server";
import { getAuthUser } from "@/server/session";
import { run, row, now } from "@/server/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Get user details
  const userRecord = await row(
    `SELECT u.id, u.email, u.name, u.phone, u.first_name, u.surname, u.avatar, u.role_id, u.is_active, u.created_at, u.updated_at
     FROM users u WHERE u.id = ?`,
    user.id
  );
  if (!userRecord) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Get user address
  const address = await row(
    `SELECT address_line1, address_line2, town_city, postcode, country, is_primary
     FROM user_addresses WHERE user_id = ? AND is_primary = 1`,
    user.id
  ) || {
    address_line1: "",
    address_line2: "",
    town_city: "",
    postcode: "",
    country: "",
    is_primary: 1
  };

  // Get notification preferences
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
    user: {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      first_name: userRecord.first_name || "",
      surname: userRecord.surname || "",
      phone: userRecord.phone || "",
      avatar: userRecord.avatar || "",
    },
    address: {
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      town_city: address.town_city,
      postcode: address.postcode,
      country: address.country,
    },
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

  // Validate personal details
  const first_name = String(body.first_name || "").trim();
  const surname = String(body.surname || "").trim();
  const name = `${first_name} ${surname}`.trim();
  if (first_name.length < 1) return NextResponse.json({ error: "First name is required" }, { status: 400 });
  if (surname.length < 1) return NextResponse.json({ error: "Surname is required" }, { status: 400 });

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }
  if (email !== user.email) {
    const clash = await row("SELECT COUNT(*) AS n FROM users WHERE LOWER(email) = ? AND id != ?", email, user.id);
    if (Number((clash as { n: number }).n) > 0) {
      return NextResponse.json({ error: "That email is already in use" }, { status: 409 });
    }
  }

  const phone = String(body.phone || "").trim();

  // Validate address
  const address = body.address || {};
  const address_line1 = String(address.address_line1 || "").trim();
  const address_line2 = String(address.address_line2 || "").trim();
  const town_city = String(address.town_city || "").trim();
  const postcode = String(address.postcode || "").trim();
  const country = String(address.country || "").trim();

  // Update user
  await run(
    `UPDATE users SET
      first_name = ?,
      surname = ?,
      name = ?,
      email = ?,
      phone = ?,
      updated_at = ?
     WHERE id = ?`,
    first_name,
    surname,
    name,
    email,
    phone,
    now(),
    user.id
  );

  // Update or insert address
  const existingAddress = await row("SELECT id FROM user_addresses WHERE user_id = ? AND is_primary = 1", user.id);
  if (existingAddress) {
    await run(
      `UPDATE user_addresses SET
        address_line1 = ?,
        address_line2 = ?,
        town_city = ?,
        postcode = ?,
        country = ?,
        updated_at = ?
       WHERE id = ?`,
      address_line1,
      address_line2,
      town_city,
      postcode,
      country,
      now(),
      (existingAddress as { id: number }).id
    );
  } else {
    await run(
      `INSERT INTO user_addresses (
        user_id, address_line1, address_line2, town_city, postcode, country, is_primary, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      user.id,
      address_line1,
      address_line2,
      town_city,
      postcode,
      country,
      1,
      now(),
      now()
    );
  }

  // Update notification preferences
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