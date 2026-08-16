import { createPool, Pool as MyPool } from "mysql2/promise";
import { Pool as PgPool, types as pgTypes } from "pg";

let mysqlPool: MyPool | null = null;
let pgPool: PgPool | null = null;
let ready: Promise<void> | null = null;

const DATABASE_URL = process.env.PROVIDENT_DATABASE_URL || process.env.DATABASE_URL || "";

const isPgUrl = (u: string) => u.startsWith("postgres://") || u.startsWith("postgresql://");
const isMyUrl = (u: string) => u.startsWith("mysql://");

export type DbDriver = "mysql" | "pg";

export function dbDriver(): DbDriver | null {
  if (isMyUrl(DATABASE_URL)) return "mysql";
  if (isPgUrl(DATABASE_URL)) return "pg";
  return null;
}

/** True when a MySQL or Postgres connection string is configured. */
export function dbEnabled(): boolean {
  return dbDriver() !== null;
}

function isTransientError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as Record<string, unknown>;
  const code = e.code as string | undefined;
  const errno = e.errno as string | undefined;
  const message = e.message as string | undefined;
  return (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ENOTFOUND" ||
    code === "EHOSTUNREACH" ||
    code === "ECONNREFUSED" ||
    code === "57P01" ||
    code === "57P02" ||
    code === "57P03" ||
    code === "08001" ||
    code === "08006" ||
    errno === "-4077" ||
    (typeof message === "string" &&
      (message.includes("ECONNRESET") ||
        message.includes("connection terminated") ||
        message.includes("Lost connection") ||
        message.includes("Connection terminated unexpectedly") ||
        message.includes("timeout") ||
        message.includes("socket hang up") ||
        message.includes("remaining connection slots")))
  );
}

async function queryWithRetry<T>(
  fn: () => Promise<T>,
  retries = 4,
  delayMs = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0 && isTransientError(err)) {
      await new Promise((r) => setTimeout(r, delayMs));
      return queryWithRetry(fn, retries - 1, delayMs * 2);
    }
    throw err;
  }
}

function pgSsl(): boolean | { rejectUnauthorized: boolean } {
  const flag = process.env.PROVIDENT_DB_SSL;
  if (flag === "1") return { rejectUnauthorized: false };
  if (flag === "0") return false;
  const m = DATABASE_URL.match(/[?&]sslmode=([^&]+)/i);
  const mode = m ? m[1].toLowerCase() : "";
  if (mode === "disable" || mode === "allow" || mode === "prefer") return false;
  return { rejectUnauthorized: false };
}

function getMyPool(): MyPool {
  if (!mysqlPool) {
    const ssl = process.env.PROVIDENT_DB_SSL === "1" ? { rejectUnauthorized: false } : undefined;
    mysqlPool = createPool({
      uri: DATABASE_URL,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 15000,
      charset: "utf8mb4",
      ...(ssl ? { ssl } : {}),
    });
  }
  return mysqlPool;
}

function getPgPool(): PgPool {
  if (!pgPool) {
    pgPool = new PgPool({
      connectionString: DATABASE_URL,
      ssl: pgSsl(),
      max: 5,
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 30000,
      query_timeout: 30000,
      keepAlive: true,
    });
  }
  return pgPool;
}

/** The active pool (either driver). Most callers should use rows/row/run. */
export function getPool(): MyPool | PgPool {
  if (dbDriver() === "pg") return getPgPool();
  return getMyPool();
}

export function getDb(): MyPool | PgPool {
  return getPool();
}

export function dbDriverName(): string {
  return dbDriver() ?? "none";
}

/**
 * PostgreSQL needs `$1`-style placeholders, no backticks, and a different
 * upsert/ignore syntax. These transforms are applied to every statement when
 * the configured database is Postgres (Neon etc.); MySQL statements pass
 * through untouched.
 */
function rewritePlaceholders(sql: string): string {
  let out = "";
  let n = 0;
  let i = 0;
  while (i < sql.length) {
    const ch = sql[i];
    if (ch === "'") {
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === "'") {
          if (sql[j + 1] === "'") {
            j += 2;
            continue;
          }
          break;
        }
        j++;
      }
      out += sql.slice(i, j + 1);
      i = j + 1;
    } else if (ch === "?") {
      if (sql[i + 1] === "?") {
        out += "??";
        i += 2;
      } else {
        n++;
        out += "$" + n;
        i++;
      }
    } else {
      out += ch;
      i++;
    }
  }
  return out;
}

