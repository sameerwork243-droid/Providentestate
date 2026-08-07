import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows } from "@/server/db";

export async function GET() {
  await requireAdmin();
  const count = (sql: string) => Number((rows(sql)[0] as { n: number }).n);

  const stats = {
    users: count("SELECT COUNT(*) AS n FROM users"),
    properties: count("SELECT COUNT(*) AS n FROM properties"),
    publishedProperties: count("SELECT COUNT(*) AS n FROM properties WHERE published = 1"),
    featuredProperties: count("SELECT COUNT(*) AS n FROM properties WHERE featured = 1"),
    services: count("SELECT COUNT(*) AS n FROM services"),
    inquiries: count("SELECT COUNT(*) AS n FROM inquiries"),
    newInquiries: count("SELECT COUNT(*) AS n FROM inquiries WHERE status = 'new'"),
    viewings: count("SELECT COUNT(*) AS n FROM viewings"),
    pendingViewings: count("SELECT COUNT(*) AS n FROM viewings WHERE status = 'requested'"),
    agents: count("SELECT COUNT(*) AS n FROM agents"),
    developers: count("SELECT COUNT(*) AS n FROM developers"),
    communities: count("SELECT COUNT(*) AS n FROM communities"),
    testimonials: count("SELECT COUNT(*) AS n FROM testimonials"),
    faqs: count("SELECT COUNT(*) AS n FROM faqs"),
    media: count("SELECT COUNT(*) AS n FROM media_library"),
    savedProperties: count("SELECT COUNT(*) AS n FROM saved_properties"),
  };

  const inquiriesByStatus = rows("SELECT status, COUNT(*) AS n FROM inquiries GROUP BY status ORDER BY n DESC");
  const propertiesByType = rows(
    "SELECT property_type AS label, COUNT(*) AS n FROM properties GROUP BY property_type ORDER BY n DESC"
  );
  const recentInquiries = rows("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5");
  const recentProperties = rows("SELECT id, title, price, published, featured, created_at FROM properties ORDER BY created_at DESC LIMIT 5");

  return NextResponse.json({ stats, inquiriesByStatus, propertiesByType, recentInquiries, recentProperties });
}
