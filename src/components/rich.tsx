export function Rich({ html }: { html?: string | null }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export function ctaHref(cta: any, fallback = "#"): string {
  if (!cta) return fallback;
  if (cta.custom_link) return cta.custom_link;
  if (cta.menu?.slug) {
    const parent = cta.menu.strapi_parent;
    if (parent && typeof parent === "object" && parent.slug) return `/${parent.slug}/${cta.menu.slug}/`;
    return `/${cta.menu.slug}/`;
  }
  return fallback;
}

export function stripHtml(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/�/g, "").trim();
}
