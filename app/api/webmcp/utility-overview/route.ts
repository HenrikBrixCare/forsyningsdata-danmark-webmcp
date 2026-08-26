import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "@/lib/data/address";

async function sewer(lon: number | null, lat: number | null) {
  if (lon === null || lat === null) return null;
  const url = new URL("https://geoserver.plandata.dk/geoserver/ows"); const m = 0.00015;
  url.searchParams.set("service", "WFS"); url.searchParams.set("version", "1.0.0"); url.searchParams.set("request", "GetFeature"); url.searchParams.set("typeName", "pdk:theme_pdk_kloakopland_vedtaget"); url.searchParams.set("outputFormat", "application/json"); url.searchParams.set("srsName", "EPSG:4326"); url.searchParams.set("maxFeatures", "5"); url.searchParams.set("bbox", `${lon-m},${lat-m},${lon+m},${lat+m},EPSG:4326`);
  try { const response = await fetch(url.toString(), { cache: "no-store", headers: { Accept: "application/json" } }); if (!response.ok) return null; const data = await response.json(); const feature = Array.isArray(data?.features) ? data.features[0] : null; return feature?.properties ?? null; } catch { return null; }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim() ?? ""; if (!id) return NextResponse.json({ ok: false, error: "missing_address_id" }, { status: 400 });
  const address = await getAddress(id); if (!address) return NextResponse.json({ ok: false, country: "DK", addressId: id, error: "address_not_found" }, { status: 404 });
  const p = await sewer(address.lon, address.lat);
  return NextResponse.json({
    ok: true, country: "DK", addressId: address.id, address: address.label, municipality: address.municipality,
    utilities: {
      sewer: { planningAreaFound: Boolean(p), currentType: p?.nuvtekst ?? "", plannedType: p?.plantekst ?? "", plannedStartYear: p?.startaar ?? null, plannedEffectiveYear: p?.ikraftaar ?? null, ownership: p?.ejertekst ?? "", planName: p?.plannr ?? p?.plannavn ?? "", source: "Plandata.dk – vedtaget kloakopland", sourceUrl: p?.doklink ?? p?.weblink ?? "https://www.plandata.dk/" },
      water: { status: "human_follow_up", source: "Municipality / local water utility", note: "The scoped public challenge export keeps proprietary municipality adapters private." },
      gas: { status: "orienting_only", source: "Evida public map", sourceUrl: "https://gis.evida.dk/", note: "Nearby network context is not proof of a service connection." }
    },
    limitations: ["Utility information is decision support and must be checked against original utility or authority sources before excavation or design.", "This scoped public export intentionally omits proprietary local adapter logic."],
    profilePath: `/adresse/${encodeURIComponent(address.id)}`
  });
}
