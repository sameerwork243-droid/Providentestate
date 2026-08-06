"use client";

export function DeveloperImage({ url, alt }: { url?: string; alt: string }) {
  const placeholder = "https://d3h330vgpwpjr8.cloudfront.net/x/296x/placeholder.jpg";
  return (
    <img
      loading="lazy"
      draggable="false"
      src={url || placeholder}
      alt={alt}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        img.src = placeholder;
      }}
    />
  );
}