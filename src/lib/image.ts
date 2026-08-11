const CF = "https://d3h330vgpwpjr8.cloudfront.net";

const LOCAL_OVERRIDES: Record<string, { base: string; sizes: Record<string, string> }> = {
  "2_15234debdc": { base: "/images/banners/careers-banner.webp", sizes: { "376x": "/images/banners/careers-banner-376.webp", "744x": "/images/banners/careers-banner-744.webp" } },
  "Group_image_016b5fb1e3": { base: "/images/banners/about-video.webp", sizes: { "336x": "/images/banners/about-video-336.webp", "696x": "/images/banners/about-video-696.webp" } },
};

/** Resolve a known live-CDN asset to its local copy, if present. */
export function localImage(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/([^/]+)\.(?:webp|jpe?g|png|avif)$/i);
  if (!m) return null;
  const o = LOCAL_OVERRIDES[m[1]];
  return o ? o.base : null;
}

function localImageFor(url: string | null | undefined, size: string): string | null {
  if (!url) return null;
  const m = url.match(/([^/]+)\.(?:webp|jpe?g|png|avif)$/i);
  if (!m) return null;
  const o = LOCAL_OVERRIDES[m[1]];
  if (!o) return null;
  return o.sizes[size] || o.base;
}

function cfPath(rest: string, size: string): string {
  const file = rest.replace(/\.(svg|png|jpe?g|avif)$/i, ".webp");
  const i = file.lastIndexOf("/");
  if (i >= 0) return `${CF}/x/${file.slice(0, i)}/${size}/${file.slice(i + 1)}`;
  return `${CF}/x/${size}/${file}`;
}

/** ggfx S3 -> cloudfront transform URL, mirroring the reference pattern.
 * Flat files: `x/{w}x{h}/{file}`; nested property paths: `x/{dir}/{w}x{h}/{file}`. */
export function cft(url: string | null | undefined, w = 340, h = 252): string {
  if (!url) return "";
  const local = localImageFor(url, `${w}x${h}`);
  if (local) return local;
  if (url.includes(CF)) return url;
  const m = url.match(/\/i\/(.+)$/);
  if (!m) return url;
  return cfPath(m[1], `${w}x${h}`);
}

/** Width-only cloudfront transform, mirroring the reference `x/{w}x/{rest}` pattern. */
export function cfw(url: string | null | undefined, w = 744): string {
  if (!url) return "";
  const local = localImageFor(url, `${w}x`);
  if (local) return local;
  if (url.includes(CF)) return url;
  const m = url.match(/\/i\/(.+)$/);
  if (!m) return url;
  return cfPath(m[1], `${w}x`);
}