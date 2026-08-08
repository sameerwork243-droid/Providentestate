import { readFileSync } from "node:fs";
import path from "node:path";
import { PriceFmt, addressOf, propLink, waLink } from "@/lib/props";
import { CardGallery } from "./card-gallery";
import { SaveButton } from "./save-button";
import { CountryFlag } from "./phone-flag";

const signatureBadge = readFileSync(path.join(process.cwd(), "src", "data", "signature-badge.svg"), "utf8");
const moreBoxIcon = readFileSync(path.join(process.cwd(), "src", "data", "more-box.svg"), "utf8");

export function PropertyCard({ hit, list = false, signature = false }: { hit: any; list?: boolean; signature?: boolean }) {
  const link = propLink(hit);
  const imgs = hit.images || [];
  const desc = longDesc(hit);
  const neg = Array.isArray(hit.crm_negotiator_id) ? hit.crm_negotiator_id[0] || {} : hit.crm_negotiator_id || {};
  const cardPhone = neg.phone || "+971 50 440 2783";
  return (
    <div className="property-card-wrapper">
      <div
        className={
          "property-card" + (list ? " list-view" : "") + (signature ? " singnature" : "")
        }
        id={`property-card-${hit.id}-${hit.crm_id}`}
      >
        <div className="img-section listview-img-section">
          <CardGallery imgs={imgs} link={link} alt={hit.building?.[0] || "Property"} count={hit.imageCount || imgs.length} />
          {signature && <p className="img-tag hidee" dangerouslySetInnerHTML={{ __html: signatureBadge }}></p>}
        </div>
        <div className="content-section">
            <div className="pr-bk">
              <a className="price" href={link}>
                <PriceFmt value={hit.price} qualifier={hit.price_qualifier} />
              </a>
              <SaveButton
                propertyRef={link}
                slug={hit.slug || ""}
                title={hit.title || hit.building?.[0] || "Property"}
                price={hit.price || 0}
                thumb={imgs[0]?.["340x252"] || ""}
              />
            </div>
          <a className="ammenities" href={link}>
            {hit.description || hit.building?.[0] || "View Details"}
          </a>
          <p className="address">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 7C10 8.10457 9.10457 9 8 9C6.89543 9 6 8.10457 6 7C6 5.89543 6.89543 5 8 5C9.10457 5 10 5.89543 10 7Z" stroke="#9399A4" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M13 7C13 11.7614 8 14.5 8 14.5C8 14.5 3 11.7614 3 7C3 4.23858 5.23858 2 8 2C10.7614 2 13 4.23858 13 7Z" stroke="#9399A4" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            {addressOf(hit)}
          </p>
          <div className="info-section">
            <p className="type">{hit.building?.[0] || hit.building_type || "Property"}</p>
            <p className="p-hypen"></p>
            {hit.bedroom != null && (
              <p className="bedrooms">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="bed-icon">
                  <path d="M14.6666 12.6667V10.6667M14.6666 10.6667V8C14.6666 6.52724 13.4727 5.33333 12 5.33333H7.99998V10.6667M14.6666 10.6667H7.99998M7.99998 10.6667H1.33331M1.33331 10.6667V4M1.33331 10.6667V12.6667M5.99999 7.33333C5.99999 8.06973 5.40303 8.66667 4.66665 8.66667C3.93027 8.66667 3.33332 8.06973 3.33332 7.33333C3.33332 6.59695 3.93027 6 4.66665 6C5.40303 6 5.99999 6.59695 5.99999 7.33333Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>{hit.bedroom}</span>
              </p>
            )}
            {hit.bathroom != null && (
              <p className="bathrooms">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="bath-icon">
                  <path d="M8 3.33333C10.2091 3.33333 12 5.12419 12 7.33333V8H4V7.33333C4 5.12419 5.79086 3.33333 8 3.33333ZM8 3.33333V2" stroke="#35373C" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M4 10.3335H4.00999M4 13.3335H4.00999M7.99501 10.3335H8.00499M7.99501 13.3335H8.00499M11.99 10.3335H12M11.99 13.3335H12" stroke="#35373C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>{hit.bathroom}</span>
              </p>
            )}
            {(hit.floorarea_min != null || hit.floorarea_max != null) && (
              <p className="size">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-4-icon">
                  <path d="M2.5 2.5V5.5M2.5 2.5H5.5M2.5 2.5L6 6M2.5 13.5V10.5M2.5 13.5H5.5M2.5 13.5L6 10M13.5 2.5L10.5 2.5M13.5 2.5V5.5M13.5 2.5L10 6M13.5 13.5H10.5M13.5 13.5V10.5M13.5 13.5L10 10" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span>
                  {hit.floorarea_min != null && hit.floorarea_min !== hit.floorarea_max
                    ? hit.floorarea_min.toLocaleString("en-US")
                    : hit.floorarea_min ?? hit.floorarea_max != null
                      ? hit.floorarea_max!.toLocaleString("en-US")
                      : ""}{" "}
                  sq ft
                </span>
              </p>
            )}
          </div>
          <p className="long-description">
            <span>{desc}</span>
            <a className="read-more-text" href={link}>
              more
            </a>
          </p>
          <div className="cta-section">
            <a className="property-cta email" href="/book-a-viewing/">
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="phone-icon">
                <path d="M14.5 5V12C14.5 12.8284 13.8284 13.5 13 13.5H3C2.17157 13.5 1.5 12.8284 1.5 12V5M14.5 5C14.5 4.17157 13.8284 3.5 13 3.5H3C2.17157 3.5 1.5 4.17157 1.5 5M14.5 5V5.16181C14.5 5.6827 14.2298 6.1663 13.7861 6.43929L8.78615 9.51622C8.30404 9.8129 7.69596 9.8129 7.21385 9.51622L2.21385 6.43929C1.77023 6.1663 1.5 5.6827 1.5 5.16181V5" stroke="#35373C" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span>Book a Viewing</span>
            </a>
            <a href={`tel:${cardPhone}`} className="property-cta">
              <CountryFlag />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="phone-icon">
                <path d="M14.5 11.3v2a1.34 1.34 0 0 1-1.47 1.34 13.2 13.2 0 0 1-5.74-2 13.2 13.2 0 0 1-4-4A13.2 13.2 0 0 1 1.3 2.97 1.34 1.34 0 0 1 2.63 1.5h2a1.34 1.34 0 0 1 1.34 1.14c.07.66.27 1.3.47 1.87a1.34 1.34 0 0 1-.33 1.4l-.87.87a10.7 10.7 0 0 0 4 4l.87-.87a1.34 1.34 0 0 1 1.4-.33c.57.2 1.21.4 1.87.47.62.06 1.1.6 1.1 1.25Z" stroke="#EE7133" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Call</span>
            </a>
            <a href={waLink(hit)} target="_blank" className="property-cta whats" rel="noreferrer">
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                <path fill="#67C15E" d="M8.5 0C4.06 0 .5 3.56.5 8c0 1.4.37 2.77 1.07 3.98L.5 16l4.2-1.1a8 8 0 0 0 3.8.97c4.44 0 8-3.56 8-7.95S12.94 0 8.5 0Zm4.68 11.3c-.2.57-1.17 1.09-1.6 1.13-.42.04-.9.2-3.03-.63-2.56-1-4.17-3.6-4.3-3.77-.12-.17-1.02-1.36-1.02-2.6 0-1.23.65-1.83.88-2.08.23-.25.5-.31.67-.31h.48c.15 0 .36-.06.56.42l.78 1.9c.06.15.1.32.02.49-.07.17-.12.26-.23.4l-.35.43c-.12.11-.24.24-.1.47.14.23.6 1 1.3 1.61.9.8 1.65 1.05 1.9 1.17.23.12.37.1.5-.06l.75-.87c.16-.19.31-.15.52-.09l1.9.9c.24.11.4.17.46.26.06.1.06.56-.14 1.13Z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function longDesc(hit: any): string {
  const d = (hit.long_description || "").replace(/\s+/g, " ").trim();
  return d.length > 100 ? d.slice(0, 100).trimEnd() + "..." : d;
}

export function MoreBox({ title, subtitle, href, btn }: { title: string; subtitle: string; href: string; btn: string }) {
  return (
    <div className="property-card-wrapper more-box" tabIndex={-1} style={{ width: "100%", display: "inline-block" }}>
      <div className="property-card">
        <div>
          <div dangerouslySetInnerHTML={{ __html: moreBoxIcon }}></div>
          <div className="price">{title}</div>
          <p>{subtitle}</p>
          <a className="button button-orange more-btn" href={href}>
            {btn}
          </a>
        </div>
      </div>
    </div>
  );
}
