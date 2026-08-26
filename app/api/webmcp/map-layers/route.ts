import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "@/lib/data/address";

const layers = [
  { id: "sagsbehandlingskort", name: "Sagsbehandlingskort", services: ["WMS", "WMTS"], role: "Background/context map", status: "tilsluttet", structuredConclusionReady: true },
  { id: "matrikelskel", name: "Matrikelskel", services: ["WMS", "WMTS"], role: "Parcel boundary context", status: "tilsluttet", structuredConclusionReady: true },
  { id: "dagi-graenser", name: "DAGI kommune- og regionsgrænser", services: ["WMS", "WMTS"], role: "Administrative context", status: "visuelt-lag", structuredConclusionReady: false },
  { id: "stednavne-adresser", name: "Stednavne, vejnavne og adresser", services: ["WMS", "WMTS"], role: "Address context", status: "visuelt-lag", structuredConclusionReady: false }
];

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim() ?? ""; if (!id) return NextResponse.json({ ok: false, error: "missing_address_id" }, { status: 400 });
  const address = await getAddress(id); if (!address) return NextResponse.json({ ok: false, country: "DK", addressId: id, error: "address_not_found" }, { status: 404 });
  return NextResponse.json({
    ok: true, country: "DK", addressId: address.id, address: address.label,
    point: address.lon !== null && address.lat !== null ? { lon: address.lon, lat: address.lat } : null,
    source: { id: "dataforsyningen-forvaltning-sagsbehandling", name: "Dataforsyningen / Forvaltning og Sagsbehandling", datasetUrl: "https://dataforsyningen.dk/", wmsCapabilitiesUrl: "https://api.dataforsyningen.dk/wms/forvaltning?service=WMS&request=GetCapabilities" },
    layers,
    limitations: ["WMS/WMTS are primarily visual map services; not every visual layer is suitable for an automatic structured conclusion.", "Exact excavation-safe utility geometry is outside this scoped public challenge export."],
    nextTechnicalSteps: ["Render selected layers on the human-readable address profile.", "Use feature queries only where the source contract supports structured conclusions."]
  });
}
