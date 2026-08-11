"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function HeaderAccountButton({ className }: { className?: string }) {
  const [user, setUser] = useState<{ role: string } | null | undefined>(undefined);

  useEffect(() => {
    let live = true;
    const check = () =>
      fetch("/api/auth/me", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => live && setUser(d?.user ?? null))
        .catch(() => live && setUser(null));
    check();
    window.addEventListener("focus", check);
    return () => {
      live = false;
      window.removeEventListener("focus", check);
    };
  }, []);

  const href = user
    ? user.role === "admin" || user.role === "agent"
      ? "/admin"
      : "/dashboard"
    : "/login";

  return (
    <Link
      href={href}
      className={"button list-prop-btn " + (className || "")}
      aria-label={user ? "My Account" : "Login"}
      style={user === undefined ? { visibility: "hidden" } : undefined}
    >
      <svg
        className="user-icon user-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          fill="none"
          d="M2 13.3333C3.55719 11.6817 5.67134 10.6667 8 10.6667C10.3287 10.6667 12.4428 11.6817 14 13.3333M11 5C11 6.65685 9.65685 8 8 8C6.34315 8 5 6.65685 5 5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5Z"
          stroke="#07234B"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!user && "Login"}
    </Link>
  );
}