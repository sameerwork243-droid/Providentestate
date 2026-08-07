import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { requireGuest } from "@/server/session";
import { PortalAuthLayout } from "@/components/portal/auth-layout";

export const metadata: Metadata = { title: "Create Account" };

export default async function RegisterPage() {
  await requireGuest();
  return (
    <PortalAuthLayout>
      <RegisterForm />
    </PortalAuthLayout>
  );
}
