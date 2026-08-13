import { BookViewingForm } from "./book-viewing-form";
import { Newsletter } from "./newsletter";
import { SaveButton } from "./save-button";

function priceText(p: any): string {
  const qual = Array.isArray(p?.price_qualifier) ? p.price_qualifier[0] || "AED" : p.price_qualifier || "AED";
  const n = Number(p?.price || 0);
  return `${qual} ${n.toLocaleString("en-US")}`.trim();
}

function previewImage(p: any): string {
  const images = Array.isArray(p?.images) ? p.images : [];
  for (const im of images) {
    const u = im?.srcUrl || im?.url || im?.["696x520"] || im?.["464x312"] || im?.["340x252"];
    if (u) return u;
  }
  return "/images/property-placeholder.svg";
}

function specs(p: any) {
  const bed = p?.bedroom ?? p?.bedrooms_min;
  const bath = p?.bathroom;
  const area =
    p?.floorarea_min ?? p?.floorarea_max ?? p?.area_sqft ??
    (p?.floorarea_min != null && p?.floorarea_max != null
      ? p.floorarea_min === p.floorarea_max
        ? p.floorarea_min
        : null
      : null);
  const out: string[] = [];
  if (bed != null) out.push(`${bed} ${Number(bed) === 1 ? "bed" : "beds"}`);
  if (bath != null) out.push(`${bath} ${Number(bath) === 1 ? "bath" : "baths"}`);
  if (area) out.push(`${Number(area).toLocaleString("en-US")} sqft`);
  return out;
}

function PropertyPreviewCard({ p, route }: { p: any; route: string }) {
  const title = p?.title || `${p?.building?.[0] || "Property"} in ${p?.display_address || "Dubai"}`;
  const location = p?.display_address || (p?.address_full?.area ? p.address_full.area : p?.community) || "Dubai";
  const sp = specs(p);
  const ref = p?.crm_id || p?.id;
  return (
    <div className="bv-preview">
      <div className="bv-preview-img">
        <img loading="eager" src={previewImage(p)} alt={title} />
        {ref != null && (
          <SaveButton
            propertyRef={route + "/"}
            slug={p?.slug || ""}
            title={title}
            price={Number(p?.price || 0)}
            thumb={previewImage(p)}
            variant="button"
          />
        )}
      </div>
      <div className="bv-preview-body">
        <p className="bv-preview-price">{priceText(p)}</p>
        <h3 className="bv-preview-title">{title}</h3>
        <p className="bv-preview-loc">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {location}
        </p>
        {sp.length > 0 && <p className="bv-preview-specs">{sp.join("  |  ")}</p>}
      </div>
    </div>
  );
}

export function BookViewingPage({ property, route }: { property: any; route: string }) {
  const title = "Book a Viewing";
  const description =
    "Whether you have a question about our services, need help, or just want to provide feedback, please fill out the form and we'll get back to you as soon as possible.";

  return (
    <div className="bv-page">
      <div className="bv-banner">
        <div className="bv-banner-inner container">
          <nav className="breadcrumbs bv-breadcrumbs" aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item enable-link-home">
                <a className="breadcrumb-link enable-link" href="/">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item active">
                <a aria-current="page" className="breadcrumb-link disable-link" href={route + "/"}>
                  {title}
                </a>
              </li>
            </ol>
          </nav>
          <h1 className="bv-title">{title}</h1>
          <p className="bv-desc">{description}</p>
        </div>
      </div>

      <div className="bv-body container">
        <div className="bv-grid">
          <div className="bv-form-col">
            <div className="bv-card">
              <BookViewingForm
                propertyRef={property?.crm_id || property?.id ? String(property?.crm_id || property?.id) : undefined}
                propertySlug={property?.slug || undefined}
                propertyTitle={property?.title || undefined}
              />
            </div>
          </div>
          <div className="bv-preview-col">
            {property ? (
              <PropertyPreviewCard p={property} route={route} />
            ) : (
              <div className="bv-preview bv-preview-empty">
                <p className="bv-preview-note">
                  Select a property from our{" "}
                  <a href="/buy/properties-for-sale/">buy</a> or{" "}
                  <a href="/let/properties-for-rent/">rent</a> listings and click &quot;Book a
                  Viewing&quot; to attach it to this request.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
}