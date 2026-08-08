"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PortalShell, type PortalNavSection, type PortalUser } from "@/components/portal/portal-shell";

type User = PortalUser;

type FieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "json";
type FieldDef = { key: string; label: string; type?: FieldType; options?: string[]; full?: boolean; hint?: string; required?: boolean };

export function AdminApp({ user }: { user: User }) {
  const [tab, setTab] = useState("overview");

  const sections: PortalNavSection[] = [
    {
      items: [{ key: "back", label: "Back to Website", icon: "launch", href: "/" }],
    },
    {
      label: "Main",
      items: [
        { key: "overview", label: "Dashboard", icon: "home" },
        { key: "properties", label: "Properties", icon: "building" },
        { key: "services", label: "Services", icon: "briefcase" },
      ],
    },
    {
      label: "CRM",
      items: [
        { key: "inquiries", label: "Inquiries", icon: "chat" },
        { key: "viewings", label: "Viewings", icon: "calendar" },
        { key: "users", label: "Users", icon: "users" },
        { key: "agents", label: "Agents", icon: "person" },
      ],
    },
    {
      label: "Directory",
      items: [
        { key: "developers", label: "Developers", icon: "building" },
        { key: "communities", label: "Areas", icon: "map" },
        { key: "categories", label: "Categories", icon: "tag" },
      ],
    },
    {
      label: "Content",
      items: [
        { key: "testimonials", label: "Testimonials", icon: "star" },
        { key: "faqs", label: "FAQs", icon: "question" },
        { key: "media", label: "Blogs", icon: "image" },
        { key: "contact", label: "Contact Info", icon: "phone" },
        { key: "homepage", label: "Homepage Content", icon: "grid" },
      ],
    },
  ];

  return (
    <PortalShell user={user} title="Admin Panel" sections={sections} active={tab} onNav={setTab}>
      {tab === "overview" && <StatsOverview />}
      {tab === "properties" && <PropertiesManager />}
      {tab === "services" && <ResourceManager endpoint="services" title="Services" fields={SERVICE_FIELDS} columns={serviceColumns} />}
      {tab === "users" && <UsersManager />}
      {tab === "inquiries" && <InquiriesManager />}
      {tab === "viewings" && <ViewingsManager />}
      {tab === "agents" && <ResourceManager endpoint="agents" title="Agents" fields={AGENT_FIELDS} columns={agentColumns} />}
      {tab === "developers" && <ResourceManager endpoint="developers" title="Developers" fields={DEVELOPER_FIELDS} columns={developerColumns} />}
      {tab === "communities" && <ResourceManager endpoint="communities" title="Communities" fields={COMMUNITY_FIELDS} columns={communityColumns} />}
      {tab === "categories" && <CategoriesManager />}
      {tab === "testimonials" && <ResourceManager endpoint="testimonials" title="Testimonials" fields={TESTIMONIAL_FIELDS} columns={testimonialColumns} />}
      {tab === "faqs" && <ResourceManager endpoint="faqs" title="FAQs" fields={FAQ_FIELDS} columns={faqColumns} />}
      {tab === "media" && <ResourceManager endpoint="media" title="Media Library" fields={MEDIA_FIELDS} columns={mediaColumns} />}
      {tab === "contact" && <KVManager endpoint="contact" title="Contact Information" defaults={CONTACT_KEYS} />}
      {tab === "homepage" && <KVManager endpoint="homepage" title="Homepage Content" defaults={HOMEPAGE_KEYS} />}
    </PortalShell>
  );
}

/* ===================== Overview ===================== */

