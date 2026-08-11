import { CrudConfig } from "./crud";

export const SERVICES: CrudConfig = {
  table: "services",
  fields: [
    { name: "title", required: true },
    { name: "slug", required: true },
    { name: "icon" },
    { name: "banner_image" },
    { name: "description", type: "text" },
    { name: "rich_content", type: "text" },
    { name: "gallery", type: "json" },
    { name: "seo_title" },
    { name: "seo_description" },
    { name: "published", type: "int" },
  ],
  searchable: ["title", "slug"],
  defaultOrder: "id DESC",
};

export const AGENTS: CrudConfig = {
  table: "agents",
  fields: [
    { name: "name", required: true },
    { name: "slug", required: true },
    { name: "role" },
    { name: "phone" },
    { name: "email" },
    { name: "languages", type: "json" },
    { name: "specialties", type: "json" },
    { name: "img" },
    { name: "bio", type: "text" },
    { name: "brn_number" },
    { name: "published", type: "int" },
  ],
  searchable: ["name", "email", "role"],
  defaultOrder: "id DESC",
};

export const DEVELOPERS: CrudConfig = {
  table: "developers",
  fields: [
    { name: "name", required: true },
    { name: "slug", required: true },
    { name: "region" },
    { name: "founded", type: "int" },
    { name: "deliveries", type: "int" },
    { name: "img" },
    { name: "description", type: "text" },
    { name: "published", type: "int" },
  ],
  searchable: ["name", "region"],
  defaultOrder: "name ASC",
};

export const COMMUNITIES: CrudConfig = {
  table: "communities",
  fields: [
    { name: "name", required: true },
    { name: "slug", required: true },
    { name: "region" },
    { name: "published", type: "int" },
  ],
  searchable: ["name", "region"],
  defaultOrder: "name ASC",
};

export const TESTIMONIALS: CrudConfig = {
  table: "testimonials",
  fields: [
    { name: "author", required: true },
    { name: "role" },
    { name: "content", type: "text" },
    { name: "rating", type: "int" },
    { name: "img" },
    { name: "published", type: "int" },
  ],
  searchable: ["author", "role"],
  defaultOrder: "id DESC",
};

export const FAQS: CrudConfig = {
  table: "faqs",
  fields: [
    { name: "question", required: true },
    { name: "answer", type: "text" },
    { name: "category" },
    { name: "sort", type: "int" },
    { name: "published", type: "int" },
  ],
  searchable: ["question", "category"],
  defaultOrder: "sort ASC, id ASC",
};

export const MEDIA: CrudConfig = {
  table: "media_library",
  fields: [
    { name: "url", required: true },
    { name: "kind" },
    { name: "alt" },
  ],
  searchable: ["url", "alt"],
  defaultOrder: "id DESC",
};

export const JOBS: CrudConfig = {
  table: "jobs",
  fields: [
    { name: "title", required: true },
    { name: "slug", required: true },
    { name: "location" },
    { name: "summary", type: "text" },
    { name: "job_details", type: "text" },
    { name: "published", type: "int" },
  ],
  searchable: ["title", "slug", "location"],
  defaultOrder: "published DESC, id DESC",
};

export const PROJECTS: CrudConfig = {
  table: "projects",
  fields: [
    { name: "title", required: true },
    { name: "slug", required: true },
    { name: "status" },
    { name: "price", type: "int" },
    { name: "currency" },
    { name: "community" },
    { name: "developer" },
    { name: "building_type", type: "json" },
    { name: "department" },
    { name: "bedrooms_min", type: "int" },
    { name: "bedrooms_max", type: "int" },
    { name: "display_address" },
    { name: "about", type: "text" },
    { name: "images", type: "json" },
    { name: "amenities", type: "json" },
    { name: "banner_image" },
    { name: "completion_year", type: "int" },
    { name: "published", type: "int" },
  ],
  searchable: ["title", "slug", "developer", "community"],
  defaultOrder: "published DESC, id DESC",
};

const RESOURCES: Record<string, CrudConfig> = {
  services: SERVICES,
  agents: AGENTS,
  developers: DEVELOPERS,
  communities: COMMUNITIES,
  testimonials: TESTIMONIALS,
  faqs: FAQS,
  media: MEDIA,
  jobs: JOBS,
  projects: PROJECTS,
};

export function crudByResource(resource: string): CrudConfig | null {
  return RESOURCES[resource] || null;
}
