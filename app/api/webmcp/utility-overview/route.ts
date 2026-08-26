import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "@/lib/data/address";
import { hentKloakOplandFraPlandata } from "@/lib/data/plandata-kloak";

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

    const sewer = await hentKloakOplandFraPlandata({ lon: address.lon, lat: address.lat });

    return NextResponse.json({
      ok: true,
      country: "DK",
      addressId: address.id,
      address: address.label,
      municipality: address.municipality,
      utilities: {
        sewer: {
          planningAreaFound: sewer.fundet,
          currentType: sewer.aktuelKloaktype,
          plannedType: sewer.planlagtKloaktype,
          plannedStartYear: sewer.startaar,
          plannedEffectiveYear: sewer.ikraftaar,
          ownership: sewer.ejerforhold,
          planName: sewer.plannavn,
          planId: sewer.planid,
          source: sewer.kilde,
          sourceUrl: sewer.kildeUrl,
        },
        drainage: {
          status: "source_handoff",
          source: "BBR via Datafordeleren",
          includedInPublicExport: false,
          note: "Property-level BBR drainage details are intentionally outside the scoped public challenge export. The workflow surfaces the original-source handoff instead of fabricating a value or reporting a configuration error.",
        },
        water: {
          status: "human_follow_up",
          source: "Municipality / local water utility",
          note: "Exact local supply details are handed back to the named original municipal/utility source in the scoped public export.",
        },
        gas: {
          status: "source_handoff",
          source: "Evida public map",
          sourceUrl: "https://gis.evida.dk/",
          note: "No property-specific gas conclusion is made here. Nearby network context and service connection must be checked in the original source.",
        },
      },
      limitations: [
        "Utility information is decision support and must be checked against original utility or authority sources before excavation or design.",
        "The sewer result is selected against the verified address coordinate; exact on-property pipe geometry is not provided by this tool.",
        "Credential-based or proprietary local adapters are intentionally outside the scoped public challenge export and are not silently simulated.",
      ],
      profilePath: `/adresse/${encodeURIComponent(address.id)}`,
    });
  } catch {
    return NextResponse.json({ ok: false, country: "DK", addressId: id, error: "utility_overview_failed" }, { status: 502 });
  }
}
