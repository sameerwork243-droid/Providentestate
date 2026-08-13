# Deployment Guide — provident-next

Production build, hosting requirements, and operational notes.

## 1. What this app is

- **Next.js 16.3.0** (App Router, React 19, TypeScript, Turbopack).
- **Server-required throughout**: every page (`/[[...seg]]`, `/admin`, `/dashboard`,
  `/login`, `/register`) and all 35 API routes are dynamic server routes (`ƒ`).
  There is no static site: content is resolved per request from Postgres
  (`src/server/db.ts`) and the `data/raw/**` JSON corpus (`src/lib/store.ts`).
- **Database**: PostgreSQL via `pg` (`src/server/db.ts`). Schema is created and
  upgraded automatically on first query (`CREATE TABLE IF NOT EXISTS …`,
  `ALTER TABLE … ADD COLUMN IF NOT EXISTS …`). No migration tool required.
- **Auth**: db-backed session tokens (scrypt password hashing) in an httpOnly
  cookie `provident_session`. No external auth provider.
- **Uploads (admin media library)**: `@vercel/blob` (Vercel-only). See §5.

## 2. Hosting requirement (read before choosing a plan)

This is a Node.js server application. It **cannot run as static/PHP content**
on a conventional shared-hosting plan (cPanel, WordPress, PHP+MySQL only).

Your host must provide **Node.js ≥ 20.9** (tested on 24), long-running process
support (or a Node app runner / PM2), and **outbound TCP 5432** access to the
Postgres database.

| Capability | Required | Notes |
|---|---|---|
| Node.js ≥ 20.9 runtime | yes | `node --version` |
| `npm install` + build on host (or pre-built upload) | yes | ~250 MB with deps |
| Process manager (PM2 / systemd / Node app panel) | yes | `next start` must stay up |
| Outbound 5432 to your Postgres | yes | Firewalls often block this; verify |
| Postgres server | yes | Or use a hosted Postgres (see §4) |
| MySQL | no | The app does not use MySQL |
| PHP / WordPress | no | Irrelevant; do not convert |

If your plan cannot run Node processes, the alternatives are:

1. **Ask WP-Arena for a Node/VPS plan** — keeps 100 % of features (portal,
   admin, forms, auth).
2. **Pre-built bundle on Node hosting**: run `npm ci && npm run build` locally,
   upload the project, run `npm run start` (or `node server.js` built with
   `output: "standalone"` if you enable it in `next.config.ts`).

## 3. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `PROVIDENT_DATABASE_URL` | yes | Postgres connection string (`sslmode=require`) |
| `PROVIDENT_ADMIN_EMAIL` | first boot only | Initial admin email (empty-users seeding) |
| `PROVIDENT_ADMIN_PASSWORD` | first boot only | Initial admin password — **never use a default**; seeding fails in production without it |
| `PROVIDENT_PG_SSL` | no | `0` disables TLS (local Postgres only) |
| `BLOB_READ_WRITE_TOKEN` | no | Vercel Blob token for admin uploads (see §5) |

See `.env.example` (checked in, values not committed).

## 4. Database

- **Hosted Postgres is recommended** (e.g. Neon). The app is Neon-tested:
  pooled + direct hosts both work, `sslmode=require` is stripped internally and
  SSL handled explicitly, transient connection errors retry 3×.
- **Self-hosted Postgres**: must allow your app's IP; create a db + user, grant
  privileges, set `PROVIDENT_DATABASE_URL`.
- Seeding: on first boot with an empty DB the app inserts roles, categories,
  amenities, admin user (`PROVIDENT_ADMIN_EMAIL`/`PROVIDENT_ADMIN_PASSWORD`),
  and loads `data/raw/**` corpora (agents, jobs, projects, properties,
  developers, communities). A `properties_imported` marker prevents re-import.
  In development only an extra demo user is created.
- Note: `data/provident.db` (SQLite) is a dead artifact — not used by the app.

## 5. Gotchas by area

### Admin uploads (`/api/admin/upload`)
Uses `@vercel/blob`. On a non-Vercel host either:
- keep `BLOB_READ_WRITE_TOKEN` unset and accept upload failure, or
- replace the `put()` call in `src/app/api/admin/upload/route.ts` with a local
  disk write (files served from `public/` — note: writes to `public/` require
  the process to own the directory) or an S3-compatible bucket.

### Emails / notifications
The app stores inquiries, viewings and notifications in Postgres only — it
**sends no email or SMS**. The WordPress-era `contact_info` phone/WhatsApp
links are hardcoded in pages. If you need email alerts, add a provider
(nodemailer/SMTP, Resend…) and a notification hook in `/api/inquiries`.

### Domain/SSL
Set a CNAME/apex to your Node host (or use their Node subdomain). The login
cookie is `Secure` when `NODE_ENV=production`, so **serve over HTTPS** or
logins will drop the cookie.

## 6. Build & deploy (Node plan)

```bash
# on your machine (or the host, if it offers npm)
npm ci
npm run build        # verified: compiles, TS clean, 3728 static leaves generated

# run
npm run start        # production server on :3000 (PORT env to change)

# process manager (example, PM2)
pm2 start npm --name provident-next -- start
pm2 save && pm2 startup
```

Important:
- `data/` (107 MB JSON corpus) is read **at runtime** by `src/lib/store.ts` —
  do not exclude it from the deploy.
- Runtime logs: pool errors and seed progress go to stdout/stderr.
- Health check: `curl https://your-domain/list-your-property/` (200), then
  `curl https://your-domain/api/auth/me` (expect a JSON `{user:null}` style
  response — proves DB + cookies work without a login).

## 7. Verification checklist

- [ ] `node --version` ≥ 20.9 on the host
- [ ] `PROVIDENT_DATABASE_URL` set and reachable from the host (outbound 5432)
- [ ] `PROVIDENT_ADMIN_EMAIL` / `PROVIDENT_ADMIN_PASSWORD` set (production)
- [ ] HTTPS enabled (login cookie requires Secure)
- [ ] `/api/auth/me` returns JSON without error
- [ ] Login → dashboard → admin round-trip works (scrypt sessions)
- [ ] A public page resolves content from Postgres (e.g. a property detail page)
- [ ] Layout sanity at 320–1440 px on `/list-your-property/` (single-column
      mobile, two-column desktop, no horizontal scroll)

## 8. Rejected/considered paths

- **Static export** (`output: "export"`): rejected — every route is dynamic
  (server components, API routes, auth, Postgres). Export would disable the
  portal, admin panel, and all forms.
- **WordPress conversion**: rejected — out of scope; WP-Arena shared hosting
  is a platform mismatch for a Node server app, conversion is a full rewrite.
- **MySQL migration**: rejected — the app is written against Postgres
  (`pg`), including schema migrations, JSON columns and identity sequences.
  Hosted Postgres avoids the problem entirely.