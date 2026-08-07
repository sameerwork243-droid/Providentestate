import { getDb, rows, row, run, now } from "./db";

export interface FieldDef {
  name: string;
  type?: "text" | "int" | "real" | "json";
  required?: boolean;
}

export interface CrudConfig {
  table: string;
  fields: FieldDef[];
  searchable?: string[];
  defaultOrder?: string;
}

function coerce(value: unknown, type: FieldDef["type"]): unknown {
  if (value === undefined || value === null || value === "") {
    if (type === "int") return 0;
    if (type === "real") return 0;
    if (type === "json") return "[]";
    return "";
  }
  switch (type) {
    case "int":
      return Number.isNaN(Number(value)) ? 0 : Number(value);
    case "real":
      return Number.isNaN(Number(value)) ? 0 : Number(value);
    case "json":
      return typeof value === "string" ? value : JSON.stringify(value ?? []);
    default:
      return String(value);
  }
}

export function validate(data: Record<string, unknown>, cfg: CrudConfig): { ok: true } | { ok: false; error: string } {
  for (const f of cfg.fields) {
    if (f.required) {
      const v = data[f.name];
      if (v === undefined || v === null || String(v).trim() === "") {
        return { ok: false, error: `Field "${f.name}" is required` };
      }
    }
  }
  return { ok: true };
}

export function listRows(
  cfg: CrudConfig,
  opts: { search?: string; page?: number; pageSize?: number } = {}
): { items: Record<string, unknown>[]; total: number } {
  const db = getDb();
  const search = (opts.search || "").trim();
  const where = search && cfg.searchable?.length ? ` WHERE ${cfg.searchable.map((c) => `${c} LIKE ?`).join(" OR ")}` : "";
  const params: unknown[] = [];
  if (search) for (const _ of cfg.searchable ?? []) params.push(`%${search}%`);
  const total = (row(`SELECT COUNT(*) AS n FROM ${cfg.table}${where}`, ...params)?.n as number) ?? 0;
  const page = Math.max(1, opts.page || 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize || 20));
  const items = rows(
    `SELECT * FROM ${cfg.table}${where} ORDER BY ${cfg.defaultOrder || "id DESC"} LIMIT ? OFFSET ?`,
    ...params,
    pageSize,
    (page - 1) * pageSize
  );
  return { items, total };
}

export function getRow(cfg: CrudConfig, id: number): Record<string, unknown> | undefined {
  return row(`SELECT * FROM ${cfg.table} WHERE id = ?`, id);
}

export function createRow(cfg: CrudConfig, data: Record<string, unknown>): { ok: boolean; error?: string; id?: number } {
  const v = validate(data, cfg);
  if (!v.ok) return { ok: false, error: v.error };
  const db = getDb();
  const cols = cfg.fields.map((f) => f.name);
  const values = cfg.fields.map((f) => coerce(data[f.name], f.type));
  const sql = `INSERT INTO ${cfg.table} (${cols.join(", ")}, created_at) VALUES (${cols.map(() => "?").join(", ")}, ?)`;
  try {
    const res = db.prepare(sql).run(...values, now());
    return { ok: true, id: Number(res.lastInsertRowid) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export function updateRow(
  cfg: CrudConfig,
  id: number,
  data: Record<string, unknown>
): { ok: boolean; error?: string } {
  const db = getDb();
  const cols = cfg.fields.filter((f) => f.name in data).map((f) => f.name);
  if (!cols.length) return { ok: true };
  const values = cfg.fields.filter((f) => f.name in data).map((f) => coerce(data[f.name], f.type));
  const sql = `UPDATE ${cfg.table} SET ${cols.map((c) => `${c} = ?`).join(", ")}, updated_at = ? WHERE id = ?`;
  try {
    db.prepare(sql).run(...values, now(), id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export function deleteRow(cfg: CrudConfig, id: number): void {
  run(`DELETE FROM ${cfg.table} WHERE id = ?`, id);
}
