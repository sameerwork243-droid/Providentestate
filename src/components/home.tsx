import { ModuleRenderer } from "./modules";
import { HeroSearch } from "./search-hero";
import { areas } from "@/lib/store";

export function Rich({ html }: { html?: string | null }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export function HomePage({ page }: { page: any }) {
  const modules = (page.modules || []).filter(
    (m: any) => !(m.strapi_component === "modules.ads-banner") && !(m.strapi_component === "modules.global-module" && m.choose_module === "contact_module")
  );
  return (
    <div>
      <div className="home-banner">
        <div className="banner-wrap banner-landing-wrap">
          <div className="mobile-banner-menu">
            <div className="scroll-i d-flex d-md-none">
              {["Buy", "Rent", "Projects", "Developers ", "Areas", "Services", "Blogs"].map((l, i) => (
                <a
                  key={i}
                  className="main-menu"
                  href={["/buy/properties-for-sale/", "/let/properties-for-rent/", "/new-projects/", "/developers/", "/area-guides/", "/property-services/", "/blog/"][i]}
                >
                  <span>{l}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="container">
            <div className="bg-section">
              <video
                poster="/images/video-thumbnail.webp"
                className="home-banner-video active"
                src="/media/hero.mp4"
                preload="auto"
                playsInline
                loop
                muted
                autoPlay
              />
              <div>
                <div className="d-block d-md-none">
                  <div className="gatsby-image-wrapper home-banner-video">
                    <div aria-hidden="true" style={{ width: "100%", paddingBottom: "138.29787234042556%" }}></div>
                    <img
                      aria-hidden="true"
                      alt=""
                      src="/images/video-thumbnail.webp"
                      style={{ position: "absolute", inset: 0, boxSizing: "border-box", padding: 0, border: "none", margin: "auto", display: "block", width: 0, height: 0, minWidth: "100%", maxWidth: "100%", minHeight: "100%", maxHeight: "100%" }}
                    />
                  </div>
                </div>
                <div className="d-none d-md-block">
                  <div className="gatsby-image-wrapper home-banner-video">
                    <div aria-hidden="true" style={{ width: "100%", paddingBottom: "56.25%" }}></div>
                    <img
                      aria-hidden="true"
                      alt=""
                      src="/images/video-thumbnail.webp"
                      style={{ position: "absolute", inset: 0, boxSizing: "border-box", padding: 0, border: "none", margin: "auto", display: "block", width: 0, height: 0, minWidth: "100%", maxWidth: "100%", minHeight: "100%", maxHeight: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="banner-container container">
                <div className="brand-bx">
                  <h1 className="title">{page.banner?.title || "Find your home in Dubai."}</h1>
                </div>
                <HeroSearch areas={areas} review={stripText(page.banner?.description?.data?.description)} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {modules.map((m: any, i: number) => (
        <ModuleRenderer key={i} m={m} />
      ))}
    </div>
  );
}

function stripText(html?: string | null): string {
  if (!html) return "4,000 listings \u00A0\u00B7\u00A0400+ agents \u00A0\u00B7\u00A0Serving 80+ countries";
  return html
    .replace(/<\/?p>/g, "")
    .replace(/&nbsp;/g, "\u00A0")
    .replace(/\u00C2\u00B7/g, "\u00B7")
    .replace(/\uFFFD/g, "\u00B7");
}
