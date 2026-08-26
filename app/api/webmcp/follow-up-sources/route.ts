import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "@/lib/data/address";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim() ?? ""; if (!id) return NextResponse.json({ ok: false, error: "missing_address_id" }, { status: 400 });
  const address = await getAddress(id); if (!address) return NextResponse.json({ ok: false, country: "DK", addressId: id, error: "address_not_found" }, { status: 404 });
  const aalborg = address.municipality.toLocaleLowerCase("da-DK").includes("aalborg");
  const sources = aalborg ? [
    { name: "MinKloak", category: "Kloak", status: "Active local portal", url: "https://www.minkloak.dk/", automatic: false, usefulFor: ["lokale kloakforhold", "stik og brønde", "manual kontrol"] },
    { name: "MitVand", category: "Vand", status: "Active local portal", url: "https://mitvand.dk/", automatic: false, usefulFor: ["vandtilslutning", "lokale vandoplysninger"] },
    { name: "Aalborg byggesagsarkiv", category: "Byggesag", status: "Document archive", url: "https://www.aalborg.dk/", automatic: false, usefulFor: ["historiske tegninger", "byggesager", "dokumentation"] }
  ] : [
    { name: `${address.municipality} kommune`, category: "Kommune", status: "Manual original-source lookup", url: "https://www.borger.dk/", automatic: false, usefulFor: ["lokale krav", "byggesager", "myndighedskontrol"] }
  ];
  return NextResponse.json({
    ok: true, country: "DK", addressId: address.id, address: address.label, municipality: address.municipality,
    localAdapter: { found: sources.length > 0, status: aalborg ? "Municipality-specific source set" : "Generic municipal handoff", note: "The scoped public export demonstrates the WebMCP handoff contract without publishing proprietary adapters." },
    sources,
    documentCheck: { found: true, status: "manual_check_recommended", archiveStatus: aalborg ? "Local municipal archive available" : "Check municipal archive", whyItMatters: "Historic drawings and permits may matter before renovation or excavation.", documentTypes: ["Byggesager", "Afløbstegninger", "Renoveringshistorik"], checks: ["Check drawings", "Check permits", "Compare with current conditions"], risks: ["Historic documents may be incomplete or outdated"], nextSteps: ["Open the original archive when exact documentation matters"] },
    recommendedHumanActions: ["Open the named original local source before relying on exact pipe location or drawings.", "Confirm authority requirements before excavation or design."],
    handoffRule: "Use WebMCP to collect and structure available evidence; use original sources when the decision depends on exact geometry, drawings, permits or authority requirements.",
    profilePath: `/adresse/${encodeURIComponent(address.id)}`
  });
}
