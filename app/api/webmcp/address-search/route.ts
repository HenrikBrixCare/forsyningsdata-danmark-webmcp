import { NextRequest, NextResponse } from "next/server";

type Row = Record<string, unknown>;
function obj(value: unknown): value is Row { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 3) return NextResponse.json({ country: "DK", query, results: [], message: "Enter at least 3 characters." });
  const url = new URL("https://api.dataforsyningen.dk/autocomplete");
  url.searchParams.set("q", query); url.searchParams.set("type", "adresse"); url.searchParams.set("startfra", "adgangsadresse"); url.searchParams.set("fuzzy", ""); url.searchParams.set("per_side", "10");
  try {
    const response = await fetch(url.toString(), { cache: "no-store", headers: { Accept: "application/json" } });
    if (!response.ok) return NextResponse.json({ country: "DK", query, results: [], error: "address_source_unavailable" }, { status: 502 });
    const data: unknown = await response.json(); const rows = Array.isArray(data) ? data.filter(obj) : [];
    const seen = new Set<string>();
    const results = rows.map((row) => {
      const item = obj(row.data) ? row.data : {}; const addressId = text(item.id); const accessAddressId = text(item.adgangsadresseid) || addressId;
      return { id: accessAddressId, addressId, accessAddressId, address: text(row.tekst) || text(row.forslagstekst) || text(item.adressebetegnelse) };
    }).filter((item) => item.id && item.address && !seen.has(item.id) && Boolean(seen.add(item.id))).slice(0, 5);
    return NextResponse.json({ country: "DK", query, source: "Dataforsyningen / DAR", idSemantics: "id is the canonical access-address ID for downstream tools", results });
  } catch { return NextResponse.json({ country: "DK", query, results: [], error: "address_search_failed" }, { status: 502 }); }
}
