import { cft } from "@/lib/store";
import { Rich, stripHtml } from "./rich";
import { PropertyCard } from "./property-card";
import { SaveButton } from "./save-button";
import { PropertyGallery } from "./property-gallery";
import { waLink } from "@/lib/props";
import { PropertyEnquiryForm } from "./property-enquiry-form";
import { MortgageCalculator } from "./listing-ui";
import { ReadMore } from "./read-more";
import { dbSimilarProperties } from "@/server/property-bridge";

// Helper to determine if property is signature
function isSignatureProperty(p: any): boolean {
  return p.price >= 20000000; // Signature threshold
}

export async function PropertyDetailPage({ data, route }: { data: any; route: string }) {
  const p = data;
  const kind = (p.search_type || "").toLowerCase().includes("rent") || route.startsWith("/let") ? "let" : "buy";
  const similar = await dbSimilarProperties(p, kind);
  const images = (p.images || []).map((im: any) => im.srcUrl || im.url).filter(Boolean) as string[];
  const title = p.title || `${p.building?.[0] || "Property"} in ${p.display_address || "Dubai"}`;
  const sale = (p.search_type || "").toLowerCase().includes("rent") || route.startsWith("/let");
  const purpose = sale ? "For Rent" : "For Sale";
  const completion = (p.status || "Ready").replace(/-/g, " ");
  const furnishing = p.furnishing || "N/A";
  const building = Array.isArray(p.building) ? p.building[0] : p.building;
  const neg = Array.isArray(p.crm_negotiator_id) ? p.crm_negotiator_id[0] || {} : p.crm_negotiator_id || {};
  const phone = neg.phone || "+971 568 308 221";
  const type = building || p.building_type || "Property";
  const size = p.floorarea_min ?? p.floorarea_max;
  const amenities = (
    Array.isArray(p.accommodation_summary)
      ? p.accommodation_summary
      : Array.isArray(p.amenities)
        ? p.amenities
        : []
  ).filter(Boolean);
  const description = p.long_description || p.description || p.introtext || "";
  const completionYear = p.completion_year || "N/A";
  const pricePerSqFt = size && p.price ? Math.round(p.price / size) : null;
  const isSignature = isSignatureProperty(p);
  const status = p.status || "Ready";
  const waHref = waLink({ ...p, search_type: sale ? "rent" : "sale" });
  const qualifier = Array.isArray(p.price_qualifier) ? p.price_qualifier[0] || "AED" : p.price_qualifier || "AED";

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
              <PropertyGallery imgs={images} type={type} location={p.display_address} title={title} />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="property-detail-body">
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
                    {amenities.length > 0 && (
                      <div className="property-features-section">
                        <p className="heading">Amenities</p>
                        <div className="features-wrap">
                          {amenities.map((a: string, i: number) => (
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
<ReadMore className="long-description">
                            <Rich html={description} />
                          </ReadMore>
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
                       
                        {/* Mortgage Calculator Section */}
                        <MortgageCalculator
                          initialPrice={p.price ? p.price.toLocaleString("en-US") : undefined}
                          currency={qualifier}
                          heading="Calculate Mortgage Repayments"
                          panel
                        />

                        {/* Similar Properties Section */}
                       <div className="similar-properties-section">
                         <p className="heading">Similar Properties</p>
                         <div className="similar-properties-slider">
                           {similar.length ? (
                             similar.map((s: any, i: number) => <PropertyCard key={s.id ?? i} hit={s} />)
                           ) : (
                             <p className="no-results">No similar properties found.</p>
                           )}
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                </div>
              <div className="right-section-wrap sticky-sidebar">
                <div className="right-section">
                  <div className="property-nego-card-wrap">
                    <div className="border-side">
                      <div className="top-section">
                        <a href={`tel:${phone.replace(/\s/g, "")}`} className="button button-orange">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          Call
                        </a>
                        <a
                          href={waHref}
                          className="button button-green"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4.5 6.5C4.5 5.96957 4.71071 5.46086 5.08579 5.08579C5.46086 4.71071 5.96957 4.5 6.5 4.5L7.5 6.5L6.73 7.65438C7.03544 8.38421 7.61579 8.96456 8.34562 9.27L9.5 8.5L11.5 9.5C11.5 10.0304 11.2893 10.5391 10.9142 10.9142C10.5391 11.2893 10.0304 11.5 9.5 11.5C8.17392 11.5 6.90215 10.9732 5.96447 10.0355C5.02678 9.09785 4.5 7.82608 4.5 6.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.9956 13.1945C6.25594 13.9239 7.73853 14.1701 9.16697 13.8871C10.5954 13.6041 11.8722 12.8114 12.7593 11.6566C13.6464 10.5017 14.0832 9.06373 13.9883 7.61063C13.8935 6.15753 13.2734 4.78852 12.2437 3.75883C11.214 2.72915 9.84503 2.10907 8.39193 2.01422C6.93882 1.91936 5.50082 2.3562 4.34601 3.24328C3.1912 4.13037 2.39841 5.40715 2.11545 6.83559C1.83249 8.26403 2.07868 9.74662 2.80811 11.007L2.02623 13.3413C1.99685 13.4294 1.99259 13.524 2.01392 13.6144C2.03525 13.7044 2.08133 13.7874 2.147 13.8531C2.21266 13.9187 2.29532 13.9648 2.38571 13.9861C2.47609 14.0075 2.57063 14.0032 2.65873 13.9738L4.9956 13.1945Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
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
                            <p className="name">{neg.name || "Zoya Ventures Real Estate"}</p>
                            <p className="designation">{neg.designation || "Property Consultant"}</p>
                            {neg.brn_number && <p className="orn-no">BRN No: {neg.brn_number}</p>}
                          </a>
                        </div>
                        <div className="d-flex d-md-none team-icon-only">
                          <a href={`tel:${phone.replace(/\s/g, "")}`} className="ph">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M14.5 11.3v2a1.34 1.34 0 0 1-1.47 1.34 13.2 13.2 0 0 1-5.74-2 13.2 13.2 0 0 1-4-4A13.2 13.2 0 0 1 1.3 2.97 1.34 1.34 0 0 1 2.63 1.5h2a1.34 1.34 0 0 1 1.34 1.14c.07.66.27 1.3.47 1.87a1.34 1.34 0 0 1-.33 1.4l-.87.87a10.7 10.7 0 0 0 4 4l.87-.87a1.34 1.34 0 0 1 1.4-.33c.57.2 1.21.4 1.87.47.62.06 1.1.6 1.1 1.25Z" stroke="#EE7133" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </a>
                          <a href={waHref} className="wa" target="_blank" rel="noreferrer">
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                              <path fillRule="evenodd" clipRule="evenodd" d="M8.83317 1.3335C5.15125 1.3335 2.1665 4.31825 2.1665 8.00016C2.1665 9.0935 2.43009 10.1266 2.89742 11.0381L2.18009 14.051C2.16035 14.1341 2.1622 14.2208 2.18547 14.303C2.20874 14.3851 2.25266 14.4599 2.31303 14.5203C2.37341 14.5807 2.44823 14.6246 2.53038 14.6479C2.61253 14.6711 2.69927 14.673 2.78234 14.6532L5.79525 13.9359C6.70675 14.4032 7.73984 14.6668 8.83317 14.6668C12.5151 14.6668 15.4998 11.6821 15.4998 8.00016C15.4998 4.31825 12.5151 1.3335 8.83317 1.3335ZM3.1665 8.00016C3.1665 4.87058 5.70359 2.3335 8.83317 2.3335C11.9628 2.3335 14.4998 4.87058 14.4998 8.00016C14.4998 11.1297 11.9628 13.6668 8.83317 13.6668C7.84284 13.6668 6.91317 13.4132 6.10425 12.9677C5.9954 12.9078 5.86814 12.8906 5.74725 12.9193L3.34109 13.4922L3.914 11.0861C3.94278 10.9652 3.92552 10.8379 3.86559 10.7291C3.42009 9.92008 3.1665 8.9905 3.1665 8.00016ZM7.00175 9.83158C7.99967 10.8294 9.33025 11.4988 10.8145 11.6582C11.7958 11.7634 12.4998 10.9549 12.4998 10.1151V9.53208C12.4998 9.19235 12.3903 8.86167 12.1875 8.58911C11.9847 8.31654 11.6995 8.11662 11.3741 8.019L11.3277 8.00508L11.2802 7.99575L10.6117 7.86408C10.3967 7.80843 10.1724 7.79873 9.95344 7.83561C9.73447 7.87248 9.52573 7.9551 9.34084 8.07808C9.12323 7.90666 8.92667 7.7101 8.75525 7.4925C8.87827 7.30759 8.96092 7.09882 8.99781 6.87982C9.0347 6.66082 9.02499 6.4365 8.96934 6.2215L8.8375 5.55308L8.82817 5.50558L8.81425 5.45916C8.71664 5.1338 8.51673 4.84857 8.2442 4.64579C7.97167 4.44302 7.64103 4.3335 7.30134 4.3335H6.71817C5.87842 4.3335 5.06984 5.03733 5.17509 6.01875C5.33442 7.50291 6.00375 8.83366 7.00175 9.83158ZM9.80609 8.98333C9.88009 8.90934 9.97275 8.85678 10.0742 8.8312C10.1757 8.80563 10.2822 8.80801 10.3824 8.83808L11.0868 8.97683C11.2062 9.01268 11.3109 9.08606 11.3853 9.18608C11.4597 9.28609 11.4998 9.40743 11.4998 9.53208V10.1151C11.4998 10.4352 11.2395 10.698 10.9213 10.6638C10.1261 10.5789 9.36029 10.3159 8.68067 9.8945C8.32817 9.67609 8.00209 9.41768 7.70892 9.12441C7.41565 8.83124 7.15724 8.50516 6.93884 8.15266C6.51744 7.473 6.25449 6.70717 6.1695 5.912C6.13534 5.59375 6.39817 5.3335 6.71817 5.3335H7.30125C7.42588 5.33353 7.54718 5.37373 7.64715 5.44814C7.74713 5.52255 7.82045 5.62721 7.85625 5.74658L7.99517 6.45083C8.02525 6.55107 8.02763 6.65759 8.00206 6.75907C7.97648 6.86056 7.92391 6.95323 7.84992 7.02725L7.75659 7.12058C7.69482 7.18208 7.65041 7.25881 7.62784 7.343C7.59684 7.45991 7.61084 7.58641 7.67809 7.69491C7.86111 7.99046 8.07768 8.26386 8.3235 8.50966C8.56932 8.75553 8.84275 8.97213 9.13834 9.15516C9.24684 9.22233 9.37325 9.23641 9.49025 9.20541C9.57443 9.18283 9.65116 9.13841 9.71267 9.07666L9.80609 8.98333Z" fill="#2AD366" />
                            </svg>
                          </a>
                        </div>
                      </div>
                      <PropertyEnquiryForm propertyRef={p.crm_id || ""} propertySlug={p.slug || ""} route={route} />
                    </div>
                  </div>
                </div>
           </div>
          </div>
         </div>
        <div className="floating-cta-shell-wrap detail-prop">
        <div className="floating-cta-shell container">
          <div className="floating-section">
            <a className="button button-orange" href="#bav-form">
              <span>Email</span>
            </a>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="button button-orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Call</span>
            </a>
            <a href={waHref} className="button button-green" target="_blank" rel="noreferrer">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4.5 6.5C4.5 5.96957 4.71071 5.46086 5.08579 5.08579C5.46086 4.71071 5.96957 4.5 6.5 4.5L7.5 6.5L6.73 7.65438C7.03544 8.38421 7.61579 8.96456 8.34562 9.27L9.5 8.5L11.5 9.5C11.5 10.0304 11.2893 10.5391 10.9142 10.9142C10.5391 11.2893 10.0304 11.5 9.5 11.5C8.17392 11.5 6.90215 10.9732 5.96447 10.0355C5.02678 9.09785 4.5 7.82608 4.5 6.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.9956 13.1945C6.25594 13.9239 7.73853 14.1701 9.16697 13.8871C10.5954 13.6041 11.8722 12.8114 12.7593 11.6566C13.6464 10.5017 14.0832 9.06373 13.9883 7.61063C13.8935 6.15753 13.2734 4.78852 12.2437 3.75883C11.214 2.72915 9.84503 2.10907 8.39193 2.01422C6.93882 1.91936 5.50082 2.3562 4.34601 3.24328C3.1912 4.13037 2.39841 5.40715 2.11545 6.83559C1.83249 8.26403 2.07868 9.74662 2.80811 11.007L2.02623 13.3413C1.99685 13.4294 1.99259 13.524 2.01392 13.6144C2.03525 13.7044 2.08133 13.7874 2.147 13.8531C2.21266 13.9187 2.29532 13.9648 2.38571 13.9861C2.47609 14.0075 2.57063 14.0032 2.65873 13.9738L4.9956 13.1945Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
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
