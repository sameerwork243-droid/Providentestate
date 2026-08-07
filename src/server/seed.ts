import { getDb, rows, run, now } from "./db";
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

export function ensureSeeded(): void {
  const db = getDb();
  const roleCount = rows("SELECT COUNT(*) AS n FROM roles")[0].n as number;
  if (roleCount === 0) {
    run("INSERT INTO roles (name) VALUES ('admin'), ('user'), ('agent')");
  }

  const amenityCount = rows("SELECT COUNT(*) AS n FROM amenities")[0].n as number;
  if (amenityCount === 0) {
    const ins = db.prepare("INSERT INTO amenities (name) VALUES (?)");
    for (const a of DEFAULT_AMENITIES) ins.run(a);
  }

  const userCount = rows("SELECT COUNT(*) AS n FROM users")[0].n as number;
  if (userCount === 0) {
    const adminEmail = (process.env.PROVIDENT_ADMIN_EMAIL || "sameerwork243@gmail.com").toLowerCase();
    const adminPassword = process.env.PROVIDENT_ADMIN_PASSWORD || "Sameer@12";
    const adminRole = rows<{ id: number }>("SELECT id FROM roles WHERE name = 'admin'")[0]?.id ?? 1;
    const userRole = rows<{ id: number }>("SELECT id FROM roles WHERE name = 'user'")[0]?.id ?? 2;
    run(
      "INSERT INTO users (email, password_hash, name, role_id, is_active, created_at) VALUES (?, ?, ?, ?, 1, ?)",
      adminEmail,
      hashPassword(adminPassword),
      "Administrator",
      adminRole,
      now()
    );
    run(
      "INSERT INTO users (email, password_hash, name, role_id, is_active, created_at) VALUES (?, ?, ?, ?, 1, ?)",
      "demo@provident.ae",
      hashPassword("Demo@1234"),
      "Demo User",
      userRole,
      now()
    );
  }

  const catCount = rows("SELECT COUNT(*) AS n FROM categories")[0].n as number;
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
    const ins = db.prepare("INSERT INTO categories (name, slug, type, sort) VALUES (?, ?, 'property', ?)");
    cats.forEach(([name, slug], i) => ins.run(name, slug, i));
  }

  const devCount = rows("SELECT COUNT(*) AS n FROM developers")[0].n as number;
  if (devCount === 0) {
    try {
      const file = path.join(process.cwd(), "data", "raw", "developers.json");
      const devs = JSON.parse(readFileSync(file, "utf8"));
      const ins = db.prepare(
        "INSERT INTO developers (name, slug, region, img, description, published, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)"
      );
      for (const d of devs) {
        ins.run(d.name, d.slug, d.region || "", d.logo || "", d.description || "", now());
      }
    } catch {
      // developers.json unavailable - admin can add developers manually
    }
  }

  const contactCount = rows("SELECT COUNT(*) AS n FROM contact_info")[0].n as number;
  if (contactCount === 0) {
    const pairs: [string, string][] = [
      ["phone", "+971 50 539 0249"],
      ["email", "info@providentestate.com"],
      ["whatsapp", "https://wa.provident.ae/inquire?phone=971505423503"],
      ["address", "Dubai, United Arab Emirates"],
    ];
    const ins = db.prepare("INSERT INTO contact_info (key, value) VALUES (?, ?)");
    for (const [k, v] of pairs) ins.run(k, v);
  }
}

export function seed(): void {
  ensureSeeded();
  console.log("[seed] database ready");
}