function StatsOverview() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);
  if (!data) return <div className="app-card"><p className="app-empty">Loading…</p></div>;
  const s = data.stats;
  return (
    <>
      <div className="app-stats">
        <div className="app-stat"><div className="label">Properties</div><div className="value">{s.properties}</div><div className="sub">{s.publishedProperties} published</div></div>
        <div className="app-stat"><div className="label">Users</div><div className="value">{s.users}</div></div>
        <div className="app-stat"><div className="label">Inquiries</div><div className="value">{s.inquiries}</div><div className="sub">{s.newInquiries} new</div></div>
        <div className="app-stat"><div className="label">Viewings</div><div className="value">{s.viewings}</div><div className="sub">{s.pendingViewings} pending</div></div>
      </div>
      <div className="app-card">
        <div className="app-card-head"><div><h2>Directory</h2></div></div>
        <div className="app-stats">
          <div className="app-stat"><div className="label">Services</div><div className="value">{s.services}</div></div>
          <div className="app-stat"><div className="label">Agents</div><div className="value">{s.agents}</div></div>
          <div className="app-stat"><div className="label">Developers</div><div className="value">{s.developers}</div></div>
          <div className="app-stat"><div className="label">Communities</div><div className="value">{s.communities}</div></div>
          <div className="app-stat"><div className="label">Testimonials</div><div className="value">{s.testimonials}</div></div>
          <div className="app-stat"><div className="label">FAQs</div><div className="value">{s.faqs}</div></div>
          <div className="app-stat"><div className="label">Media items</div><div className="value">{s.media}</div></div>
          <div className="app-stat"><div className="label">Saved properties</div><div className="value">{s.savedProperties}</div></div>
        </div>
      </div>
      {data.recentInquiries.length > 0 && (
        <div className="app-card">
          <div className="app-card-head"><div><h2>Recent inquiries</h2></div></div>
          <table className="app-table">
            <thead><tr><th>Name</th><th>Kind</th><th>Message</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {data.recentInquiries.map((i: any) => (
                <tr key={i.id}>
                  <td><strong>{i.name}</strong><div style={{ fontSize: 12, color: "#9399a4" }}>{i.email}</div></td>
                  <td>{i.kind}</td>
                  <td>{(i.message || "").slice(0, 60)}</td>
                  <td><span className={"app-badge " + i.status}>{i.status}</span></td>
                  <td>{fmtDate(i.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ===================== Generic resource manager ===================== */

type Column = { key: string; label: string; render: (row: any) => React.ReactNode };

function ResourceManager({ endpoint, title, fields, columns }: { endpoint: string; title: string; fields: FieldDef[]; columns: Column[] }) {
  const [items, setItems] = useState<any[] | null>(null);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    (query = "") => {
      fetch(`/api/admin/${endpoint}?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => setItems(d.items || []))
        .catch(() => setItems([]));
    },
    [endpoint]
  );
  useEffect(() => load(), [load]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  async function save(form: Record<string, any>) {
    setBusy(true);
    const body = coerceJsonFields(form, fields);
    const res = editing
      ? await fetch(`/api/admin/${endpoint}/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch(`/api/admin/${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(d.error || "Save failed");
      setBusy(false);
      return;
    }
    showToast(editing ? "Saved" : "Created");
    setEditing(null);
    setCreating(false);
    setBusy(false);
    load(q);
  }

  async function remove(row: any) {
    if (!confirm(`Delete "${row.title || row.name || row.author || row.question || row.url || row.id}"?`)) return;
    await fetch(`/api/admin/${endpoint}/${row.id}`, { method: "DELETE" });
    showToast("Deleted");
    load(q);
  }

  return (
    <>
      <div className="app-card">
        <div className="app-card-head">
          <div>
            <h2>{title}</h2>
            <p className="app-card-sub">{items?.length ?? 0} records</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input className="app-search" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load(q)} />
            <button type="button" className="app-btn" onClick={() => setCreating(true)}>+ Add</button>
          </div>
        </div>
        {items === null ? (
          <p className="app-empty">Loading…</p>
        ) : items.length === 0 ? (
          <p className="app-empty">No records found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="app-table">
              <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th></th></tr></thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    {columns.map((c) => <td key={c.key}>{c.render(row)}</td>)}
                    <td>
                      <div className="row-actions">
                        <button type="button" className="app-btn ghost sm" onClick={() => { setEditing(row); }}>Edit</button>
                        <button type="button" className="app-btn danger sm" onClick={() => remove(row)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {(creating || editing) && (
        <FormModal
          title={editing ? `Edit ${title.slice(0, -1)}` : `New ${title.slice(0, -1)}`}
          fields={fields}
          initial={editing || {}}
          busy={busy}
          onCancel={() => { setCreating(false); setEditing(null); }}
          onSave={save}
        />
      )}
      {toast && <div className="app-toast">{toast}</div>}
    </>
  );
}

function FormModal({ title, fields, initial, busy, onCancel, onSave }: {
  title: string;
  fields: FieldDef[];
  initial: Record<string, any>;
  busy: boolean;
  onCancel: () => void;
  onSave: (form: Record<string, any>) => void;
}) {
  const [form, setForm] = useState<Record<string, any>>(() => {
    const f: Record<string, any> = {};
    for (const fd of fields) {
      f[fd.key] = fd.type === "checkbox" ? Boolean(Number(initial[fd.key])) : initial[fd.key] ?? "";
    }
    return f;
  });
  function set(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  return (
    <div className="app-modal-backdrop" onClick={onCancel}>
      <div className="app-modal wide" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <form
          className="app-form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
        >
          {fields.map((fd) => (
            <div className={"app-field" + (fd.full ? " full" : "")} key={fd.key}>
              <label>{fd.label}</label>
              {fd.type === "textarea" ? (
                <textarea value={form[fd.key] || ""} onChange={(e) => set(fd.key, e.target.value)} />
              ) : fd.type === "number" ? (
                <input type="number" value={form[fd.key] ?? ""} onChange={(e) => set(fd.key, e.target.value)} />
              ) : fd.type === "select" ? (
                <select value={form[fd.key] || ""} onChange={(e) => set(fd.key, e.target.value)}>
                  <option value="">—</option>
                  {(fd.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : fd.type === "checkbox" ? (
                <div className="app-check-row">
                  <input type="checkbox" checked={Boolean(form[fd.key])} onChange={(e) => set(fd.key, e.target.checked ? 1 : 0)} />
                  <span style={{ fontSize: 13 }}>{fd.hint || "Enabled"}</span>
                </div>
              ) : fd.type === "json" ? (
                <input
                  type="text"
                  placeholder="Comma separated values"
                  value={Array.isArray(form[fd.key]) ? form[fd.key].join(", ") : (form[fd.key] || "")}
                  onChange={(e) => set(fd.key, e.target.value)}
                />
              ) : (
                <input type="text" value={form[fd.key] || ""} onChange={(e) => set(fd.key, e.target.value)} />
              )}
              {fd.hint && fd.type !== "checkbox" && <div className="hint">{fd.hint}</div>}
            </div>
          ))}
          <div className="modal-actions full">
            <button type="button" className="app-btn ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="app-btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===================== Properties ===================== */

const PROPERTY_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", required: true, full: true, hint: "e.g. 2 Bedroom Apartment in Dubai Marina" },
  { key: "slug", label: "Slug (optional — auto-generated from title)", full: true },
  { key: "transaction_type", label: "Transaction", type: "select", options: ["buy", "rent"] },
  { key: "property_type", label: "Property type", type: "select", options: ["apartment", "villa", "townhouse", "penthouse", "studio", "duplex", "mansion", "commercial-property", "plot"] },
  { key: "category", label: "Category", type: "select", options: ["apartments", "villas", "townhouses", "penthouses", "studios", "duplexes", "mansions", "commercial-properties", "plots"] },
  { key: "status", label: "Status", type: "select", options: ["ready", "off-plan", "under-construction"] },
  { key: "price", label: "Price (AED)", type: "number" },
  { key: "price_qualifier", label: "Price qualifier", type: "select", options: ["AED", "AED / yearly"] },
  { key: "community", label: "Community", full: true },
  { key: "developer", label: "Developer", full: true },
  { key: "location", label: "Location", full: true },
  { key: "display_address", label: "Display address", full: true },
  { key: "latitude", label: "Latitude", type: "number" },
  { key: "longitude", label: "Longitude", type: "number" },
  { key: "bedroom", label: "Bedrooms", type: "number" },
  { key: "bathroom", label: "Bathrooms", type: "number" },
  { key: "area_sqft", label: "Area (sq ft)", type: "number" },
  { key: "plot_size", label: "Plot size", type: "number" },
  { key: "parking", label: "Parking spots", type: "number" },
  { key: "furnished", label: "Furnishing", type: "select", options: ["Furnished", "Unfurnished", "Partially Furnished"] },
  { key: "completion_status", label: "Completion", type: "select", options: ["Ready", "Off-Plan", "Under Construction"] },
  { key: "year_built", label: "Year built", type: "number" },
  { key: "featured", label: "Featured", type: "checkbox", hint: "Show in featured sliders" },
  { key: "published", label: "Published", type: "checkbox", hint: "Visible on the public site" },
  { key: "introtext", label: "Short intro", type: "textarea", full: true },
  { key: "long_description", label: "Full description (HTML allowed)", type: "textarea", full: true },
];

const SERVICE_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", required: true, full: true },
  { key: "slug", label: "Slug", required: true, full: true },
  { key: "icon", label: "Icon URL", full: true },
  { key: "banner_image", label: "Banner image URL", full: true },
  { key: "description", label: "Description", type: "textarea", full: true },
  { key: "rich_content", label: "Rich content (HTML)", type: "textarea", full: true },
  { key: "gallery", label: "Gallery URLs", type: "json", full: true },
  { key: "seo_title", label: "SEO title", full: true },
  { key: "seo_description", label: "SEO description", full: true },
  { key: "published", label: "Published", type: "checkbox", hint: "Visible on the public site" },
];

const AGENT_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", required: true, full: true },
  { key: "slug", label: "Slug", required: true, full: true },
  { key: "role", label: "Role" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email", full: true },
  { key: "brn_number", label: "BRN number" },
  { key: "img", label: "Profile image URL", full: true },
  { key: "languages", label: "Languages", type: "json", full: true },
  { key: "specialties", label: "Specialties", type: "json", full: true },
  { key: "bio", label: "Bio", type: "textarea", full: true },
  { key: "published", label: "Published", type: "checkbox", hint: "Visible on the team page" },
];

const DEVELOPER_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", required: true, full: true },
  { key: "slug", label: "Slug", required: true, full: true },
  { key: "region", label: "Region" },
  { key: "founded", label: "Founded", type: "number" },
  { key: "deliveries", label: "Deliveries", type: "number" },
  { key: "img", label: "Logo URL", full: true },
  { key: "description", label: "Description", type: "textarea", full: true },
  { key: "published", label: "Published", type: "checkbox", hint: "Visible on the public site" },
];

const COMMUNITY_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", required: true, full: true },
  { key: "slug", label: "Slug", required: true, full: true },
  { key: "region", label: "Region", full: true },
  { key: "published", label: "Published", type: "checkbox", hint: "Visible on the public site" },
];

const TESTIMONIAL_FIELDS: FieldDef[] = [
  { key: "author", label: "Author", required: true, full: true },
  { key: "role", label: "Role", full: true },
  { key: "content", label: "Content", type: "textarea", full: true },
  { key: "rating", label: "Rating (1–5)", type: "number" },
  { key: "img", label: "Photo URL", full: true },
  { key: "published", label: "Published", type: "checkbox", hint: "Visible on the public site" },
];

const FAQ_FIELDS: FieldDef[] = [
  { key: "question", label: "Question", required: true, full: true },
  { key: "answer", label: "Answer", type: "textarea", full: true },
  { key: "category", label: "Category" },
  { key: "sort", label: "Sort order", type: "number" },
  { key: "published", label: "Published", type: "checkbox", hint: "Visible on the public site" },
];

const MEDIA_FIELDS: FieldDef[] = [
  { key: "url", label: "URL", required: true, full: true },
  { key: "kind", label: "Kind", type: "select", options: ["image", "video", "floorplan", "brochure"] },
  { key: "alt", label: "Alt text", full: true },
];

const CONTACT_KEYS = ["phone", "email", "whatsapp", "address", "office_hours"];
const HOMEPAGE_KEYS = ["hero_title", "hero_subtitle", "announcement_bar", "stats_heading", "featured_heading"];

function coerceJsonFields(form: Record<string, any>, fields: FieldDef[]): Record<string, any> {
  const out: Record<string, any> = {};
  for (const fd of fields) {
    let v = form[fd.key];
    if (fd.type === "json" && typeof v === "string") {
      v = v.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (fd.type === "number" && v === "") v = 0;
    out[fd.key] = v;
  }
  return out;
}

/* ===== Properties manager (custom) ===== */

function PropertiesManager() {
  const [items, setItems] = useState<any[] | null>(null);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback((query = "") => {
    fetch(`/api/admin/properties?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  useEffect(() => load(), [load]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  async function remove(row: any) {
    if (!confirm(`Delete "${row.title}"?`)) return;
    await fetch(`/api/admin/properties?id=${row.id}`, { method: "DELETE" });
    showToast("Deleted");
    load(q);
  }

  function openEdit(row: any) {
    fetch(`/api/admin/properties/${row.id}`)
      .then((r) => r.json())
      .then((d) => setEditing(d.item || null))
      .catch(() => showToast("Could not load property"));
  }

  return (
    <>
      <div className="app-card">
        <div className="app-card-head">
          <div>
            <h2>Properties</h2>
            <p className="app-card-sub">{items?.length ?? 0} records — created properties appear on the public site</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input className="app-search" placeholder="Search title, slug, developer…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load(q)} />
            <button type="button" className="app-btn" onClick={() => setCreating(true)}>+ New property</button>
          </div>
        </div>
        {items === null ? (
          <p className="app-empty">Loading…</p>
        ) : items.length === 0 ? (
          <p className="app-empty">No properties yet. Create your first one.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="app-table">
              <thead>
                <tr><th>Title</th><th>Type</th><th>Price</th><th>Beds</th><th>Media</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.title}</strong>
                      <div style={{ fontSize: 12, color: "#9399a4" }}>/{row.transaction_type}/{row.slug}{row.id}/</div>
                    </td>
                    <td>{row.property_type}</td>
                    <td>{"AED " + Number(row.price).toLocaleString()}</td>
                    <td>{row.bedroom} bd / {row.bathroom} ba</td>
                    <td>{row.image_count} img · {row.amenity_count} am.</td>
                    <td>
                      <span className={"app-badge " + (Number(row.published) ? "active" : "inactive")}>
                        {Number(row.published) ? "published" : "draft"}
                      </span>
                      {Number(row.featured) === 1 && <span className="app-badge" style={{ background: "#fff3e0", color: "#b26a00", marginLeft: 4 }}>featured</span>}
                    </td>
                    <td>
                      <div className="row-actions">
                        <a className="app-btn ghost sm" href={`/${row.transaction_type}/${row.slug}${row.id}/`} target="_blank">View</a>
                        <button type="button" className="app-btn ghost sm" onClick={() => openEdit(row)}>Edit</button>
                        <button type="button" className="app-btn danger sm" onClick={() => remove(row)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {(creating || editing) && (
        <PropertyForm
          key={editing?.id ?? "new"}
          initial={editing}
          busy={busy}
          onCancel={() => { setCreating(false); setEditing(null); }}
          onDone={(msg) => { showToast(msg); setCreating(false); setEditing(null); load(q); }}
          setBusy={setBusy}
        />
      )}
      {toast && <div className="app-toast">{toast}</div>}
    </>
  );
}

function PropertyForm({ initial, busy, setBusy, onCancel, onDone }: {
  initial: any | null;
  busy: boolean;
  setBusy: (b: boolean) => void;
  onCancel: () => void;
  onDone: (msg: string) => void;
}) {
  const [form, setForm] = useState<Record<string, any>>(() => {
    const f: Record<string, any> = {};
    for (const fd of PROPERTY_FIELDS) {
      f[fd.key] = fd.type === "checkbox" ? Boolean(Number(initial?.[fd.key])) : (initial?.[fd.key] ?? "");
    }
    return f;
  });
  const [media, setMedia] = useState<{ kind: string; url: string }[]>(
    (initial?.media || []).map((m: any) => ({ kind: m.kind || "image", url: m.url || "" }))
  );
  const [amenityList, setAmenityList] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initial?.amenities || []);
  const [newAmenity, setNewAmenity] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/amenities")
      .then((r) => r.json())
      .then((d) => setAmenityList((d.items || []).map((a: any) => String(a.name))))
      .catch(() => setAmenityList([]));
  }, []);

  function set(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function toggleAmenity(name: string) {
    setSelectedAmenities((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));
  }
  async function addAmenity() {
    const name = newAmenity.trim();
    if (!name || amenityList.includes(name)) return;
    await fetch("/api/admin/amenities", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    setAmenityList((l) => [...l, name]);
    setSelectedAmenities((s) => [...s, name]);
    setNewAmenity("");
  }

  function pickFile(index: number) {
    setUploadTarget(index);
    fileRef.current?.click();
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || uploadTarget == null) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(d.error || "Upload failed");
        return;
      }
      setMedia((ms) =>
        ms.map((m, j) => (j === uploadTarget ? { ...m, url: String(d.url || "") } : m))
      );
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
      setUploadTarget(null);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const body = {
      ...coerceJsonFields(form, PROPERTY_FIELDS),
      amenities: selectedAmenities,
      media: media.filter((m) => m.url.trim()),
    };
    try {
      const res = initial
        ? await fetch(`/api/admin/properties?id=${initial.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch("/api/admin/properties", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(d.error || "Save failed");
        return;
      }
      onDone(initial ? "Property saved" : "Property created");
    } catch {
      alert("Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-modal-backdrop" onClick={onCancel}>
      <div className="app-modal wide" onClick={(e) => e.stopPropagation()}>
        <h3>{initial ? "Edit property" : "New property"}</h3>
        <form className="app-form-grid" onSubmit={submit}>
          <div className="full" style={{ borderBottom: "1px solid #f0f3f8", paddingBottom: 12 }}>
            <strong style={{ color: "#142121", fontSize: 14 }}>General information</strong>
          </div>
          {PROPERTY_FIELDS.map((fd) => (
            <div className={"app-field" + (fd.full ? " full" : "")} key={fd.key}>
              <label>{fd.label}</label>
              {fd.type === "textarea" ? (
                <textarea value={form[fd.key] || ""} onChange={(e) => set(fd.key, e.target.value)} />
              ) : fd.type === "number" ? (
                <input type="number" value={form[fd.key] ?? ""} onChange={(e) => set(fd.key, e.target.value)} />
              ) : fd.type === "select" ? (
                <select value={form[fd.key] || ""} onChange={(e) => set(fd.key, e.target.value)}>
                  <option value="">—</option>
                  {(fd.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : fd.type === "checkbox" ? (
                <div className="app-check-row">
                  <input type="checkbox" checked={Boolean(form[fd.key])} onChange={(e) => set(fd.key, e.target.checked ? 1 : 0)} />
                  <span style={{ fontSize: 13 }}>{fd.hint || "Enabled"}</span>
                </div>
              ) : (
                <input type="text" value={form[fd.key] || ""} onChange={(e) => set(fd.key, e.target.value)} />
              )}
              {fd.hint && fd.type !== "checkbox" && <div className="hint">{fd.hint}</div>}
            </div>
          ))}

          <div className="full" style={{ borderBottom: "1px solid #f0f3f8", paddingBottom: 12 }}>
            <strong style={{ color: "#142121", fontSize: 14 }}>Media</strong>
          </div>
          {media.map((m, i) => (
            <div className="full" style={{ display: "flex", gap: 10 }} key={i}>
              <select
                style={{ flex: "0 0 130px", border: "1px solid #e1e8ed", borderRadius: 6, padding: "8px" }}
                value={m.kind}
                onChange={(e) => setMedia(media.map((x, j) => (j === i ? { ...x, kind: e.target.value } : x)))}
              >
                {["image", "video", "floorplan", "brochure"].map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
              <input
                type="text"
                style={{ flex: 1, border: "1px solid #e1e8ed", borderRadius: 6, padding: "8px" }}
                placeholder="https://… image or video URL"
                value={m.url}
                onChange={(e) => setMedia(media.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
              />
              <button
                type="button"
                className="app-btn ghost sm"
                style={{ flex: "0 0 auto" }}
                disabled={uploading}
                onClick={() => pickFile(i)}
              >
                {uploading && uploadTarget === i ? "Uploading…" : "Upload from device"}
              </button>
              <button type="button" className="app-btn danger sm" onClick={() => setMedia(media.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          <div className="full" style={{ display: "flex", gap: 8 }}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={uploadFile}
            />
            <button type="button" className="app-btn ghost sm" onClick={() => setMedia([...media, { kind: "image", url: "" }])}>
              + Add image / video
            </button>
            <button
              type="button"
              className="app-btn sm"
              disabled={uploading}
              onClick={() => { setMedia((ms) => [...ms, { kind: "image", url: "" }]); pickFile(media.length); }}
            >
              {uploading ? "Uploading…" : "+ Upload image from device"}
            </button>
          </div>

          <div className="full" style={{ borderBottom: "1px solid #f0f3f8", paddingBottom: 12 }}>
            <strong style={{ color: "#142121", fontSize: 14 }}>Amenities</strong>
          </div>
          <div className="full">
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="app-search"
                style={{ flex: 1 }}
                placeholder="Add a new amenity (e.g. Smart Home)"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
              />
              <button type="button" className="app-btn ghost sm" onClick={addAmenity}>Add</button>
            </div>
            <div className="app-chip-list">
              {amenityList.map((a) => (
                <button type="button" key={a} className={"app-chip" + (selectedAmenities.includes(a) ? " active" : "")} onClick={() => toggleAmenity(a)}>
                  {a}
                </button>
              ))}
            </div>
            {selectedAmenities.length > 0 && (
              <div className="hint">{selectedAmenities.length} amenity(ies) selected</div>
            )}
          </div>

          <div className="modal-actions full">
            <button type="button" className="app-btn ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="app-btn" disabled={busy}>{busy ? "Saving…" : "Save property"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===================== Users ===================== */

function UsersManager() {
  const [items, setItems] = useState<any[] | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  useEffect(load, [load]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  async function save(form: any, id?: number) {
    setBusy(true);
    const body: Record<string, any> = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      is_active: form.is_active ? 1 : 0,
    };
    if (form.password) body.password = form.password;
    const res = id
      ? await fetch(`/api/admin/users/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      showToast(d.error || "Save failed");
      return;
    }
    showToast(id ? "User updated" : "User created");
    setCreating(false);
    setEditing(null);
    load();
  }

  async function toggleActive(row: any) {
    await fetch(`/api/admin/users/${row.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: Number(row.is_active) ? 0 : 1 }) });
    load();
  }

  return (
    <>
      <div className="app-card">
        <div className="app-card-head">
          <div>
            <h2>Users</h2>
            <p className="app-card-sub">{items?.length ?? 0} accounts</p>
          </div>
          <button type="button" className="app-btn" onClick={() => setCreating(true)}>+ Add user</button>
        </div>
        {items === null ? (
          <p className="app-empty">Loading…</p>
        ) : items.length === 0 ? (
          <p className="app-empty">No users.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="app-table">
              <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Last login</th><th></th></tr></thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    <td><strong>{row.name}</strong><div style={{ fontSize: 12, color: "#9399a4" }}>{row.email}{row.phone ? " · " + row.phone : ""}</div></td>
                    <td><span className="app-badge" style={{ background: row.role === "admin" ? "#e3f2fd" : "#f0f3f8", color: "#075985" }}>{row.role}</span></td>
                    <td><span className={"app-badge " + (Number(row.is_active) ? "active" : "inactive")}>{Number(row.is_active) ? "active" : "disabled"}</span></td>
                    <td>{row.last_login_at ? fmtDate(row.last_login_at) : "—"}</td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="app-btn ghost sm" onClick={() => setEditing(row)}>Edit</button>
                        <button type="button" className="app-btn ghost sm" onClick={() => toggleActive(row)}>{Number(row.is_active) ? "Disable" : "Enable"}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {(creating || editing) && (
        <UserModal
          user={editing}
          busy={busy}
          onCancel={() => { setCreating(false); setEditing(null); }}
          onSave={(f) => save(f, editing?.id)}
        />
      )}
      {toast && <div className="app-toast">{toast}</div>}
    </>
  );
}

function UserModal({ user, busy, onCancel, onSave }: { user: any | null; busy: boolean; onCancel: () => void; onSave: (f: any) => void }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "user",
    is_active: user ? Boolean(Number(user.is_active)) : true,
    password: "",
  });
  return (
    <div className="app-modal-backdrop" onClick={onCancel}>
      <div className="app-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{user ? "Edit user" : "Add user"}</h3>
        <form className="app-form-grid" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
          <div className="app-field"><label>Full name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="app-field"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div className="app-field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="app-field">
            <label>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="user">user</option>
              <option value="agent">agent</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="app-field full">
            <label>{user ? "New password (leave blank to keep)" : "Password"}</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={user ? "" : "Min 8 chars, letters + numbers"} required={!user} />
          </div>
          <div className="app-field full">
            <div className="app-check-row">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              <span style={{ fontSize: 13 }}>Account active</span>
            </div>
          </div>
          <div className="modal-actions full">
            <button type="button" className="app-btn ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="app-btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===================== Inquiries & Viewings ===================== */

function InquiriesManager() {
  const [items, setItems] = useState<any[] | null>(null);
  const [toast, setToast] = useState("");
  const load = useCallback(() => {
    fetch("/api/admin/inquiries")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  useEffect(load, [load]);
  async function setStatus(row: any, status: string) {
    await fetch("/api/admin/inquiries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id, status }) });
    setToast(`Inquiry marked "${status}"`);
    setTimeout(() => setToast(""), 2000);
    load();
  }
  async function remove(row: any) {
    if (!confirm("Delete this inquiry?")) return;
    await fetch("/api/admin/inquiries", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id }) });
    load();
  }
  return (
    <div className="app-card">
      <div className="app-card-head"><div><h2>Inquiries</h2><p className="app-card-sub">{items?.length ?? 0} messages</p></div></div>
      {items === null ? (
        <p className="app-empty">Loading…</p>
      ) : items.length === 0 ? (
        <p className="app-empty">No inquiries yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="app-table">
            <thead><tr><th>Contact</th><th>Kind / property</th><th>Message</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.name}</strong><div style={{ fontSize: 12, color: "#9399a4" }}>{row.email}{row.phone ? " · " + row.phone : ""}</div></td>
                  <td>{row.kind}<div style={{ fontSize: 12, color: "#9399a4" }}>{row.property_slug || row.property_ref || ""}</div></td>
                  <td style={{ maxWidth: 320 }}>{row.message}</td>
                  <td>
                    <select
                      style={{ border: "1px solid #e1e8ed", borderRadius: 6, fontSize: 12, padding: "5px 8px" }}
                      value={row.status}
                      onChange={(e) => setStatus(row, e.target.value)}
                    >
                      {["new", "contacted", "closed"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{fmtDate(row.created_at)}</td>
                  <td><button type="button" className="app-btn danger sm" onClick={() => remove(row)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {toast && <div className="app-toast">{toast}</div>}
    </div>
  );
}

function ViewingsManager() {
  const [items, setItems] = useState<any[] | null>(null);
  const [toast, setToast] = useState("");
  const load = useCallback(() => {
    fetch("/api/admin/viewings")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  useEffect(load, [load]);
  async function setStatus(row: any, status: string) {
    await fetch("/api/admin/viewings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id, status }) });
    setToast(`Viewing marked "${status}"`);
    setTimeout(() => setToast(""), 2000);
    load();
  }
  async function remove(row: any) {
    if (!confirm("Delete this viewing?")) return;
    await fetch("/api/admin/viewings", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: row.id }) });
    load();
  }
  return (
    <div className="app-card">
      <div className="app-card-head"><div><h2>Viewings</h2><p className="app-card-sub">{items?.length ?? 0} requests</p></div></div>
      {items === null ? (
        <p className="app-empty">Loading…</p>
      ) : items.length === 0 ? (
        <p className="app-empty">No viewing requests yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="app-table">
            <thead><tr><th>Customer</th><th>Property</th><th>Date / time</th><th>Notes</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.user_name || row.user_email || "Guest"}</strong></td>
                  <td>{row.property_slug || row.property_ref || "General"}</td>
                  <td>{row.preferred_date}<div style={{ fontSize: 12, color: "#9399a4" }}>{row.time_slot}</div></td>
                  <td style={{ maxWidth: 240 }}>{row.notes}</td>
                  <td>
                    <select
                      style={{ border: "1px solid #e1e8ed", borderRadius: 6, fontSize: 12, padding: "5px 8px" }}
                      value={row.status}
                      onChange={(e) => setStatus(row, e.target.value)}
                    >
                      {["requested", "confirmed", "completed", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><button type="button" className="app-btn danger sm" onClick={() => remove(row)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {toast && <div className="app-toast">{toast}</div>}
    </div>
  );
}

/* ===================== Categories & KV ===================== */

function CategoriesManager() {
  const [items, setItems] = useState<any[] | null>(null);
  const [toast, setToast] = useState("");
  const load = useCallback(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  useEffect(load, [load]);
  async function save(row: any) {
    const name = prompt("Category name", row?.name || "");
    if (!name) return;
    const body = { name, slug: row?.slug || "", type: row?.type || "", sort: row?.sort || 0 };
    await fetch("/api/admin/categories" + (row?.id ? `?id=${row.id}` : ""), {
      method: row?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setToast(row?.id ? "Updated" : "Created");
    setTimeout(() => setToast(""), 2000);
    load();
  }
  async function remove(row: any) {
    if (!confirm(`Delete category "${row.name}"?`)) return;
    await fetch(`/api/admin/categories?id=${row.id}`, { method: "DELETE" });
    load();
  }
  return (
    <div className="app-card">
      <div className="app-card-head">
        <div><h2>Categories</h2><p className="app-card-sub">{items?.length ?? 0} entries</p></div>
        <button type="button" className="app-btn" onClick={() => save(null)}>+ Add</button>
      </div>
      {items === null ? (
        <p className="app-empty">Loading…</p>
      ) : items.length === 0 ? (
        <p className="app-empty">No categories.</p>
      ) : (
        <table className="app-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Type</th><th>Sort</th><th></th></tr></thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td><strong>{row.name}</strong></td>
                <td>{row.slug}</td>
                <td>{row.type}</td>
                <td>{row.sort}</td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="app-btn ghost sm" onClick={() => save(row)}>Edit</button>
                    <button type="button" className="app-btn danger sm" onClick={() => remove(row)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {toast && <div className="app-toast">{toast}</div>}
    </div>
  );
}

function KVManager({ endpoint, title, defaults }: { endpoint: string; title: string; defaults: string[] }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch(`/api/admin/${endpoint}`)
      .then((r) => r.json())
      .then((d) => {
        const v: Record<string, string> = {};
        for (const k of defaults) v[k] = "";
        for (const it of d.items || []) v[String(it.key)] = String(it.value || "");
        setValues(v);
      })
      .catch(() => {
        const v: Record<string, string> = {};
        for (const k of defaults) v[k] = "";
        setValues(v);
      });
  }, [endpoint, defaults]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch(`/api/admin/${endpoint}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: Object.entries(values).map(([key, value]) => ({ key, value })) }) });
    setBusy(false);
    if (res.ok) {
      setToast("Saved");
      setTimeout(() => setToast(""), 2000);
    }
  }
  return (
    <div className="app-card">
      <div className="app-card-head"><div><h2>{title}</h2><p className="app-card-sub">Saved to the database for future use.</p></div></div>
      <form className="app-form-grid" onSubmit={save}>
        {Object.entries(values).map(([key, value]) => (
          <div className="app-field" key={key}>
            <label>{key.replace(/_/g, " ")}</label>
            <input value={value} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />
          </div>
        ))}
        <div className="full">
          <button type="submit" className="app-btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
        </div>
      </form>
      {toast && <div className="app-toast">{toast}</div>}
    </div>
  );
}

/* ===================== Column renderers ===================== */

function Bool({ value }: { value: any }) {
  return <span className={"app-badge " + (Number(value) ? "active" : "inactive")}>{Number(value) ? "yes" : "no"}</span>;
}

const serviceColumns: Column[] = [
  { key: "title", label: "Service", render: (r) => <strong>{r.title}</strong> },
  { key: "slug", label: "Slug", render: (r) => <span style={{ color: "#9399a4" }}>{r.slug}</span> },
  { key: "published", label: "Published", render: (r) => <Bool value={r.published} /> },
];

const agentColumns: Column[] = [
  { key: "name", label: "Agent", render: (r) => <strong>{r.name}</strong> },
  { key: "role", label: "Role", render: (r) => r.role },
  { key: "email", label: "Email", render: (r) => <span style={{ fontSize: 12 }}>{r.email}</span> },
  { key: "published", label: "Published", render: (r) => <Bool value={r.published} /> },
];

const developerColumns: Column[] = [
  { key: "name", label: "Developer", render: (r) => <strong>{r.name}</strong> },
  { key: "region", label: "Region", render: (r) => r.region },
  { key: "founded", label: "Founded", render: (r) => r.founded || "—" },
  { key: "published", label: "Published", render: (r) => <Bool value={r.published} /> },
];

const communityColumns: Column[] = [
  { key: "name", label: "Community", render: (r) => <strong>{r.name}</strong> },
  { key: "region", label: "Region", render: (r) => r.region },
  { key: "published", label: "Published", render: (r) => <Bool value={r.published} /> },
];

const testimonialColumns: Column[] = [
  { key: "author", label: "Author", render: (r) => <strong>{r.author}</strong> },
  { key: "role", label: "Role", render: (r) => r.role },
  { key: "rating", label: "Rating", render: (r) => "★".repeat(Math.min(5, Number(r.rating) || 0)) },
  { key: "published", label: "Published", render: (r) => <Bool value={r.published} /> },
];

const faqColumns: Column[] = [
  { key: "question", label: "Question", render: (r) => <strong>{r.question}</strong> },
  { key: "category", label: "Category", render: (r) => r.category },
  { key: "sort", label: "Sort", render: (r) => r.sort },
  { key: "published", label: "Published", render: (r) => <Bool value={r.published} /> },
];

const mediaColumns: Column[] = [
  { key: "url", label: "URL", render: (r) => <span style={{ wordBreak: "break-all" }}>{r.url}</span> },
  { key: "kind", label: "Kind", render: (r) => <span className="app-badge" style={{ background: "#f0f3f8" }}>{r.kind}</span> },
  { key: "alt", label: "Alt", render: (r) => r.alt || "—" },
];

function fmtDate(s: string): string {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
