import { rows, row, run, now, dbEnabled } from "./db";

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

export async function listRows(
  cfg: CrudConfig,
  opts: { search?: string; page?: number; pageSize?: number } = {}
): Promise<{ items: Record<string, unknown>[]; total: number }> {
  if (!dbEnabled()) return { items: [], total: 0 };
  const search = (opts.search || "").trim();
  const where = search && cfg.searchable?.length ? ` WHERE ${cfg.searchable.map((c) => `${c} LIKE ?`).join(" OR ")}` : "";
  const params: unknown[] = [];
  if (search) for (const _ of cfg.searchable ?? []) params.push(`%${search}%`);
  const total = Number((await row(`SELECT COUNT(*) AS n FROM ${cfg.table}${where}`, ...params))?.n ?? 0);
  const page = Math.max(1, opts.page || 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize || 20));
  const items = await rows(
    `SELECT * FROM ${cfg.table}${where} ORDER BY ${cfg.defaultOrder || "id DESC"} LIMIT ? OFFSET ?`,
    ...params,
    pageSize,
    (page - 1) * pageSize
  );
  return { items, total };
}

export async function getRow(cfg: CrudConfig, id: number): Promise<Record<string, unknown> | undefined> {
  if (!dbEnabled()) return undefined;
  return row(`SELECT * FROM ${cfg.table} WHERE id = ?`, id);
}

export async function createRow(cfg: CrudConfig, data: Record<string, unknown>): Promise<{ ok: boolean; error?: string; id?: number }> {
  const v = validate(data, cfg);
  if (!v.ok) return { ok: false, error: v.error };
  const cols = cfg.fields.map((f) => f.name);
  const values = cfg.fields.map((f) => coerce(data[f.name], f.type));
  const sql = `INSERT INTO ${cfg.table} (${cols.join(", ")}, created_at) VALUES (${cols.map(() => "?").join(", ")}, ?)`;
  try {
    const res = await run(sql, ...values, now());
    return { ok: true, id: res.lastId };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function updateRow(
  cfg: CrudConfig,
  id: number,
  data: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  const cols = cfg.fields.filter((f) => f.name in data).map((f) => f.name);
  if (!cols.length) return { ok: true };
  const values = cfg.fields.filter((f) => f.name in data).map((f) => coerce(data[f.name], f.type));
  const sql = `UPDATE ${cfg.table} SET ${cols.map((c) => `${c} = ?`).join(", ")}, updated_at = ? WHERE id = ?`;
  try {
    await run(sql, ...values, now(), id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function deleteRow(cfg: CrudConfig, id: number): Promise<void> {
  await run(`DELETE FROM ${cfg.table} WHERE id = ?`, id);
}
