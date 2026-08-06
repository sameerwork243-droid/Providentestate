"use client";

import { toCloudFrontUrl } from "@/lib/url";

export function ServiceImage({ url, alt }: { url?: string; alt: string }) {
  const placeholder = "https://d3h330vgpwpjr8.cloudfront.net/x/1128x752/placeholder.jpg";
  return (
    <img
      loading="lazy"
      draggable="false"
      src={url ? toCloudFrontUrl(url, 1128, 752) : placeholder}
      alt={alt}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        img.src = placeholder;
      }}
    />
  );
}