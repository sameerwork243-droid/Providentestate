export function SitemapPage({ routes }: { routes: string[] }) {
  const out = new Map<string, string[]>();
  const deeper: string[] = [];

  const put = (group: string, r: string) => {
    if (!out.has(group)) out.set(group, []);
    out.get(group)!.push(r);
  };

  for (const r of routes) {
    if (r === "/") continue;
    const seg = r.split("/").filter(Boolean);
    const root = seg[0];
    const slug = r.slice(1);

    if (root === "area-guides") {
      put("Area Guides & Communities", "/area-guides/" + seg[1] + "/");
    } else if (root === "buy" || root === "let") {
      const label = root === "buy" ? "Properties for Sale" : "Properties for Rent";
      const second = seg[1] || "";
      if (seg.length === 2 && !/^\d/.test(second) && !second.includes("-in-")) {
        put(label, r + "/");
      } else if (seg.length === 3 && seg[2].startsWith("in-")) {
        put(label, r + "/");
      }
    } else if (root === "new-projects") {
      put(
        seg[1] === "type-" ? "New Projects by Type" : seg[1] === "developed-by" ? "New Projects by Developer" : "New Projects",
        r + "/"
      );
    } else if (root === "blog" && seg.length <= 2) {
      put("News & Insights", r + "/");
    } else if (seg.length === 1) {
      put("Main Pages", r + "/");
    } else if (seg.length === 2 || seg.length === 3) {
      put("Information", r + "/");
    } else {
      deeper.push(r);
    }
  }

  const groups = [...out.entries()].filter(([, list]) => list.length > 0).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="sitemap-page">
      <div className="section-p">
        <div className="container">
          <h1 className="title">Sitemap</h1>
          <div className="sitemap-cols">
            {groups.map(([group, list]) => (
              <div className="sitemap-group" key={group}>
                <h3>{group}</h3>
                <ul>
                  {list.map((r) => (
                    <li key={r}>
                      <a href={r}>{r}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}