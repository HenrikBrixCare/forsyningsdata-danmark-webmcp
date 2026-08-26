import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "@/lib/data/address";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim() ?? ""; if (!id) return NextResponse.json({ ok: false, error: "missing_address_id" }, { status: 400 });
  const address = await getAddress(id); if (!address) return NextResponse.json({ ok: false, country: "DK", addressId: id, error: "address_not_found" }, { status: 404 });
  return NextResponse.json({
    ok: true, country: "DK", addressId: address.id, address: address.label,
    coordinates: address.lon !== null && address.lat !== null ? { lon: address.lon, lat: address.lat, srid: 4326 } : null,
    soilContamination: { checked: false, found: false, status: "manual_original_source_check", source: "Danmarks Arealinformation / regional soil-contamination data", mapUrl: "https://arealinformation.miljoeportal.dk/", note: "The live product has a dedicated screening adapter; it is intentionally excluded from this scoped public challenge export." },
    climateAndGroundwater: { checked: false, found: false, screeningLevel: "manual_original_source_check", source: "KAMP / HIP", kampUrl: "https://kamp.klimatilpasning.dk/", hipUrl: "https://hip.dataforsyningen.dk/", note: "No final risk conclusion is generated from missing public-export adapters." },
    limitations: ["A missing automated check is never presented as no risk.", "Environmental and groundwater decisions must be confirmed in the named original sources."]
  });
}
