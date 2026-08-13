import Link from "next/link";
import backgroundImage from "@/sign_up_bg_0e123241d1.jpg";
import { PortalFooter } from "@/components/portal/portal-shell";



export function PortalAuthLayout({
  children,
  footerBare = false,
}: {
  children: React.ReactNode;
  footerBare?: boolean;
}) {
  return (
    <div className={`portal-root${footerBare ? " portal-auth-nofoot" : ""}`}>
      <header className="portal-appbar">
        <Link className="portal-brand" href="/" aria-label="Zoya Ventures Real Estate">
          <img draggable="false" src="/lloo.png" alt="Zoya Ventures Real Estate" />
        </Link>
        <div className="portal-title">My Account</div>
        <Link className="portal-back" href="/">
          Back to Website
        </Link>
      </header>
      <div className="portal-appbar-spacer" />
      <div className="portal-auth-bg" style={{ backgroundImage: `url(${backgroundImage.src})` }} />
      <div className="portal-auth">
        <div className="portal-auth-inner">
          <div className="portal-auth-card">{children}</div>
        </div>
      </div>
      <PortalFooter />
    </div>
  );
}
