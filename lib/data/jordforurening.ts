type JsonRecord = Record<string, unknown>;

type ArcGisFeature = { attributes?: JsonRecord };
type ArcGisQueryResponse = { features?: ArcGisFeature[]; error?: unknown };
type JordLagResultat = { navn: string; antal: number; detaljer: string[] };

export type JordforureningResultat = {
  kontrolleret: boolean;
  fundet: boolean;
  status: string;
  antalFund: number;
  lag: string[];
  kilde: string;
  kildeUrl: string;
  kortUrl: string;
  note: string;
};

const DMP_FEATURE_BASE =
  "https://kort.vd.dk/server/rest/services/Vejkort/Danmarks_Milj%C3%B8_Portal/FeatureServer";

const JORD_LAG = [
  { id: 30, navn: "Jordforurening - V1 kortlagt" },
  { id: 31, navn: "Jordforurening - V2 kortlagt" },
] as const;

function erObjekt(value: unknown): value is JsonRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function tekst(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function erLagResultat(value: JordLagResultat | null): value is JordLagResultat {
  return value !== null;
}

function tomt(overrides: Partial<JordforureningResultat> = {}): JordforureningResultat {
  return {
    kontrolleret: false,
    fundet: false,
    status: "",
    antalFund: 0,
    lag: [],
    kilde: "Danmarks Miljøportal / DKJord",
    kildeUrl:
      "https://kort.vd.dk/server/rest/services/Vejkort/Danmarks_Milj%C3%B8_Portal/FeatureServer/layers",
    kortUrl: "https://arealinformation.miljoeportal.dk/",
    note:
      "Screening mod offentlige jordforureningslag. Resultatet skal kontrolleres i regionens eller DKJords officielle oplysninger før køb, gravning eller myndighedssag.",
    ...overrides,
  };
}

function statusFraFund(fundneLag: string[]) {
  if (fundneLag.some((lag) => lag.includes("V2"))) return "V2 – dokumenteret jordforurening";
  if (fundneLag.some((lag) => lag.includes("V1"))) return "V1 – mistanke om mulig jordforurening";
  return "Jordforureningsoplysninger fundet";
}

function opsummerAttributter(attributes: JsonRecord) {
  return [
    tekst(attributes.Lokalitetetsforureningsstatus),
    tekst(attributes.Lokalitetetsadresse),
    tekst(attributes.Regionsnavn),
  ].filter(Boolean).join(" · ");
}

async function queryLag({ layerId, navn, lon, lat }: { layerId: number; navn: string; lon: number; lat: number }): Promise<JordLagResultat | null> {
  const url = new URL(`${DMP_FEATURE_BASE}/${layerId}/query`);
  url.searchParams.set("where", "1=1");
  url.searchParams.set("geometry", `${lon},${lat}`);
  url.searchParams.set("geometryType", "esriGeometryPoint");
  url.searchParams.set("inSR", "4326");
  url.searchParams.set("spatialRel", "esriSpatialRelIntersects");
  url.searchParams.set("outFields", "*");
  url.searchParams.set("returnGeometry", "false");
  url.searchParams.set("f", "json");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json", "User-Agent": "Forsyningsdata-Danmark-WebMCP/1.0" },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = (await response.json()) as ArcGisQueryResponse;
    if (data.error || !Array.isArray(data.features)) return null;
    const features = data.features.filter((feature) => erObjekt(feature.attributes));
    return {
      navn,
      antal: features.length,
      detaljer: features.map((feature) => opsummerAttributter(feature.attributes ?? {})).filter(Boolean).slice(0, 3),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function hentJordforurening({ lon, lat }: { lon: number | null; lat: number | null }): Promise<JordforureningResultat> {
  if (lon === null || lat === null) return tomt();

  const resultater = await Promise.all(JORD_LAG.map((lag) => queryLag({ layerId: lag.id, navn: lag.navn, lon, lat })));
  const kontrolleredeLag = resultater.filter(erLagResultat);
  if (kontrolleredeLag.length === 0) {
    return tomt({ note: "Jordforureningslaget kunne ikke kontrolleres sikkert ved dette opslag. Kilden er gjort klar, men svaret fra GIS-tjenesten kunne ikke valideres." });
  }

  const fundneLag = kontrolleredeLag.filter((resultat) => resultat.antal > 0).map((resultat) => resultat.navn);
  const antalFund = kontrolleredeLag.reduce((sum, resultat) => sum + resultat.antal, 0);
  const detaljer = kontrolleredeLag.flatMap((resultat) => resultat.detaljer);

  if (antalFund === 0) {
    return tomt({
      kontrolleret: true,
      note: "Der blev ikke fundet V1- eller V2-kortlagt jordforurening på selve adressepunktet i den orienterende DKJord-screening.",
    });
  }

  return tomt({
    kontrolleret: true,
    fundet: true,
    status: statusFraFund(fundneLag),
    antalFund,
    lag: fundneLag,
    note: `${detaljer.length ? `${detaljer.join(" · ")}. ` : ""}Screening mod offentlige jordforureningslag. Resultatet skal kontrolleres i regionens eller DKJords officielle oplysninger før køb, gravning eller myndighedssag.`,
  });
}
