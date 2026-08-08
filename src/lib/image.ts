const CF = "https://d3h330vgpwpjr8.cloudfront.net";

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
  if (url.includes(CF)) return url;
  const m = url.match(/\/i\/(.+)$/);
  if (!m) return url;
  return cfPath(m[1], `${w}x${h}`);
}

/** Width-only cloudfront transform, mirroring the reference `x/{w}x/{rest}` pattern. */
export function cfw(url: string | null | undefined, w = 744): string {
  if (!url) return "";
  if (url.includes(CF)) return url;
  const m = url.match(/\/i\/(.+)$/);
  if (!m) return url;
  return cfPath(m[1], `${w}x`);
}