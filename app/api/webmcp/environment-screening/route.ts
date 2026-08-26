import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "@/lib/data/address";
import { hentJordforurening } from "@/lib/data/jordforurening";
import { hentKlimadata } from "@/lib/data/klima";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim() ?? "";
  if (!id) {
    return NextResponse.json(
      { ok: false, country: "DK", error: "missing_address_id", message: "Provide an address ID returned by find_address." },
      { status: 400 },
    );
  }

  try {
    const address = await getAddress(id);
    if (!address) {
      return NextResponse.json({ ok: false, country: "DK", addressId: id, error: "address_not_found" }, { status: 404 });
    }

    const [soil, climate] = await Promise.all([
      hentJordforurening({ lon: address.lon, lat: address.lat }),
      hentKlimadata({ lon: address.lon, lat: address.lat }),
    ]);

    return NextResponse.json({
      ok: true,
      country: "DK",
      addressId: address.id,
      address: address.label,
      coordinates: address.lon !== null && address.lat !== null ? { lon: address.lon, lat: address.lat, srid: 4326 } : null,
      soilContamination: {
        checked: soil.kontrolleret,
        found: soil.fundet,
        status: soil.status,
        findingCount: soil.antalFund,
        layers: soil.lag,
        source: soil.kilde,
        sourceUrl: soil.kildeUrl,
        mapUrl: soil.kortUrl,
        note: soil.note,
      },
      climateAndGroundwater: {
        checked: climate.kontrolleret,
        found: climate.fundet,
        screeningLevel: climate.risikoNiveau,
        shallowGroundwaterStatus: climate.terraennaertGrundvandStatus,
        depressionsStatus: climate.lavningerStatus,
        floodingStatus: climate.oversvoemmelseStatus,
        dataQuality: climate.datakvalitet,
        screeningTopics: climate.screeningspunkter,
        nextSteps: climate.naesteSkridt,
        source: climate.kilde,
        sourceUrl: climate.kildeUrl,
        hipUrl: climate.hipUrl,
        kampUrl: climate.kampUrl,
        note: climate.note,
      },
      limitations: [
        "The soil check is an orienting screening against public V1/V2 layers at the address point and must be confirmed in official regional/DKJord information before purchase, excavation or authority decisions.",
        "Climate and groundwater output is currently screening readiness unless concrete KAMP/HIP datasets are connected; it must not be presented as a final risk assessment.",
      ],
    });
  } catch {
    return NextResponse.json({ ok: false, country: "DK", addressId: id, error: "environment_screening_failed" }, { status: 502 });
  }
}
