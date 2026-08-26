import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "@/lib/data/address";

const WMS_URL = "https://api.dataforsyningen.dk/wms/forvaltning2";
const WMTS_URL = "https://api.dataforsyningen.dk/wmts/forvaltning2";

const layers = [
  {
    id: "sagsbehandlingskortet",
    name: "Sagsbehandlingskortet",
    services: ["WMS", "WMTS"],
    role: "Official background/context map for address and casework.",
    useCases: ["adresseoverblik", "sagsbehandling", "kortkontrol"],
    status: "tilsluttet",
    structuredConclusionReady: true,
  },
  {
    id: "matrikelskel",
    name: "Matrikelskel",
    services: ["WMS", "WMTS"],
    role: "Visual parcel-boundary context around the property.",
    useCases: ["adresseoverblik", "graveforberedelse", "dokumentation", "kortkontrol"],
    status: "visuelt-lag",
    structuredConclusionReady: false,
  },
  {
    id: "dagi-graenser",
    name: "DAGI kommune- og regionsgrænser",
    services: ["WMS", "WMTS"],
    role: "Visual administrative context for selecting the correct local sources.",
    useCases: ["adresseoverblik", "sagsbehandling", "dokumentation"],
    status: "visuelt-lag",
    structuredConclusionReady: false,
  },
  {
    id: "stednavne-vejnavne-adresser",
    name: "Stednavne, vejnavne og adresser",
    services: ["WMS", "WMTS"],
    role: "Official visual place/address context around the search.",
    useCases: ["adresseoverblik", "sagsbehandling", "kortkontrol"],
    status: "visuelt-lag",
    structuredConclusionReady: false,
  },
  {
    id: "forvaltningstemaer-geodanmark",
    name: "Forvaltningstemaer fra GeoDanmark",
    services: ["WMS", "WMTS"],
    role: "Additional visual management themes for casework and project context.",
    useCases: ["sagsbehandling", "graveforberedelse", "dokumentation", "kortkontrol"],
    status: "kraever-validering",
    structuredConclusionReady: false,
  },
];

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

  return NextResponse.json({
    ok: true,
    country: "DK",
    addressId: address.id,
    address: address.label,
    point: address.lon !== null && address.lat !== null ? { lon: address.lon, lat: address.lat } : null,
    source: {
      id: "dataforsyningen-forvaltning-sagsbehandling",
      name: "Dataforsyningen / Forvaltning og Sagsbehandling",
      description: "Official WMS/WMTS map layers for casework, map control and visual address context.",
      datasetUrl: "https://dataforsyningen.dk/data/2680",
      metadataUrl: "https://datavejviser.dk/katalog/klimadatastyrelsen/420bcfba-c98f-4c09-8b7b-88c18534f952",
      wmsCapabilitiesUrl: `${WMS_URL}?service=WMS&request=GetCapabilities`,
      wmtsCapabilitiesUrl: `${WMTS_URL}?service=WMTS&request=GetCapabilities`,
    },
    layers,
    limitations: [
      "WMS/WMTS are primarily map images/tiles and are not automatically structured conclusions.",
      "Hard conclusions require a validated feature source, documented GetFeatureInfo result or another structured original source.",
      "Exact excavation-safe utility geometry is outside this scoped public challenge export.",
    ],
    nextTechnicalSteps: [
      "Render selected WMTS/WMS layers on the human-readable address profile.",
      "Use GetFeatureInfo only for layers where the source contract and returned fields have been validated.",
    ],
  });
}
