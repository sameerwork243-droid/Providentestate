import type { Metadata } from "next";
import { DashboardApp } from "@/components/dashboard/dashboard-app";
import { requireUser } from "@/server/session";

export const metadata: Metadata = { title: "My Account" };

export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role === "admin" || user.role === "agent") {
    const { redirect } = await import("next/navigation");
    redirect("/admin");
  }
  return <DashboardApp user={user} />;
}