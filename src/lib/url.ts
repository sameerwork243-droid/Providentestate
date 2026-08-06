export function toCloudFrontUrl(url: string, width: number, height?: number): string {
  if (!url) return "";
  if (url.includes("d3h330vgpwpjr8.cloudfront.net")) return url;
  
  // Extract the path after /i/
  const match = url.match(/(?:\/i\/|ggfx-providentestate\.s3[^\/]*\/i\/)([^?]+)/);
  if (!match) return url;
  
  const filePath = match[1].replace(/\.(svg|png|jpe?g|avif)$/i, ".webp");
  if (height) {
    return `https://d3h330vgpwpjr8.cloudfront.net/x/${width}x${height}/${filePath}`;
  } else {
    return `https://d3h330vgpwpjr8.cloudfront.net/x/${width}x/${filePath}`;
  }
}