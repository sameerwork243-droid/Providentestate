import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { requireGuest } from "@/server/session";
import { PortalAuthLayout } from "@/components/portal/auth-layout";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage() {
  await requireGuest();
  return (
    <PortalAuthLayout footerBare>
      <LoginForm />
    </PortalAuthLayout>
  );
}
