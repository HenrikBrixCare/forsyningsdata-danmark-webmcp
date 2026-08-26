import { NextRequest, NextResponse } from "next/server";
import { getAddress, getParcel } from "@/lib/data/address";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim() ?? "";
  if (!id) return NextResponse.json({ ok: false, country: "DK", error: "missing_address_id" }, { status: 400 });
  try {
    const address = await getAddress(id);
    if (!address) return NextResponse.json({ ok: false, country: "DK", addressId: id, error: "address_not_found" }, { status: 404 });
    const parcel = await getParcel(address.lon, address.lat);
    return NextResponse.json({
      ok: true,
      country: "DK",
      addressId: address.id,
      accessAddressId: address.accessAddressId,
      address: { label: address.label, street: address.street, houseNumber: address.houseNumber, postalCode: address.postalCode, city: address.city, municipality: address.municipality, municipalityCode: address.municipalityCode, coordinates: address.lon !== null && address.lat !== null ? { lon: address.lon, lat: address.lat, srid: 4326 } : null },
      property: { checked: Boolean(parcel), parcelFound: Boolean(parcel), bbrFound: false, configurationMissing: true, parcelNumber: parcel?.parcelNumber ?? "", cadastralDistrict: parcel?.cadastralDistrict ?? "", municipality: parcel?.municipality ?? "", lotAreaM2: parcel?.lotAreaM2 ?? null, bfeNumber: parcel?.bfeNumber ?? "", buildingCount: 0, mainBuilding: null },
      sources: [{ name: "Dataforsyningen / DAR", purpose: "Official address and coordinates" }, { name: "Dataforsyningen Matriklen", purpose: "Parcel and cadastral basis", url: parcel?.sourceUrl ?? "https://dataforsyningen.dk/" }],
      profilePath: `/adresse/${encodeURIComponent(address.id)}`,
      limitations: ["This public challenge export intentionally omits private/commercial adapters and credentials.", "BBR building details are not required to review the WebMCP integration and are therefore not included in this scoped public export."]
    });
  } catch { return NextResponse.json({ ok: false, country: "DK", addressId: id, error: "address_overview_failed" }, { status: 502 }); }
}
