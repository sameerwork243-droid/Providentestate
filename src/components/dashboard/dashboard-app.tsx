"use client";

import { useCallback, useEffect, useState } from "react";
import { PortalShell, PortalIcon, type PortalNavSection, type PortalUser } from "@/components/portal/portal-shell";
import { COUNTRIES } from "@/components/phone-flag";

type User = PortalUser;

export function DashboardApp({ user }: { user: User }) {
  const [tab, setTab] = useState("overview");

  const sections: PortalNavSection[] = [
    {
      items: [{ key: "back", label: "Back to Website", icon: "launch", href: "/" }],
    },
    {
      label: "Dashboard",
      items: [
        { key: "overview", label: "Dashboard", icon: "home" },
      ],
    },
    {
      label: "Account",
      items: [
        { key: "settings", label: "Profile", icon: "person" },
      ],
    },
  ];

  return (
    <PortalShell user={user} title="Dashboard" sections={sections} active={tab} onNav={setTab}>
      {tab === "overview" && <OverviewTab user={user} />}
      {tab === "saved" && <SavedTab />}
      {tab === "inquiries" && <InquiriesTab />}
      {tab === "viewings" && <ViewingsTab />}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "settings" && <ProfileTab user={user} />}
    </PortalShell>
  );
}

function OverviewTab({ user }: { user: User }) {
  const [items, setItems] = useState<any[] | null>(null);
  const [view, setView] = useState<"wishlist" | "searches">("wishlist");
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    fetch("/api/user/saved")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  useEffect(load, [load]);

  async function remove(ref: string) {
    await fetch("/api/user/saved", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ property_ref: ref }) });
    setToast("Removed from saved");
    load();
    setTimeout(() => setToast(""), 2000);
  }

  return (
    <div>
      <div className="myprop-head">
        <div className="myprop-title">My Property</div>
        <div className="myprop-sub">View and manage the properties you have shortlisted.</div>
      </div>

      <div className="myprop-tabs">
        <button type="button" className={"myprop-tab" + (view === "wishlist" ? " active" : "")} onClick={() => setView("wishlist")}>
          Wishlist
        </button>
        <button type="button" className={"myprop-tab" + (view === "searches" ? " active" : "")} onClick={() => setView("searches")}>
          Saved Searches
        </button>
      </div>

      {view === "wishlist" ? (
        items === null ? (
          <div className="app-card">
            <p className="app-empty">Loading…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="myprop-card">
            <span className="myprop-card-icon">
              <PortalIcon name="search" />
            </span>
            <div className="myprop-card-body">
              <h3>You do not have any saved properties yet</h3>
              <p>Tap the heart icon on any property to save it here, so you can compare options and shortlist your favourites.</p>
            </div>
            <a className="myprop-cta" href="/">
              Search &amp; Save
            </a>
          </div>
        ) : (
          <>
            <p className="myprop-list-title">
              {items.length} saved propert{items.length === 1 ? "y" : "ies"}
            </p>
            <div className="myprop-list">
              {items.map((it) => (
                <div className="myprop-item" key={it.id}>
                  <div className="myprop-item-main">
                    <div className="myprop-item-title">{it.title || it.property_slug || it.property_ref}</div>
                    <div className="myprop-item-sub">
                      {it.price ? "AED " + Number(it.price).toLocaleString() : ""}
                      {it.price ? " · " : ""}
                      {fmtDate(it.created_at)}
                    </div>
                  </div>
                  <div className="myprop-item-actions">
                    <a className="myprop-ghost" href={it.property_ref}>
                      View
                    </a>
                    <button type="button" className="myprop-ghost danger" onClick={() => remove(it.property_ref)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="myprop-card" style={{ marginTop: 20 }}>
              <span className="myprop-card-icon">
                <PortalIcon name="search" />
              </span>
              <div className="myprop-card-body">
                <h3>Looking for something new?</h3>
                <p>Head back to the property search to shortlist more homes.</p>
              </div>
              <a className="myprop-cta" href="/">
                Search &amp; Save
              </a>
            </div>
          </>
        )
      ) : (
        <div className="myprop-card">
          <span className="myprop-card-icon">
            <PortalIcon name="bookmark" />
          </span>
          <div className="myprop-card-body">
            <h3>No saved searches yet</h3>
            <p>Save a search to be notified as soon as matching properties are listed.</p>
          </div>
          <a className="myprop-cta" href="/">
            Search &amp; Save
          </a>
        </div>
      )}
      {toast && <div className="app-toast">{toast}</div>}
    </div>
  );
}

function SavedTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const [toast, setToast] = useState("");
  const load = useCallback(() => {
    fetch("/api/user/saved")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  useEffect(load, [load]);
  async function remove(ref: string) {
    await fetch("/api/user/saved", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ property_ref: ref }) });
    setToast("Removed from saved");
    load();
    setTimeout(() => setToast(""), 2000);
  }
  return (
    <div className="app-card">
      <div className="app-card-head">
        <div>
          <h2>Saved Properties</h2>
          <p className="app-card-sub">Properties you have bookmarked for later.</p>
        </div>
      </div>
      {items === null ? (
        <p className="app-empty">Loading…</p>
      ) : items.length === 0 ? (
        <p className="app-empty">You have not saved any properties yet. Tap the heart icon on any property to save it here.</p>
      ) : (
        <table className="app-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Price</th>
              <th>Saved on</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>
                  <a href={it.property_ref} className="app-title-link">
                    <strong>{it.title || it.property_slug || it.property_ref}</strong>
                  </a>
                </td>
                <td>{it.price ? "AED " + Number(it.price).toLocaleString() : "—"}</td>
                <td>{fmtDate(it.created_at)}</td>
                <td>
                  <div className="row-actions">
                    <a className="app-btn ghost sm" href={it.property_ref}>
                      View
                    </a>
                    <button type="button" className="app-btn danger sm" onClick={() => remove(it.property_ref)}>
                      Remove
                    </button>
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

function InquiriesTab() {
  const [items, setItems] = useState<any[] | null>(null);
  useEffect(() => {
    fetch("/api/user/inquiries")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  return (
    <div className="app-card">
      <div className="app-card-head">
        <div>
          <h2>Inquiries</h2>
          <p className="app-card-sub">Messages sent to the sales team.</p>
        </div>
      </div>
      {items === null ? (
        <p className="app-empty">Loading…</p>
      ) : items.length === 0 ? (
        <p className="app-empty">No inquiries yet.</p>
      ) : (
        <table className="app-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>
                  <strong>{it.kind}</strong>
                  {it.property_ref && (
                    <div>
                      <a href={it.property_ref} className="app-title-link">
                        {it.property_slug || it.property_ref}
                      </a>
                    </div>
                  )}
                </td>
                <td>{it.message}</td>
                <td>
                  <span className={"app-badge " + it.status}>{it.status}</span>
                </td>
                <td>{fmtDate(it.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ViewingsTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const [form, setForm] = useState({ property_ref: "", preferred_date: "", time_slot: "Morning (9am – 12pm)", notes: "" });
  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetch("/api/user/viewings")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  async function book(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/user/viewings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(d.error || "Could not book the viewing");
      return;
    }
    setForm({ property_ref: "", preferred_date: "", time_slot: "Morning (9am – 12pm)", notes: "" });
    setMsg("Viewing request submitted. We will confirm shortly.");
    fetch("/api/user/viewings")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []));
  }
  return (
    <div className="app-card">
      <div className="app-card-head">
        <div>
          <h2>Viewings</h2>
          <p className="app-card-sub">Schedule a viewing for a property.</p>
        </div>
      </div>
      <form className="app-form-grid" onSubmit={book} style={{ marginBottom: 24 }}>
        <div className="app-field">
          <label>Property link</label>
          <input
            type="text"
            placeholder="/buy/property-slug42/"
            value={form.property_ref}
            onChange={(e) => setForm({ ...form, property_ref: e.target.value })}
          />
        </div>
        <div className="app-field">
          <label>Preferred date</label>
          <input type="date" required value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} />
        </div>
        <div className="app-field">
          <label>Time slot</label>
          <select value={form.time_slot} onChange={(e) => setForm({ ...form, time_slot: e.target.value })}>
            <option>Morning (9am – 12pm)</option>
            <option>Afternoon (12pm – 4pm)</option>
            <option>Evening (4pm – 8pm)</option>
          </select>
        </div>
        <div className="app-field">
          <label>Notes</label>
          <input type="text" placeholder="Anything we should know?" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="full">
          <button type="submit" className="app-btn">
            Request viewing
          </button>
          {msg && <div className="app-card-sub" style={{ color: "#1e6f2e", marginTop: 8 }}>{msg}</div>}
        </div>
      </form>
      {items === null ? (
        <p className="app-empty">Loading…</p>
      ) : items.length === 0 ? (
        <p className="app-empty">No viewings scheduled yet.</p>
      ) : (
        <table className="app-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>
                  <strong>{it.property_slug || it.property_ref || "General viewing"}</strong>
                </td>
                <td>{it.preferred_date}</td>
                <td>{it.time_slot || "—"}</td>
                <td>
                  <span className={"app-badge " + it.status}>{it.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function NotificationsTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const load = useCallback(() => {
    fetch("/api/user/notifications")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  useEffect(load, [load]);
  async function markAll() {
    await fetch("/api/user/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: "{}" });
    load();
  }
  return (
    <div className="app-card">
      <div className="app-card-head">
        <div>
          <h2>Notifications</h2>
          <p className="app-card-sub">Updates about your account and inquiries.</p>
        </div>
        {items && items.length > 0 && (
          <button type="button" className="app-btn ghost sm" onClick={markAll}>
            Mark all read
          </button>
        )}
      </div>
      {items === null ? (
        <p className="app-empty">Loading…</p>
      ) : items.length === 0 ? (
        <p className="app-empty">No notifications yet.</p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((n) => (
            <li key={n.id} style={{ borderBottom: "1px solid #f0f0f0", padding: "12px 0" }}>
              <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
                <strong style={{ color: "#142121", fontSize: 14 }}>{n.title}</strong>
                {!Number(n.read) && <span className="app-badge new">new</span>}
              </div>
              {n.body && <p style={{ color: "#35373c", fontSize: 13, margin: "4px 0 0" }}>{n.body}</p>}
              <p style={{ color: "#9399a4", fontSize: 11, margin: "4px 0 0" }}>{fmtDate(n.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProfileTab({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<"personal" | "notifications" | "password" | "delete">("personal");
  const [data, setData] = useState({
    user: { first_name: "", surname: "", email: "", phone: "" },
    address: { address_line1: "", address_line2: "", town_city: "", postcode: "", country: "" },
    preferences: { subscribe_news: true, email_notifications: true, property_alerts: true },
  });
  const [password, setPassword] = useState({ new_password: "", confirm_password: "" });
  const [deleteReason, setDeleteReason] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile");
      const d = await res.json();
      if (res.ok) {
        setData(d);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const savePersonalDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.user.first_name,
          surname: data.user.surname,
          email: data.user.email,
          phone: data.user.phone,
          address: data.address,
          preferences: data.preferences,
        }),
      });
      const d = await res.json();
      setMsg(res.ok ? { ok: true, text: "Profile updated" } : { ok: false, text: d.error || "Update failed" });
    } catch {
      setMsg({ ok: false, text: "Network error" });
    } finally {
      setBusy(false);
    }
  };

  const saveNotificationPreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: data.preferences }),
      });
      const d = await res.json();
      setMsg(res.ok ? { ok: true, text: "Preferences updated" } : { ok: false, text: d.error || "Update failed" });
    } catch {
      setMsg({ ok: false, text: "Network error" });
    } finally {
      setBusy(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (password.new_password !== password.confirm_password) {
      setMsg({ ok: false, text: "New passwords do not match" });
      return;
    }
    if (password.new_password.length < 8) {
      setMsg({ ok: false, text: "Password must be at least 8 characters" });
      return;
    }
    if (!/[A-Za-z]/.test(password.new_password) || !/\d/.test(password.new_password)) {
      setMsg({ ok: false, text: "Password must contain letters and numbers" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(password),
      });
      const d = await res.json();
      if (res.ok) {
        setPassword({ new_password: "", confirm_password: "" });
        setMsg({ ok: true, text: "Password changed. You have been signed out of other sessions." });
      } else {
        setMsg({ ok: false, text: d.error || "Change failed" });
      }
    } catch {
      setMsg({ ok: false, text: "Network error" });
    } finally {
      setBusy(false);
    }
  };

  const deleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: deleteReason }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const d = await res.json();
        setMsg({ ok: false, text: d.error || "Deletion failed" });
      }
    } catch {
      setMsg({ ok: false, text: "Network error" });
    } finally {
      setBusy(false);
    }
  };

  const checkPasswordStrength = (pw: string) => {
    let strength = 0;
    if (pw.length >= 8) strength += 1;
    if (/[A-Z]/.test(pw)) strength += 1;
    if (/[a-z]/.test(pw)) strength += 1;
    if (/\d/.test(pw)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pw)) strength += 1;
    setPasswordStrength(Math.min(5, strength));
  };

  const countries = COUNTRIES;
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const phoneNumber = data.user.phone || "";
  const phoneParts = phoneNumber.startsWith(selectedCountry.dial)
    ? phoneNumber.substring(selectedCountry.dial.length).split(" ")
    : ["", ""];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">My Account</h1>
        <p className="profile-subtitle">Manage your personal details, preferences, and account security.</p>
      </div>

      <div className="profile-tabs">
        <button
          type="button"
          className={"profile-tab" + (activeTab === "personal" ? " active" : "")}
          onClick={() => setActiveTab("personal")}
        >
          Personal Details
        </button>
        <button
          type="button"
          className={"profile-tab" + (activeTab === "notifications" ? " active" : "")}
          onClick={() => setActiveTab("notifications")}
        >
          Notification Preferences
        </button>
        <button
          type="button"
          className={"profile-tab" + (activeTab === "password" ? " active" : "")}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
        <button
          type="button"
          className={"profile-tab" + (activeTab === "delete" ? " active" : "")}
          onClick={() => setActiveTab("delete")}
        >
          Delete Account
        </button>
      </div>

      {msg && <div className={"app-toast"} style={{ background: msg.ok ? "#1e6f2e" : "#b3261e" }}>{msg.text}</div>}

      {activeTab === "personal" && (
        <div className="profile-card">
          <div className="profile-card-head">
            <div>
              <h2>Personal Details</h2>
              <p className="app-card-sub">Update your personal information.</p>
            </div>
          </div>
          <form className="app-form-grid" onSubmit={savePersonalDetails}>
            <div className="app-field full">
              <label>Welcome {data.user.first_name || user.name.split(" ")[0]}</label>
            </div>

            <div className="profile-section-title">Personal Information</div>

            <div className="app-field">
              <label>First Name <span className="required-indicator">*</span></label>
              <input
                value={data.user.first_name}
                onChange={(e) => setData({ ...data, user: { ...data.user, first_name: e.target.value } })}
                required
              />
            </div>
            <div className="app-field">
              <label>Surname <span className="required-indicator">*</span></label>
              <input
                value={data.user.surname}
                onChange={(e) => setData({ ...data, user: { ...data.user, surname: e.target.value } })}
                required
              />
            </div>
            <div className="app-field">
              <label>Email <span className="required-indicator">*</span></label>
              <input
                type="email"
                value={data.user.email}
                onChange={(e) => setData({ ...data, user: { ...data.user, email: e.target.value } })}
                required
              />
            </div>

            <div className="app-field full">
              <label>Mobile Number <span className="required-indicator">*</span></label>
              <div className="phone-input">
                <select
                  className="country-select"
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const country = countries.find((c) => c.code === e.target.value) || countries[0];
                    setSelectedCountry(country);
                  }}
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.dial}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phoneParts[0]}
                  onChange={(e) => {
                    const newPhone = selectedCountry.dial + " " + e.target.value;
                    setData({ ...data, user: { ...data.user, phone: newPhone } });
                  }}
                />
              </div>
            </div>

            <div className="profile-section-title">Address</div>

            <div className="app-field full">
              <label>Address Line 1</label>
              <input
                value={data.address.address_line1}
                onChange={(e) => setData({ ...data, address: { ...data.address, address_line1: e.target.value } })}
              />
            </div>
            <div className="app-field full">
              <label>Address Line 2</label>
              <input
                value={data.address.address_line2}
                onChange={(e) => setData({ ...data, address: { ...data.address, address_line2: e.target.value } })}
              />
            </div>
            <div className="app-field">
              <label>Town / City</label>
              <input
                value={data.address.town_city}
                onChange={(e) => setData({ ...data, address: { ...data.address, town_city: e.target.value } })}
              />
            </div>
            <div className="app-field">
              <label>Postcode</label>
              <input
                value={data.address.postcode}
                onChange={(e) => setData({ ...data, address: { ...data.address, postcode: e.target.value } })}
              />
            </div>
            <div className="app-field">
              <label>Country</label>
              <input
                value={data.address.country}
                onChange={(e) => setData({ ...data, address: { ...data.address, country: e.target.value } })}
              />
            </div>

            <div className="full">
              <button type="submit" className="app-btn" disabled={busy}>
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="profile-card">
          <div className="profile-card-head">
            <div>
              <h2>Notification Preferences</h2>
              <p className="app-card-sub">Manage how we communicate with you.</p>
            </div>
          </div>
          <form className="app-form-grid" onSubmit={saveNotificationPreferences}>
            <div className="app-field full">
              <div className="toggle-field">
                <label>Subscribe to news and updates</label>
                <ToggleSwitch
                  checked={data.preferences.subscribe_news}
                  onChange={(checked) => setData({ ...data, preferences: { ...data.preferences, subscribe_news: checked } })}
                />
              </div>
            </div>
            <div className="app-field full">
              <div className="toggle-field">
                <label>Receive email notifications</label>
                <ToggleSwitch
                  checked={data.preferences.email_notifications}
                  onChange={(checked) => setData({ ...data, preferences: { ...data.preferences, email_notifications: checked } })}
                />
              </div>
            </div>
            <div className="app-field full">
              <div className="toggle-field">
                <label>Receive property alerts</label>
                <ToggleSwitch
                  checked={data.preferences.property_alerts}
                  onChange={(checked) => setData({ ...data, preferences: { ...data.preferences, property_alerts: checked } })}
                />
              </div>
            </div>

            <div className="full">
              <button type="submit" className="app-btn" disabled={busy}>
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "password" && (
        <div className="profile-card">
          <div className="profile-card-head">
            <div>
              <h2>Change Password</h2>
              <p className="app-card-sub">Update your password for security.</p>
            </div>
          </div>
          <form className="app-form-grid" onSubmit={changePassword}>
            <div className="app-field full">
              <label>New Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password.new_password}
                  onChange={(e) => {
                    setPassword({ ...password, new_password: e.target.value });
                    checkPasswordStrength(e.target.value);
                  }}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <PortalIcon name="eye-off" /> : <PortalIcon name="eye" />}
                </button>
              </div>
              <div className="password-strength">
                <div className="strength-meter">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={"strength-bar" + (i <= passwordStrength ? " active" : "")}
                      style={{ backgroundColor: i <= passwordStrength ? (i <= 2 ? "#b3261e" : i <= 4 ? "#ff9800" : "#1e6f2e") : "#e0e0e0" }}
                    />
                  ))}
                </div>
                <span className="strength-text">
                  {passwordStrength <= 2 ? "Weak" : passwordStrength <= 4 ? "Medium" : "Strong"}
                </span>
              </div>
            </div>
            <div className="app-field full">
              <label>Confirm Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password.confirm_password}
                  onChange={(e) => setPassword({ ...password, confirm_password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <PortalIcon name="eye-off" /> : <PortalIcon name="eye" />}
                </button>
              </div>
            </div>

            <div className="full">
              <button type="submit" className="app-btn" disabled={busy}>
                Change Password
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "delete" && (
        <div className="profile-card">
          <div className="profile-card-head">
            <div>
              <h2>Delete Account</h2>
              <p className="app-card-sub">Permanently remove your account and data.</p>
            </div>
          </div>
          <form className="app-form-grid" onSubmit={deleteAccount}>
            <div className="app-field full">
              <h3 style={{ color: "#b3261e", fontSize: "16px", marginBottom: "8px" }}>Deleting Account</h3>
              <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.5" }}>
                Deleting your account will permanently remove all your information from our database. This action cannot be undone.
              </p>
            </div>

            <div className="app-field full">
              <label>Why are you deleting your account?</label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="We value your feedback. Please let us know why you're leaving."
                rows={4}
              />
            </div>

            <div className="full">
              <button type="submit" className="app-btn danger" disabled={busy}>
                Delete Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      className={"toggle-switch" + (checked ? " active" : "")}
      onClick={() => onChange(!checked)}
      aria-checked={checked}
      role="switch"
    >
      <span className="toggle-slider" />
    </button>
  );
}

function fmtDate(s: string): string {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
