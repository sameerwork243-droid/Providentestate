export function priceFmt(n: number | null | undefined): string {
  if (n == null) return "";
  return n.toLocaleString("en-US");
}

export function PriceFmt({ value, qualifier }: { value?: number | null; qualifier?: string | null }) {
  if (value == null) return <>{qualifier || ""}</>;
  return (
    <>
      {qualifier ? `${qualifier} ` : "AED "}
      {value.toLocaleString("en-US")}
    </>
  );
}

export function addressOf(hit: any): string {
  if (hit.display_address) return hit.display_address;
  const a = hit.address_full || {};
  return [a.address2, a.address3, a.address4].filter(Boolean).join(", ") || a.area || "";
}

export function propLink(hit: any): string {
  const t = String(hit.search_type || "").toLowerCase();
  const base = t.includes("rent") || t.includes("letting") ? "/let/" : "/buy/";
  return `${base}${hit.slug || ""}${hit.id}/`;
}

export function waLink(hit: any): string {
  const neg = Array.isArray(hit.crm_negotiator_id) ? hit.crm_negotiator_id[0] || {} : hit.crm_negotiator_id || {};
  const phone = neg.phone || "+971 568 308 221";
  const ref = hit.crm_id || "";
  const type = hit.building?.[0] || hit.building_type || "";
  const price = hit.price ? "AED " + hit.price.toLocaleString("en-US") : "";
  const loc = addressOf(hit);
  const link = propLink(hit);
  const text = `Hello Zoya Ventures,\n\nI would like to know more about this property:\n\n• Reference: ${ref}\n• Type: ${type}\n• Price: ${price}\n• Location: ${loc}\n• Link: https://providentestate.com${link}\n\nModifying this message will prevent it from being sent to the agent.`;
  const searchType = String(hit.search_type || "").toLowerCase();
  const kind = searchType.includes("rent") || searchType.includes("letting") ? "secondaryrent" : "secondarysale";
  const params = new URLSearchParams({
    phone: "971568308221",
    text,
    resp_name: neg.name || "",
    utm_source: "Browser Direct",
    gclid: '"',
    type: kind,
    referrer_url: `https://providentestate.com${link}`,
    event_type: "Whatsapp Click",
    utm_platform: '"',
  });
  if (neg.email) params.set("email", neg.email);
  const respPhone = String(neg.phone || "").replace(/\D/g, "");
  if (respPhone) params.set("resp_phone", respPhone);
  return `https://wa.provident.ae/inquire?${params.toString()}`;
}
