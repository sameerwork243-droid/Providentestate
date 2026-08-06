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
  const base = hit.search_type === "rental" || hit.search_type === "rent" ? "/let/" : "/buy/";
  return `${base}${hit.slug || ""}${hit.id}/`;
}

export function waLink(hit: any): string {
  const neg = hit.crm_negotiator_id || {};
  const phone = neg.phone || "+971 50 440 2783";
  const ref = hit.crm_id || "";
  const type = hit.building?.[0] || hit.building_type || "";
  const price = hit.price ? "AED " + hit.price.toLocaleString("en-US") : "";
  const loc = addressOf(hit);
  const link = propLink(hit);
  const text = `Hello Provident,\n\nI would like to know more about this property:\n\n• Reference: ${ref}\n• Type: ${type}\n• Price: ${price}\n• Location: ${loc}\n• Link: https://providentestate.com${link}\n\nModifying this message will prevent it from being sent to the agent.`;
  return `https://wa.provident.ae/inquire?phone=${encodeURIComponent(phone.replace(/\D/g, ""))}&text=${encodeURIComponent(
    text
  )}&utm_source=Browser%20Direct&gclid=%22%22&event_type=Whatsapp%20Click&utm_platform=%22%22`;
}
