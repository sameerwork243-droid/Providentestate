import { requireGuest } from "@/server/session";
import { PortalAuthLayout } from "@/components/portal/auth-layout";

export const metadata = { title: "Reset Password" };

export default async function ForgotPasswordPage() {
  await requireGuest();
  return (
    <PortalAuthLayout>
      <h1>Reset your password</h1>
      <p className="auth-subtitle">
        For security reasons, self-service password reset is not available on this demo. Please contact support at
        support@providentestate.com.
      </p>
    </PortalAuthLayout>
  );
}
