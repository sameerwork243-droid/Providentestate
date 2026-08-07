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

const RESOURCES: Record<string, CrudConfig> = {
  services: SERVICES,
  agents: AGENTS,
  developers: DEVELOPERS,
  communities: COMMUNITIES,
  testimonials: TESTIMONIALS,
  faqs: FAQS,
  media: MEDIA,
};

export function crudByResource(resource: string): CrudConfig | null {
  return RESOURCES[resource] || null;
}