/** Unique-key target used to turn MySQL `ON DUPLICATE KEY UPDATE` into PG `ON CONFLICT (...)`. */
const UPSERT_TARGETS: Record<string, string> = {
  properties: "slug",
  projects: "slug",
  page_content: "key",
  homepage_content: "key",
  contact_info: "key",
  users: "email",
  roles: "name",
  amenities: "name",
  agents: "slug",
  developers: "slug",
  communities: "slug",
  categories: "slug",
  jobs: "slug",
  services: "slug",
  sessions: "token_hash",
  saved_properties: "user_id, property_ref",
  project_details: "slug",
};

export function translatePg(sql: string): string {
  let s = sql.trim().replace(/;+\s*$/, "");
  s = s.replace(/`([^`]+)`/g, "$1");
  if (/^INSERT\s+IGNORE\s+INTO/i.test(s)) {
    s = s.replace(/^INSERT\s+IGNORE\s+INTO/i, "INSERT INTO");
    if (!/\bON CONFLICT\b|\bON DUPLICATE\b/i.test(s)) {
      s += " ON CONFLICT DO NOTHING";
    }
  }
  const dup = s.match(/\bON DUPLICATE KEY UPDATE\s+([\s\S]*)$/i);
  if (dup) {
    const table = (s.match(/^INSERT(?:\s+IGNORE)?\s+INTO\s+(\w+)/i) || [])[1] || "";
    const target = UPSERT_TARGETS[table.toLowerCase()] || "id";
    let clause = dup[1].trim().replace(/;?\s*$/, "");
    clause = clause.replace(/\bVALUES\(([^)]+)\)/g, "EXCLUDED.$1");
    // Bare column refs on the RHS are ambiguous in PG's ON CONFLICT SET
    // (e.g. `slug = slug`); qualify them with EXCLUDED (same value on conflict).
    clause = clause.replace(
      /=\s*(?!EXCLUDED\.)([a-z_][a-z0-9_]*)\b/gi,
      (mm: string, col: string) => `= EXCLUDED.${col}`
    );
    s = s.slice(0, dup.index) + `ON CONFLICT (${target}) DO UPDATE SET ${clause}`;
  }
  return rewritePlaceholders(s);
}

async function migrate(): Promise<void> {
  if (dbDriver() === "pg") {
    const c = await getPgPool().connect();
    try {
      for (const sql of PG_MIGRATIONS) {
        try {
          await c.query(sql);
        } catch (err) {
          console.error("[db:pg] migration error:", (err as Error).message);
        }
      }
      for (const sql of PG_ALTERS) {
        try {
          await c.query(sql);
        } catch (err) {
          console.error("[db:pg] alter migration error:", (err as Error).message);
        }
      }
    } finally {
      c.release();
    }
    return;
  }
  const c = await getMyPool().getConnection();
  try {
    for (const sql of MIGRATIONS) {
      try {
        await c.query(sql);
      } catch (err) {
        console.error("[db] migration error:", err);
      }
    }
    for (const { table, column, ddl } of ALTER_MIGRATIONS) {
      try {
        const [rows] = await c.query(
          "SELECT COUNT(*) AS n FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
          [table, column]
        );
        const exists = Number((rows as Array<{ n: number }>)[0]?.n ?? 0) > 0;
        if (!exists) await c.query(ddl);
      } catch (err) {
        console.error("[db] alter migration error:", err);
      }
    }
  } finally {
    c.release();
  }
}

export function ensureMigrated(): Promise<void> {
  if (!ready) {
    ready = migrate().catch((err) => {
      ready = null;
      throw err;
    });
  }
  return ready;
}

export async function closeDb(): Promise<void> {
  if (mysqlPool) {
    await mysqlPool.end();
    mysqlPool = null;
  }
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
  ready = null;
}

export function now(): string {
  return new Date().toISOString();
}

export async function rows<T = Record<string, unknown>>(sql: string, ...params: unknown[]): Promise<T[]> {
  await ensureMigrated();
  return queryWithRetry(async () => {
    if (dbDriver() === "pg") {
      const res = await getPgPool().query({ text: translatePg(sql), values: params as unknown[] });
      return res.rows as T[];
    }
    const [res] = await getMyPool().query(sql, params);
    return res as T[];
  });
}

export async function row<T = Record<string, unknown>>(sql: string, ...params: unknown[]): Promise<T | undefined> {
  await ensureMigrated();
  return queryWithRetry(async () => {
    if (dbDriver() === "pg") {
      const res = await getPgPool().query({ text: translatePg(sql), values: params as unknown[] });
      return res.rows[0] as T | undefined;
    }
    const [res] = await getMyPool().query(sql, params);
    return (res as T[])[0];
  });
}

export async function run(
  sql: string,
  ...params: unknown[]
): Promise<{ changes: number; lastId: number }> {
  await ensureMigrated();
  return queryWithRetry(async () => {
    if (dbDriver() === "pg") {
      let text = translatePg(sql);
      if (/^INSERT INTO/i.test(text) && !/\bRETURNING\b/i.test(text) && !/^INSERT INTO (property_amenities|project_details)\b/i.test(text)) {
        text += " RETURNING id";
      }
      const res = await getPgPool().query({ text, values: params as unknown[] });
      return { changes: res.rowCount ?? 0, lastId: Number(res.rows?.[0]?.id ?? 0) };
    }
    const [res] = await getMyPool().query(sql, params);
    const r = res as { affectedRows: number; insertId: number };
    return { changes: r.affectedRows ?? 0, lastId: r.insertId ?? 0 };
  });
}

export function prepare(sql: string): { all: (...p: unknown[]) => Promise<unknown[]>; get: (...p: unknown[]) => Promise<unknown | undefined>; run: (...p: unknown[]) => Promise<{ changes: number; lastId: number }> } {
  return {
    all: (...p: unknown[]) => rows(sql, ...p),
    get: (...p: unknown[]) => row(sql, ...p),
    run: (...p: unknown[]) => run(sql, ...p),
  };
}

export type { Pool, PoolConnection } from "mysql2/promise";

// Postgres integer/bigint columns arrive as strings via node-postgres; coerce
// them back to numbers so the rest of the app sees the same shapes as MySQL.
pgTypes.setTypeParser(20, (v: string) => (v === null ? null : Number(v)));

const CHARSET = "DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";

const MIGRATIONS: string[] = [
  `CREATE TABLE IF NOT EXISTS roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT '',
    avatar VARCHAR(500) DEFAULT '',
    role_id INT NOT NULL DEFAULT 2,
    is_active INT NOT NULL DEFAULT 1,
    last_login_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    expires_at BIGINT NOT NULL,
    user_agent TEXT DEFAULT '',
    ip TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    KEY idx_sessions_user (user_id),
    KEY idx_sessions_expiry (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS saved_properties (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_ref VARCHAR(255) NOT NULL,
    property_slug VARCHAR(255) NOT NULL DEFAULT '',
    title VARCHAR(500) DEFAULT '',
    price INT DEFAULT 0,
    thumb VARCHAR(1000) DEFAULT '',
    created_at TEXT NOT NULL,
    UNIQUE (user_id, property_ref),
    KEY idx_saved_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS inquiries (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) DEFAULT '',
    kind VARCHAR(50) NOT NULL DEFAULT 'property',
    property_ref VARCHAR(255) DEFAULT '',
    property_slug VARCHAR(255) DEFAULT '',
    message TEXT DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL,
    KEY idx_inquiries_user (user_id),
    KEY idx_inquiries_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS viewings (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_ref VARCHAR(255) DEFAULT '',
    property_slug VARCHAR(255) DEFAULT '',
    preferred_date TEXT DEFAULT '',
    time_slot TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'requested',
    created_at TEXT NOT NULL,
    KEY idx_viewings_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    body TEXT DEFAULT '',
    type VARCHAR(50) DEFAULT 'info',
    \`read\` INT NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    KEY idx_notifications_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS amenities (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS properties (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) DEFAULT '',
    property_type VARCHAR(100) DEFAULT 'apartment',
    transaction_type VARCHAR(20) DEFAULT 'buy',
    status VARCHAR(50) DEFAULT 'ready',
    price BIGINT DEFAULT 0,
    price_qualifier VARCHAR(20) DEFAULT 'AED',
    community VARCHAR(255) DEFAULT '',
    developer VARCHAR(255) DEFAULT '',
    location VARCHAR(500) DEFAULT '',
    latitude DOUBLE,
    longitude DOUBLE,
    display_address VARCHAR(1000) DEFAULT '',
    bedroom INT DEFAULT 0,
    bathroom INT DEFAULT 0,
    area_sqft INT DEFAULT 0,
    plot_size INT DEFAULT 0,
    parking INT DEFAULT 0,
    furnished VARCHAR(100) DEFAULT '',
    completion_status VARCHAR(100) DEFAULT '',
    year_built INT,
    introtext TEXT DEFAULT '',
    long_description MEDIUMTEXT DEFAULT '',
    featured INT NOT NULL DEFAULT 0,
    published INT NOT NULL DEFAULT 1,
    created_by INT,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    KEY idx_properties_status (status),
    KEY idx_properties_featured (featured),
    KEY idx_properties_transaction (transaction_type),
    FOREIGN KEY (created_by) REFERENCES users(id)
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS property_media (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    kind VARCHAR(20) NOT NULL DEFAULT 'image',
    url VARCHAR(1000) NOT NULL,
    is_featured INT NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    KEY idx_property_media (property_id),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS property_amenities (
    property_id INT NOT NULL,
    amenity_id INT NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS services (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(1000) DEFAULT '',
    banner_image VARCHAR(1000) DEFAULT '',
    description TEXT DEFAULT '',
    rich_content MEDIUMTEXT DEFAULT '',
    gallery TEXT DEFAULT '[]',
    seo_title VARCHAR(500) DEFAULT '',
    seo_description VARCHAR(1000) DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS agents (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255) DEFAULT '',
    phone VARCHAR(100) DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    languages TEXT DEFAULT '[]',
    specialties TEXT DEFAULT '[]',
    img VARCHAR(1000) DEFAULT '',
    bio TEXT DEFAULT '',
    brn_number VARCHAR(100) DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS developers (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    region VARCHAR(255) DEFAULT '',
    founded INT,
    deliveries INT DEFAULT 0,
    img VARCHAR(1000) DEFAULT '',
    description TEXT DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS communities (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    region VARCHAR(255) DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS categories (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) DEFAULT '',
    sort INT NOT NULL DEFAULT 0
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS testimonials (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT '',
    content TEXT DEFAULT '',
    rating INT NOT NULL DEFAULT 5,
    img VARCHAR(1000) DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS faqs (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(1000) NOT NULL,
    answer TEXT DEFAULT '',
    category VARCHAR(255) DEFAULT '',
    sort INT NOT NULL DEFAULT 0,
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS homepage_content (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    \`key\` VARCHAR(191) NOT NULL UNIQUE,
    value MEDIUMTEXT DEFAULT ''
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS contact_info (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    \`key\` VARCHAR(191) NOT NULL UNIQUE,
    value TEXT DEFAULT ''
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS page_content (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    \`key\` VARCHAR(191) NOT NULL UNIQUE,
    value MEDIUMTEXT DEFAULT ''
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS jobs (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255) DEFAULT '',
    summary TEXT DEFAULT '',
    job_details MEDIUMTEXT DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS media_library (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(1000) NOT NULL,
    kind VARCHAR(20) DEFAULT 'image',
    alt VARCHAR(500) DEFAULT '',
    created_at TEXT NOT NULL
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS user_addresses (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_line1 VARCHAR(500) DEFAULT '',
    address_line2 VARCHAR(500) DEFAULT '',
    town_city VARCHAR(255) DEFAULT '',
    postcode VARCHAR(50) DEFAULT '',
    country VARCHAR(100) DEFAULT '',
    is_primary INT NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    KEY idx_user_addresses_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS notification_preferences (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subscribe_news INT NOT NULL DEFAULT 1,
    email_notifications INT NOT NULL DEFAULT 1,
    property_alerts INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    KEY idx_notification_preferences_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS password_updates (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS account_deletion_logs (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reason TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS projects (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) DEFAULT 'new-project',
    status VARCHAR(100) DEFAULT '',
    price BIGINT DEFAULT 0,
    currency VARCHAR(20) DEFAULT 'AED',
    community VARCHAR(255) DEFAULT '',
    developer VARCHAR(255) DEFAULT '',
    building_type TEXT DEFAULT '[]',
    department VARCHAR(255) DEFAULT '',
    bedrooms_min INT DEFAULT 0,
    bedrooms_max INT DEFAULT 0,
    display_address VARCHAR(1000) DEFAULT '',
    about MEDIUMTEXT DEFAULT '',
    images TEXT DEFAULT '[]',
    amenities TEXT DEFAULT '[]',
    banner_image VARCHAR(1000) DEFAULT '',
    completion_year INT,
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    KEY idx_projects_status (status)
  ) ${CHARSET};`,
  `CREATE TABLE IF NOT EXISTS project_details (
    slug VARCHAR(255) NOT NULL PRIMARY KEY,
    data MEDIUMTEXT NOT NULL,
    updated_at TEXT NOT NULL
  ) ${CHARSET};`,
];

// Columns added on top of the base schema (checked against information_schema because
// "ADD COLUMN IF NOT EXISTS" is not supported on MySQL 8).
const ALTER_MIGRATIONS: { table: string; column: string; ddl: string }[] = [
  { table: "users", column: "first_name", ddl: `ALTER TABLE users ADD COLUMN first_name VARCHAR(255) DEFAULT ''` },
  { table: "users", column: "surname", ddl: `ALTER TABLE users ADD COLUMN surname VARCHAR(255) DEFAULT ''` },
  { table: "properties", column: "agent_id", ddl: `ALTER TABLE properties ADD COLUMN agent_id INT, ADD FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL` },
];

// Postgres (Neon) schema: SERIAL ids, TEXT instead of MEDIUMTEXT, no inline
// index definitions, no backtick quoting (`key`/`read` are non-reserved here).
const PG_MIGRATIONS: string[] = [
  `CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT '',
    avatar VARCHAR(500) DEFAULT '',
    role_id INT NOT NULL DEFAULT 2,
    is_active INT NOT NULL DEFAULT 1,
    last_login_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    expires_at BIGINT NOT NULL,
    user_agent TEXT DEFAULT '',
    ip TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS saved_properties (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    property_ref VARCHAR(255) NOT NULL,
    property_slug VARCHAR(255) NOT NULL DEFAULT '',
    title VARCHAR(500) DEFAULT '',
    price INT DEFAULT 0,
    thumb VARCHAR(1000) DEFAULT '',
    created_at TEXT NOT NULL,
    UNIQUE (user_id, property_ref),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) DEFAULT '',
    kind VARCHAR(50) NOT NULL DEFAULT 'property',
    property_ref VARCHAR(255) DEFAULT '',
    property_slug VARCHAR(255) DEFAULT '',
    message TEXT DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS viewings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    property_ref VARCHAR(255) DEFAULT '',
    property_slug VARCHAR(255) DEFAULT '',
    preferred_date TEXT DEFAULT '',
    time_slot TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'requested',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    body TEXT DEFAULT '',
    type VARCHAR(50) DEFAULT 'info',
    read INT NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
  )`,
  `CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) DEFAULT '',
    property_type VARCHAR(100) DEFAULT 'apartment',
    transaction_type VARCHAR(20) DEFAULT 'buy',
    status VARCHAR(50) DEFAULT 'ready',
    price BIGINT DEFAULT 0,
    price_qualifier VARCHAR(20) DEFAULT 'AED',
    community VARCHAR(255) DEFAULT '',
    developer VARCHAR(255) DEFAULT '',
    location VARCHAR(500) DEFAULT '',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    display_address VARCHAR(1000) DEFAULT '',
    bedroom INT DEFAULT 0,
    bathroom INT DEFAULT 0,
    area_sqft INT DEFAULT 0,
    plot_size INT DEFAULT 0,
    parking INT DEFAULT 0,
    furnished VARCHAR(100) DEFAULT '',
    completion_status VARCHAR(100) DEFAULT '',
    year_built INT,
    introtext TEXT DEFAULT '',
    long_description TEXT DEFAULT '',
    featured INT NOT NULL DEFAULT 0,
    published INT NOT NULL DEFAULT 1,
    created_by INT,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`,
  `CREATE TABLE IF NOT EXISTS property_media (
    id SERIAL PRIMARY KEY,
    property_id INT NOT NULL,
    kind VARCHAR(20) NOT NULL DEFAULT 'image',
    url VARCHAR(1000) NOT NULL,
    is_featured INT NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS property_amenities (
    property_id INT NOT NULL,
    amenity_id INT NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(1000) DEFAULT '',
    banner_image VARCHAR(1000) DEFAULT '',
    description TEXT DEFAULT '',
    rich_content TEXT DEFAULT '',
    gallery TEXT DEFAULT '[]',
    seo_title VARCHAR(500) DEFAULT '',
    seo_description VARCHAR(1000) DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS agents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255) DEFAULT '',
    phone VARCHAR(100) DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    languages TEXT DEFAULT '[]',
    specialties TEXT DEFAULT '[]',
    img VARCHAR(1000) DEFAULT '',
    bio TEXT DEFAULT '',
    brn_number VARCHAR(100) DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS developers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    region VARCHAR(255) DEFAULT '',
    founded INT,
    deliveries INT DEFAULT 0,
    img VARCHAR(1000) DEFAULT '',
    description TEXT DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    region VARCHAR(255) DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) DEFAULT '',
    sort INT NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT '',
    content TEXT DEFAULT '',
    rating INT NOT NULL DEFAULT 5,
    img VARCHAR(1000) DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question VARCHAR(1000) NOT NULL,
    answer TEXT DEFAULT '',
    category VARCHAR(255) DEFAULT '',
    sort INT NOT NULL DEFAULT 0,
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS homepage_content (
    id SERIAL PRIMARY KEY,
    key VARCHAR(191) NOT NULL UNIQUE,
    value TEXT DEFAULT ''
  )`,
  `CREATE TABLE IF NOT EXISTS contact_info (
    id SERIAL PRIMARY KEY,
    key VARCHAR(191) NOT NULL UNIQUE,
    value TEXT DEFAULT ''
  )`,
  `CREATE TABLE IF NOT EXISTS page_content (
    id SERIAL PRIMARY KEY,
    key VARCHAR(191) NOT NULL UNIQUE,
    value TEXT DEFAULT ''
  )`,
  `CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255) DEFAULT '',
    summary TEXT DEFAULT '',
    job_details TEXT DEFAULT '',
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS media_library (
    id SERIAL PRIMARY KEY,
    url VARCHAR(1000) NOT NULL,
    kind VARCHAR(20) DEFAULT 'image',
    alt VARCHAR(500) DEFAULT '',
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS user_addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    address_line1 VARCHAR(500) DEFAULT '',
    address_line2 VARCHAR(500) DEFAULT '',
    town_city VARCHAR(255) DEFAULT '',
    postcode VARCHAR(50) DEFAULT '',
    country VARCHAR(100) DEFAULT '',
    is_primary INT NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS notification_preferences (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    subscribe_news INT NOT NULL DEFAULT 1,
    email_notifications INT NOT NULL DEFAULT 1,
    property_alerts INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS password_updates (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS account_deletion_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    reason TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) DEFAULT 'new-project',
    status VARCHAR(100) DEFAULT '',
    price BIGINT DEFAULT 0,
    currency VARCHAR(20) DEFAULT 'AED',
    community VARCHAR(255) DEFAULT '',
    developer VARCHAR(255) DEFAULT '',
    building_type TEXT DEFAULT '[]',
    department VARCHAR(255) DEFAULT '',
    bedrooms_min INT DEFAULT 0,
    bedrooms_max INT DEFAULT 0,
    display_address VARCHAR(1000) DEFAULT '',
    about TEXT DEFAULT '',
    images TEXT DEFAULT '[]',
    amenities TEXT DEFAULT '[]',
    banner_image VARCHAR(1000) DEFAULT '',
    completion_year INT,
    published INT NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS project_details (
    slug VARCHAR(255) NOT NULL PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
];

// Postgres supports ADD COLUMN IF NOT EXISTS natively; the FK needs a DO block
// because ADD CONSTRAINT IF NOT EXISTS does not exist.
const PG_ALTERS: string[] = [
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255) DEFAULT ''`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS surname VARCHAR(255) DEFAULT ''`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'agent_id') THEN
      ALTER TABLE properties ADD COLUMN agent_id INT;
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'properties'::regclass AND conname = 'fk_properties_agent_id') THEN
      ALTER TABLE properties ADD CONSTRAINT fk_properties_agent_id FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL;
    END IF;
  END $$`,
];