import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";
import { requireAdmin } from "@/server/session";

export const metadata: Metadata = { title: "Admin Panel" };

export default async function AdminPage() {
  const user = await requireAdmin();
  return <AdminApp user={user} />;
}