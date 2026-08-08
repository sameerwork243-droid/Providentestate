import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/session";
import { rows } from "@/server/db";

export async function GET() {
  await requireAdmin();
  const count = async (sql: string) => Number((await rows(sql))[0]?.n ?? 0);

  const stats = {
    users: await count("SELECT COUNT(*) AS n FROM users"),
    properties: await count("SELECT COUNT(*) AS n FROM properties"),
    publishedProperties: await count("SELECT COUNT(*) AS n FROM properties WHERE published = 1"),
    featuredProperties: await count("SELECT COUNT(*) AS n FROM properties WHERE featured = 1"),
    services: await count("SELECT COUNT(*) AS n FROM services"),
    inquiries: await count("SELECT COUNT(*) AS n FROM inquiries"),
    newInquiries: await count("SELECT COUNT(*) AS n FROM inquiries WHERE status = 'new'"),
    viewings: await count("SELECT COUNT(*) AS n FROM viewings"),
    pendingViewings: await count("SELECT COUNT(*) AS n FROM viewings WHERE status = 'requested'"),
    agents: await count("SELECT COUNT(*) AS n FROM agents"),
    developers: await count("SELECT COUNT(*) AS n FROM developers"),
    communities: await count("SELECT COUNT(*) AS n FROM communities"),
    testimonials: await count("SELECT COUNT(*) AS n FROM testimonials"),
    faqs: await count("SELECT COUNT(*) AS n FROM faqs"),
    media: await count("SELECT COUNT(*) AS n FROM media_library"),
    savedProperties: await count("SELECT COUNT(*) AS n FROM saved_properties"),
  };

  const inquiriesByStatus = await rows("SELECT status, COUNT(*) AS n FROM inquiries GROUP BY status ORDER BY n DESC");
  const propertiesByType = await rows(
    "SELECT property_type AS label, COUNT(*) AS n FROM properties GROUP BY property_type ORDER BY n DESC"
  );
  const recentInquiries = await rows("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5");
  const recentProperties = await rows("SELECT id, title, price, published, featured, created_at FROM properties ORDER BY created_at DESC LIMIT 5");

  return NextResponse.json({ stats, inquiriesByStatus, propertiesByType, recentInquiries, recentProperties });
}
