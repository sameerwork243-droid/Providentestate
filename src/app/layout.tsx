import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./provident.css";
import "./header-styles.css";
import "./developer-styles.css";
import "./auth-styles.css";
import "./app-styles.css";
import "./portal.css";
import "./app-shell.css";

export const metadata: Metadata = {
  title: {
    default: "Leading Real Estate Agency in Dubai, UAE | Provident Estate",
    template: "%s | Provident Estate",
  },
  description:
    "Your one-stop for all real estate services, including selling, renting, snagging, conveyancing, mortgages, property management, & expert property consultants.",
  icons: {
    icon: "/favicon-32x32.png",
  },
  openGraph: {
    title: "Leading Real Estate Agency in Dubai, UAE",
    siteName: "Provident Estate",
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
      <body>
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PGNHTGZ5');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PGNHTGZ5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
