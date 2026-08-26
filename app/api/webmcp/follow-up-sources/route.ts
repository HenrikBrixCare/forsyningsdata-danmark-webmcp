import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "@/lib/data/address";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim() ?? "";
  if (!id) {
    return NextResponse.json(
      { ok: false, country: "DK", error: "missing_address_id", message: "Provide an address ID returned by find_address." },
      { status: 400 },
    );
  }

  const address = await getAddress(id);
  if (!address) {
    return NextResponse.json({ ok: false, country: "DK", addressId: id, error: "address_not_found" }, { status: 404 });
  }

  const hasAalborgAdapter = address.municipality.toLocaleLowerCase("da-DK").includes("aalborg");
  const sources = hasAalborgAdapter
    ? [
        {
          name: "MinKloak",
          category: "Kloak",
          status: "Active local portal",
          url: "https://www.minkloak.dk/",
          automatic: false,
          usefulFor: ["lokale kloakforhold", "stik og brønde", "manuel kontrol"],
        },
        {
          name: "MitVand",
          category: "Vand",
          status: "Active local portal",
          url: "https://mitvand.dk/",
          automatic: false,
          usefulFor: ["vandtilslutning", "lokale vandoplysninger"],
        },
        {
          name: "Aalborg Kommune – byggesager og bolig",
          category: "Byggesag",
          status: "Municipal document/source handoff",
          url: "https://www.aalborg.dk/mit-liv/min-bolig",
          automatic: false,
          usefulFor: ["historiske tegninger", "byggesager", "myndighedskontrol"],
        },
      ]
    : [
        {
          name: `${address.municipality || "Relevant"} kommune`,
          category: "Kommune",
          status: "Generic original-source handoff",
          url: "https://www.borger.dk/",
          automatic: false,
          usefulFor: ["find lokal myndighedskilde", "byggesager", "lokale krav"],
        },
      ];

  return NextResponse.json({
    ok: true,
    country: "DK",
    addressId: address.id,
    address: address.label,
    municipality: address.municipality,
    localAdapter: {
      found: hasAalborgAdapter,
      status: hasAalborgAdapter ? "Municipality-specific source set" : "Generic municipal handoff only",
      note: hasAalborgAdapter
        ? "A municipality-specific public source set is available for this demo address."
        : "No municipality-specific adapter is claimed in the scoped public export; use the generic handoff to locate the original local source.",
    },
    sources,
    documentCheck: {
      found: hasAalborgAdapter,
      status: hasAalborgAdapter ? "manual_check_recommended" : "original_source_lookup_required",
      archiveStatus: hasAalborgAdapter ? "Municipal source handoff available" : "Locate the relevant municipal archive/source",
      whyItMatters: "Historic drawings and permits may matter before renovation or excavation.",
      documentTypes: ["Byggesager", "Afløbstegninger", "Renoveringshistorik"],
      checks: ["Check drawings", "Check permits", "Compare with current conditions"],
      risks: ["Historic documents may be incomplete or outdated"],
      nextSteps: ["Open the original municipal/archive source when exact documentation matters"],
    },
    recommendedHumanActions: [
      "Open the named original local source before relying on exact pipe location or drawings.",
      "Confirm authority requirements before excavation or design.",
    ],
    handoffRule:
      "Use WebMCP to collect and structure available evidence; use original sources when the decision depends on exact geometry, drawings, permits or authority requirements.",
    profilePath: `/adresse/${encodeURIComponent(address.id)}`,
  });
}
