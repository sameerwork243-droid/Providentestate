import { DatabaseSync, StatementSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

let db: DatabaseSync | null = null;
const DB_FILE = process.env.PROVIDENT_DB_FILE || path.join(process.cwd(), "data", "provident.db");

export function getDb(): DatabaseSync {
  if (db) return db;
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  db = new DatabaseSync(DB_FILE);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");
  runMigrations(db);
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function now(): string {
  return new Date().toISOString();
}

export function rows<T = Record<string, unknown>>(sql: string, ...params: unknown[]): T[] {
  const db = getDb();
  return db.prepare(sql).all(...params) as T[];
}

export function row<T = Record<string, unknown>>(sql: string, ...params: unknown[]): T | undefined {
  const db = getDb();
  return db.prepare(sql).get(...params) as T | undefined;
}

export function run(sql: string, ...params: unknown[]): { changes: number; lastId: number } {
  const db = getDb();
  const res = db.prepare(sql).run(...params);
  return { changes: Number(res.changes), lastId: Number(res.lastInsertRowid) };
}

export function prepare(sql: string): StatementSync {
  return getDb().prepare(sql);
}

const MIGRATIONS: string[] = [
  `CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );`,
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    role_id INTEGER NOT NULL DEFAULT 2,
    is_active INTEGER NOT NULL DEFAULT 1,
    last_login_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
  );`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    user_agent TEXT DEFAULT '',
    ip TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);`,
  `CREATE TABLE IF NOT EXISTS saved_properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_ref TEXT NOT NULL,
    property_slug TEXT NOT NULL DEFAULT '',
    title TEXT DEFAULT '',
    price INTEGER DEFAULT 0,
    thumb TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    UNIQUE (user_id, property_ref),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_properties(user_id);`,
  `CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    kind TEXT NOT NULL DEFAULT 'property',
    property_ref TEXT DEFAULT '',
    property_slug TEXT DEFAULT '',
    message TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );`,
  `CREATE INDEX IF NOT EXISTS idx_inquiries_user ON inquiries(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);`,
  `CREATE TABLE IF NOT EXISTS viewings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_ref TEXT DEFAULT '',
    property_slug TEXT DEFAULT '',
    preferred_date TEXT DEFAULT '',
    time_slot TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'requested',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_viewings_user ON viewings(user_id);`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT DEFAULT '',
    type TEXT DEFAULT 'info',
    read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);`,
  `CREATE TABLE IF NOT EXISTS amenities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );`,
  `CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT DEFAULT '',
    property_type TEXT DEFAULT 'apartment',
    transaction_type TEXT DEFAULT 'buy',
    status TEXT DEFAULT 'ready',
    price INTEGER DEFAULT 0,
    price_qualifier TEXT DEFAULT 'AED',
    community TEXT DEFAULT '',
    developer TEXT DEFAULT '',
    location TEXT DEFAULT '',
    latitude REAL,
    longitude REAL,
    display_address TEXT DEFAULT '',
    bedroom INTEGER DEFAULT 0,
    bathroom INTEGER DEFAULT 0,
    area_sqft INTEGER DEFAULT 0,
    plot_size INTEGER DEFAULT 0,
    parking INTEGER DEFAULT 0,
    furnished TEXT DEFAULT '',
    completion_status TEXT DEFAULT '',
    year_built INTEGER,
    introtext TEXT DEFAULT '',
    long_description TEXT DEFAULT '',
    featured INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1,
    created_by INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id)
  );`,
  `CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);`,
  `CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);`,
  `CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);`,
  `CREATE INDEX IF NOT EXISTS idx_properties_transaction ON properties(transaction_type);`,
  `CREATE TABLE IF NOT EXISTS property_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    kind TEXT NOT NULL DEFAULT 'image',
    url TEXT NOT NULL,
    is_featured INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_property_media ON property_media(property_id);`,
  `CREATE TABLE IF NOT EXISTS property_amenities (
    property_id INTEGER NOT NULL,
    amenity_id INTEGER NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT '',
    banner_image TEXT DEFAULT '',
    description TEXT DEFAULT '',
    rich_content TEXT DEFAULT '',
    gallery TEXT DEFAULT '[]',
    seo_title TEXT DEFAULT '',
    seo_description TEXT DEFAULT '',
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    languages TEXT DEFAULT '[]',
    specialties TEXT DEFAULT '[]',
    img TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    brn_number TEXT DEFAULT '',
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    region TEXT DEFAULT '',
    founded INTEGER,
    deliveries INTEGER DEFAULT 0,
    img TEXT DEFAULT '',
    description TEXT DEFAULT '',
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS communities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    region TEXT DEFAULT '',
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT DEFAULT '',
    sort INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    role TEXT DEFAULT '',
    content TEXT DEFAULT '',
    rating INTEGER NOT NULL DEFAULT 5,
    img TEXT DEFAULT '',
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT DEFAULT '',
    category TEXT DEFAULT '',
    sort INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS homepage_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT DEFAULT ''
  );`,
  `CREATE TABLE IF NOT EXISTS contact_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT DEFAULT ''
  );`,
  `CREATE TABLE IF NOT EXISTS media_library (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    kind TEXT DEFAULT 'image',
    alt TEXT DEFAULT '',
    created_at TEXT NOT NULL
  );`,
  // Profile section tables
  `CREATE TABLE IF NOT EXISTS user_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    address_line1 TEXT DEFAULT '',
    address_line2 TEXT DEFAULT '',
    town_city TEXT DEFAULT '',
    postcode TEXT DEFAULT '',
    country TEXT DEFAULT '',
    is_primary INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_user_addresses_user ON user_addresses(user_id);`,
  `CREATE TABLE IF NOT EXISTS notification_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subscribe_news INTEGER NOT NULL DEFAULT 1,
    email_notifications INTEGER NOT NULL DEFAULT 1,
    property_alerts INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_notification_preferences_user ON notification_preferences(user_id);`,
  `CREATE TABLE IF NOT EXISTS password_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS account_deletion_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    reason TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`,
];

// Add first_name and surname columns to users table (if not exists)
const ALTER_MIGRATIONS: string[] = [
  `ALTER TABLE users ADD COLUMN first_name TEXT DEFAULT ''`,
  `ALTER TABLE users ADD COLUMN surname TEXT DEFAULT ''`,
];

function runMigrations(db: DatabaseSync): void {
  for (const sql of MIGRATIONS) {
    try {
      db.exec(sql);
    } catch (err) {
      console.error("[db] migration error:", err);
    }
  }
  // Run ALTER TABLE migrations separately (SQLite doesn't support IF NOT EXISTS in ALTER TABLE ADD COLUMN)
  for (const sql of ALTER_MIGRATIONS) {
    try {
      db.exec(sql);
    } catch (err) {
      // Column may already exist
      if (!String(err).includes("duplicate column name")) {
        console.error("[db] alter migration error:", err);
      }
    }
  }
}