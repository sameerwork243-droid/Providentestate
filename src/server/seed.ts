import { rows, run, now, dbEnabled } from "./db";
import { hashPassword } from "./auth-core";
import { readFileSync } from "node:fs";
import path from "node:path";

export const DEFAULT_AMENITIES = [
  "Swimming Pool",
  "Gym",
  "Balcony",
  "Maid Room",
  "Study Room",
  "Children's Play Area",
  "BBQ Area",
  "Covered Parking",
  "Security",
  "Concierge",
  "Waterfront",
  "Pet Friendly",
  "Smart Home",
  "Elevator",
  "Central AC",
];

export async function ensureSeeded(): Promise<void> {
  if (!dbEnabled()) return;

  const roleCount = Number((await rows("SELECT COUNT(*) AS n FROM roles"))[0]?.n ?? 0);
  if (roleCount === 0) {
    await run("INSERT INTO roles (name) VALUES ('admin'), ('user'), ('agent')");
  }

  const amenityCount = Number((await rows("SELECT COUNT(*) AS n FROM amenities"))[0]?.n ?? 0);
  if (amenityCount === 0) {
    for (const a of DEFAULT_AMENITIES) {
      await run("INSERT INTO amenities (name) VALUES (?)", a);
    }
  }

  const userCount = Number((await rows("SELECT COUNT(*) AS n FROM users"))[0]?.n ?? 0);
  if (userCount === 0) {
    const adminEmail = (process.env.PROVIDENT_ADMIN_EMAIL || "sameerwork243@gmail.com").toLowerCase();
    const adminPassword = process.env.PROVIDENT_ADMIN_PASSWORD || "Sameer@12";
    const adminRole = Number((await rows<{ id: number }>("SELECT id FROM roles WHERE name = 'admin'"))[0]?.id ?? 1);
    const userRole = Number((await rows<{ id: number }>("SELECT id FROM roles WHERE name = 'user'"))[0]?.id ?? 2);
    await run(
      "INSERT INTO users (email, password_hash, name, role_id, is_active, created_at) VALUES (?, ?, ?, ?, 1, ?)",
      adminEmail,
      hashPassword(adminPassword),
      "Administrator",
      adminRole,
      now()
    );
    await run(
      "INSERT INTO users (email, password_hash, name, role_id, is_active, created_at) VALUES (?, ?, ?, ?, 1, ?)",
      "demo@provident.ae",
      hashPassword("Demo@1234"),
      "Demo User",
      userRole,
      now()
    );
  }

  const catCount = Number((await rows("SELECT COUNT(*) AS n FROM categories"))[0]?.n ?? 0);
  if (catCount === 0) {
    const cats: [string, string][] = [
      ["Apartment", "apartment"],
      ["Villa", "villa"],
      ["Townhouse", "townhouse"],
      ["Penthouse", "penthouse"],
      ["Mansions", "mansions"],
      ["Duplex", "duplex"],
      ["Studio", "studio"],
      ["Commercial", "commercial"],
    ];
    for (let i = 0; i < cats.length; i++) {
      await run("INSERT INTO categories (name, slug, type, sort) VALUES (?, ?, 'property', ?)", cats[i][0], cats[i][1], i);
    }
  }

  const devCount = Number((await rows("SELECT COUNT(*) AS n FROM developers"))[0]?.n ?? 0);
  if (devCount === 0) {
    try {
      const file = path.join(process.cwd(), "data", "raw", "developers.json");
      const devs = JSON.parse(readFileSync(file, "utf8"));
      for (const d of devs) {
        await run(
          "INSERT INTO developers (name, slug, region, img, description, published, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)",
          d.name,
          d.slug,
          d.region || "",
          d.logo || "",
          d.description || "",
          now()
        );
      }
    } catch {
      // developers.json unavailable - admin can add developers manually
    }
  }

  const contactCount = Number((await rows("SELECT COUNT(*) AS n FROM contact_info"))[0]?.n ?? 0);
  if (contactCount === 0) {
    const pairs: [string, string][] = [
      ["phone", "+971 50 539 0249"],
      ["email", "info@providentestate.com"],
      ["whatsapp", "https://wa.provident.ae/inquire?phone=971505423503"],
      ["address", "Dubai, United Arab Emirates"],
    ];
    for (const [k, v] of pairs) {
      await run("INSERT INTO contact_info (key, value) VALUES (?, ?)", k, v);
    }
  }
}

export async function seed(): Promise<void> {
  await ensureSeeded();
  console.log("[seed] database ready");
}
