import type { Metadata, Viewport } from "next";
import "./provident.css";
import "./header-styles.css";
import "./developer-styles.css";
import "./app-styles.css";
import "./portal.css";
import "./app-shell.css";

export const metadata: Metadata = {
  title: {
    default: "Leading Real Estate Agency in Dubai, UAE | Zoya Ventures Real Estate",
    template: "%s | Zoya Ventures Real Estate",
  },
  description:
    "Your one-stop for all real estate services, including selling, renting, snagging, conveyancing, mortgages, property management, & expert property consultants.",
  icons: {
    icon: "/favicon-32x32.png",
  },
  openGraph: {
    title: "Leading Real Estate Agency in Dubai, UAE",
    siteName: "Zoya Ventures Real Estate",
    images: ["https://www.providentestate.com/icons/icon-512x512.png"],
  },
  metadataBase: new URL("https://providentestate.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
