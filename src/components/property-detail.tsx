import { cft } from "@/lib/store";
import { Rich, stripHtml } from "./rich";
import { PropertyCard } from "./property-card";

export function PropertyDetailPage({ data, route }: { data: any; route: string }) {
  const p = data;
  const images = (p.images || []).map((im: any) => im.srcUrl || im.url).filter(Boolean) as string[];
  const big = images[0] || "";
  const thumbs = images.slice(0, 6);
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
              <div className="d-block d-xl-none mob-bann-prop-img">
                <div className="d-block mob-banner-img">
                  <div className="main-image img-zoom">
                    {big && <img loading="eager" src={cft(big, 696, 520)} alt={`${type} - Provident Estate`} />}
                  </div>
                </div>
              </div>
              <div className="d-none d-xl-flex sub-images">
                {thumbs.map((t, i) => (
                  <div className="sub-image img-zoom" key={i}>
                    <img loading="eager" draggable="false" src={cft(t, 464, 312)} alt={`${type} - Provident Estate`} />
                  </div>
                ))}
              </div>
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
                    <h2 className="price">
                      {p.price_qualifier ? `${p.price_qualifier} ` : "AED "}
                      {(p.price || 0).toLocaleString()}
                    </h2>
                    <button className="mortgage-link">Calculate your mortgage repayments</button>
                    <div className="description-section">
                      <p className="description1">{p.introtext}</p>
                      <p className="description2">{p.display_address || p.address || ""}</p>
                    </div>
                    <div className="info-section">
                      <p className="bedrooms">
                        <svg width="16" height="16" className="bed-icon" viewBox="0 0 16 16" fill="none">
                          <path d="M1.714 10.857c.631 0 1.143-.767 1.143-1.714s-.512-1.714-1.143-1.714S.57 7.196.57 8.143s.513 1.714 1.143 1.714ZM5.143 5.714c.631 0 1.143-.767 1.143-1.714S5.774 2.286 5.143 2.286 4 3.053 4 4s.512 1.714 1.143 1.714ZM10.857 5.714C11.488 5.714 12 4.947 12 4s-.512-1.714-1.143-1.714S9.714 3.053 9.714 4s.512 1.714 1.143 1.714ZM14.286 10.857c.63 0 1.143-.767 1.143-1.714s-.512-1.714-1.143-1.714-1.143.767-1.143 1.714.512 1.714 1.143 1.714ZM11.429 11.429c0 1.577-1.852 2.285-3.429 2.285-1.577 0-3.429-.708-3.429-2.285 0-1.578 1.143-4 3.429-4 2.286 0 3.429 2.422 3.429 4Z" fill="#07234B" />
                        </svg>
                        <span>
                          {p.bedroom} Bed{p.bedroom !== 1 ? "s" : ""}
                        </span>
                      </p>
                      <p className="bathrooms">
                        <svg width="16" height="16" className="bath-icon" viewBox="0 0 16 16" fill="none">
                          <path d="M5.5 14v-3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75V14m0 0h3V2.364M8.5 14h5V7.167M1.5 14h1m12 0h-12m-1-8 3-1.09m8-2.91-1 .364m0 4.136 2 .667m1 .333-1-.333m-9-2.258V2h-2v12m2-9.09 7-2.546" stroke="#35373C" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>
                          {p.bathroom} Bath{p.bathroom !== 1 ? "s" : ""}
                        </span>
                      </p>
                      {size != null && (
                        <p className="size">
                          <svg width="16" height="16" className="arrow-4-icon" viewBox="0 0 16 16" fill="none">
                            <path d="M6 3h7v7M3 6H2v7h7v-1M6 6h7M3 3l10 10" stroke="#07234B" strokeLinecap="round" strokeLinejoin="round" />
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
                        <KeyInfo label="Furnishing Type" value={furnishing} />
                        <KeyInfo label="Property ID" value={p.crm_id || ""} />
                      </div>
                    </div>
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-12">
              <div className="right-section-wrap">
                <div className="right-section">
                  <div className="property-nego-card-wrap">
                    <div className="border-side">
                      <div className="top-section">
                        <a href={`tel:${phone.replace(/\s/g, "")}`} className="button button-orange">
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
