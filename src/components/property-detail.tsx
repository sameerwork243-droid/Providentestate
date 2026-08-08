import { cft } from "@/lib/store";
import { Rich, stripHtml } from "./rich";
import { PropertyCard } from "./property-card";
import { SaveButton } from "./save-button";
import { PropertyGallery } from "./property-gallery";
import { CountryFlag } from "./phone-flag";

// Helper to determine if property is signature
function isSignatureProperty(p: any): boolean {
  return p.price >= 20000000; // Signature threshold
}

export function PropertyDetailPage({ data, route }: { data: any; route: string }) {
  const p = data;
  const images = (p.images || []).map((im: any) => im.srcUrl || im.url).filter(Boolean) as string[];
  const title = p.title || `${p.building?.[0] || "Property"} in ${p.display_address || "Dubai"}`;
  const sale = (p.search_type || "").toLowerCase().includes("rent") || route.startsWith("/let");
  const purpose = sale ? "For Rent" : "For Sale";
  const completion = (p.status || "Ready").replace(/-/g, " ");
  const furnishing = p.furnishing || "N/A";
  const building = Array.isArray(p.building) ? p.building[0] : p.building;
  const neg = p.crm_negotiator_id || {};
  const phone = neg.phone || "+971 50 539 0249";
  const type = building || p.building_type || "Property";
  const size = p.floorarea_min ?? p.floorarea_max;
  const description = p.long_description || p.description || p.introtext || "";
  const completionYear = p.completion_year || "N/A";
  const pricePerSqFt = size && p.price ? Math.round(p.price / size) : null;
  const isSignature = isSignatureProperty(p);
  const status = p.status || "Ready";

  return (
    <div>
      <div className="property-breadcrumb-wrap">
        <div className="breadcrumbs-wrap">
          <div className="breadcrumbs-container container">
            <nav className="breadcrumbs">
              <ol className="breadcrumb">
                <li className="enable-link-home breadcrumb-item">
                  <a className="breadcrumb-link enable-link" href="/">
                    Home
                  </a>
                </li>
                <li className=" breadcrumb-item">
                  <a className="breadcrumb-link enable-link" href={sale ? "/let/properties-for-rent/" : "/buy/properties-for-sale/"}>
                    {sale ? "Properties for Rent" : "Properties for Sale"}
                  </a>
                </li>
                <li className=" breadcrumb-item active">
                  <a aria-current="page" className="breadcrumb-link disable-link" href={route + "/"}>
                    {title}
                  </a>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="property-banner-wrap">
        <div className="property-banner-container">
          <div className="property-banner">
            <div className="images-section">
              <div className="dd-v-i"></div>
              {/* Status Badge */}
              {status && (
                <div className="property-status-badge">
                  {status.replace(/-/g, " ")}
                </div>
              )}
              {/* Signature Badge */}
              {isSignature && (
                <div className="signature-badge">
                  <img src="/images/signature-badge.svg" alt="Signature Project" />
                </div>
              )}
              <PropertyGallery imgs={images} type={type} />
            </div>
          </div>
        </div>
      </div>

      <div className="property-detail-body">
        <div className="container">
          <div className="row">
            <div className="col-xl-9 col-lg-12">
              <div className="left-section">
                <div className="property-info-wrapper">
                  <div className="property-info-container">
                    <h1 style={{ position: "absolute", top: 0, opacity: 0, fontSize: 10 }}>
                      {type} for {sale ? "rent" : "sale"} with {p.bedroom} bedroom in {p.display_address || "Dubai"} at {p.price ? "AED " + p.price.toLocaleString() : ""} [{p.crm_id}]
                    </h1>
                     <div className="price-section">
                       <h2 className="price">
                         {p.price_qualifier ? `${p.price_qualifier} ` : "AED "}
                         {(p.price || 0).toLocaleString()}
                       </h2>
                       {pricePerSqFt && (
                         <p className="price-per-sqft">
                           AED {pricePerSqFt.toLocaleString()} / sq ft
                         </p>
                       )}
                     </div>
                     <button className="mortgage-link">Calculate your mortgage repayments</button>
                     <div className="detail-save-wrap">
                       <SaveButton
                         propertyRef={route + "/"}
                         slug={p.slug || ""}
                         title={title}
                         price={p.price || 0}
                         thumb={images[0] || ""}
                         variant="button"
                       />
                     </div>
                    <div className="description-section">
                      <p className="description1">{p.introtext}</p>
                      <p className="description2">{p.display_address || p.address || ""}</p>
                    </div>
                    <div className="info-section">
                      <p className="bedrooms">
                        <svg width="16" height="16" className="bed-icon" viewBox="0 0 16 16" fill="none">
                          <path d="M14.6666 12.6667V10.6667M14.6666 10.6667V8C14.6666 6.52724 13.4727 5.33333 12 5.33333H7.99998V10.6667M14.6666 10.6667H7.99998M7.99998 10.6667H1.33331M1.33331 10.6667V4M1.33331 10.6667V12.6667M5.99999 7.33333C5.99999 8.06973 5.40303 8.66667 4.66665 8.66667C3.93027 8.66667 3.33332 8.06973 3.33332 7.33333C3.33332 6.59695 3.93027 6 4.66665 6C5.40303 6 5.99999 6.59695 5.99999 7.33333Z" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>
                          {p.bedroom} Bed{p.bedroom !== 1 ? "s" : ""}
                        </span>
                      </p>
                      <p className="bathrooms">
                        <svg width="16" height="16" className="bath-icon" viewBox="0 0 16 16" fill="none">
                          <path d="M8 3.33333C10.2091 3.33333 12 5.12419 12 7.33333V8H4V7.33333C4 5.12419 5.79086 3.33333 8 3.33333ZM8 3.33333V2" stroke="#35373C" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4 10.3335H4.00999M4 13.3335H4.00999M7.99501 10.3335H8.00499M7.99501 13.3335H8.00499M11.99 10.3335H12M11.99 13.3335H12" stroke="#35373C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>
                          {p.bathroom} Bath{p.bathroom !== 1 ? "s" : ""}
                        </span>
                      </p>
                      {size != null && (
                        <p className="size">
                          <svg width="16" height="16" className="arrow-4-icon" viewBox="0 0 16 16" fill="none">
                            <path d="M2.5 2.5V5.5M2.5 2.5H5.5M2.5 2.5L6 6M2.5 13.5V10.5M2.5 13.5H5.5M2.5 13.5L6 10M13.5 2.5L10.5 2.5M13.5 2.5V5.5M13.5 2.5L10 6M13.5 13.5H10.5M13.5 13.5V10.5M13.5 13.5L10 10" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{Number(size).toLocaleString()} sq ft</span>
                        </p>
                      )}
                    </div>
                     <div className="key-info-section">
                       <p className="heading">Key Information</p>
                       <div className="key-infos">
                         <KeyInfo label="Property Type" value={type} />
                         <KeyInfo label="Purpose" value={purpose} />
                         <KeyInfo label="Completion" value={completion} />
                         <KeyInfo label="Completion Year" value={completionYear} />
                         <KeyInfo label="Furnishing Type" value={furnishing} />
                         {size && <KeyInfo label="Size" value={`${Number(size).toLocaleString()} sq ft`} />}
                         <KeyInfo label="Property ID" value={p.crm_id || ""} />
                       </div>
                     </div>
                    <div className="divider"></div>
                    {Array.isArray(p.amenities) && p.amenities.length > 0 && (
                      <div className="property-features-section">
                        <p className="heading">Amenities</p>
                        <div className="features-wrap">
                          {p.amenities.map((a: string, i: number) => (
                            <div className="feature-item" key={i}>
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10.5l4 4L16 6.5" stroke="#EE7133" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="feature-text">{a}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                     <div className="divider"></div>
                     <div>
                       <div className="long-description-section" id="contentsection-property">
                         <p className="heading">Description</p>
                         <div className="read-more-wrap long-description">
                           <div className="read-more">
                             <Rich html={description} />
                           </div>
                         </div>
                       </div>
                       
                       {/* Floor Plans Section */}
                       {p.floor_plans && p.floor_plans.length > 0 && (
                         <div className="floor-plans-section">
                           <p className="heading">Floor Plans</p>
                           <div className="floor-plans-gallery">
                             {p.floor_plans.map((plan: any, i: number) => (
                               <div className="floor-plan-item" key={i}>
                                 <img src={cft(plan.url, 400, 300)} alt={`Floor plan ${i + 1}`} />
                               </div>
                             ))}
                           </div>
                         </div>
                       )}
                       
                       {/* Nearby Amenities Section */}
                       <div className="nearby-amenities-section">
                         <p className="heading">Nearby Amenities</p>
                         <div className="amenities-map">
                           <img src="https://maps.googleapis.com/maps/api/staticmap?center={p.latitude},{p.longitude}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C{p.latitude},{p.longitude}&key=YOUR_API_KEY" alt="Location map" />
                         </div>
                       </div>
                       
                       {/* Similar Properties Section */}
                       <div className="similar-properties-section">
                         <p className="heading">Similar Properties</p>
                         <div className="similar-properties-slider">
                           {/* This would be populated with similar properties from the database */}
                           <PropertyCard hit={p} />
                           <PropertyCard hit={p} />
                           <PropertyCard hit={p} />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
            <div className="col-xl-3 col-lg-12">
              <div className="right-section-wrap sticky-sidebar">
                <div className="right-section">
                  <div className="property-nego-card-wrap">
                    <div className="border-side">
                      <div className="top-section">
                        <a href={`tel:${phone.replace(/\s/g, "")}`} className="button button-orange">
                          <CountryFlag />
                          <svg width="16" height="16" className="phone-icon" viewBox="0 0 16 16" fill="none">
                            <path d="M14.5 11.3v2a1.34 1.34 0 0 1-1.47 1.34 13.2 13.2 0 0 1-5.74-2 13.2 13.2 0 0 1-4-4A13.2 13.2 0 0 1 1.3 2.97 1.34 1.34 0 0 1 2.63 1.5h2a1.34 1.34 0 0 1 1.34 1.14c.07.66.27 1.3.47 1.87a1.34 1.34 0 0 1-.33 1.4l-.87.87a10.7 10.7 0 0 0 4 4l.87-.87a1.34 1.34 0 0 1 1.4-.33c.57.2 1.21.4 1.87.47.62.06 1.1.6 1.1 1.25Z" stroke="#EE7133" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Call
                        </a>
                        <a
                          href={`https://wa.provident.ae/inquire?phone=97150539860&text=${encodeURIComponent(
                            `Hello Provident,\n\nI would like to know more about this property:\n\n• Reference: ${p.crm_id || ""}\n• Type: ${type}\n• Price: ${p.price ? "AED " + p.price.toLocaleString() : ""}\n• Location: ${p.display_address || ""}\n• Link: https://providentestate.com${route}/\n\nModifying this message will prevent it from being sent to the agent.`
                          )}&utm_source=Browser%20Direct&gclid=%22%22&event_type=Whatsapp%20Click&utm_platform=%22%22`}
                          className="button button-green"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                            <path fill="#67C15E" d="M8.5 0C4.06 0 .5 3.56.5 8c0 1.4.37 2.77 1.07 3.98L.5 16l4.2-1.1a8 8 0 0 0 3.8.97c4.44 0 8-3.56 8-7.95S12.94 0 8.5 0Zm4.68 11.3c-.2.57-1.17 1.09-1.6 1.13-.42.04-.9.2-3.03-.63-2.56-1-4.17-3.6-4.3-3.77-.12-.17-1.02-1.36-1.02-2.6 0-1.23.65-1.83.88-2.08.23-.25.5-.31.67-.31h.48c.15 0 .36-.06.56.42l.78 1.9c.06.15.1.32.02.49-.07.17-.12.26-.23.4l-.35.43c-.12.11-.24.24-.1.47.14.23.6 1 1.3 1.61.9.8 1.65 1.05 1.9 1.17.23.12.37.1.5-.06l.75-.87c.16-.19.31-.15.52-.09l1.9.9c.24.11.4.17.46.26.06.1.06.56-.14 1.13Z" />
                          </svg>
                          WhatsApp
                        </a>
                      </div>
                      <div className="bottom-section">
                        <a className="img-section img-zoom" href={neg.url ? neg.url : "/team/"}>
                          <div className="img-section">
                            {neg.url ? (
                              <img draggable="false" src={neg.url} alt="nego" />
                            ) : (
                              <img draggable="false" src="https://d3h330vgpwpjr8.cloudfront.net/x/200x200/man_icon_98ac9e68af.webp" alt="nego" />
                            )}
                          </div>
                        </a>
                        <div className="nego-info">
                          <a href="/team/">
                            <p className="name">{neg.name || "Provident Estate"}</p>
                            <p className="designation">Property Consultant</p>
                            {neg.brn_number && <p className="orn-no">BRN No: {neg.brn_number}</p>}
                          </a>
                        </div>
                        <div className="d-flex d-md-none team-icon-only">
                          <a href={`tel:${phone.replace(/\s/g, "")}`} className="ph">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M14.5 11.3v2a1.34 1.34 0 0 1-1.47 1.34 13.2 13.2 0 0 1-5.74-2 13.2 13.2 0 0 1-4-4A13.2 13.2 0 0 1 1.3 2.97 1.34 1.34 0 0 1 2.63 1.5h2a1.34 1.34 0 0 1 1.34 1.14c.07.66.27 1.3.47 1.87a1.34 1.34 0 0 1-.33 1.4l-.87.87a10.7 10.7 0 0 0 4 4l.87-.87a1.34 1.34 0 0 1 1.4-.33c.57.2 1.21.4 1.87.47.62.06 1.1.6 1.1 1.25Z" stroke="#EE7133" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </a>
                          <a href={`mailto:${neg.email || "info@providentestate.com"}`} className="ml">
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                              <rect x="1.5" y="3" width="13" height="11" rx="1.5" stroke="#35373C" />
                              <path d="m2.5 4.5 5.5 4 5.5-4" stroke="#35373C" strokeLinecap="round" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="property-mortagage-wrap">
                    <div className="property-calc">
                      <div className="calculator-section">
                        <p className="title">Mortgage Calculator</p>
                        <div className="input-section">
                          <div className="label-bk">
                            <label>Property Price (AED)</label>
                            <input type="text" defaultValue={p.price ? p.price.toLocaleString() : ""} />
                          </div>
                          <div className="label-bk">
                            <label>Down Payment (%)</label>
                            <input type="text" defaultValue="20" />
                          </div>
                          <div className="label-bk">
                            <label>Interest Rate (%)</label>
                            <input type="text" defaultValue="4" />
                          </div>
                          <div className="label-bk">
                            <label>Loan Term (years)</label>
                            <input type="text" defaultValue="25" />
                          </div>
                        </div>
                        <div className="result-section">
                          <p>Estimated Monthly Payment</p>
                          <p className="value">AED 0</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="key-info-item">
      <div>
        <p className="label">{label}</p>
        <p className="value">{value}</p>
      </div>
    </div>
  );
}
