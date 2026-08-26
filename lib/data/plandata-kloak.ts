type JsonRecord = Record<string, unknown>;

type GeoJsonGeometry = {
  type?: unknown;
  coordinates?: unknown;
};

export type KloakOpland = {
  fundet: boolean;
  aktuelKloaktype: string;
  planlagtKloaktype: string;
  startaar: number | null;
  ikraftaar: number | null;
  ejerforhold: string;
  kommune: string;
  plannavn: string;
  planid: string;
  doklink: string;
  weblink: string;
  kilde: string;
  kildeUrl: string;
};

function erObjekt(value: unknown): value is JsonRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function tekst(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function tal(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return null;
}

function punktIRing(lon: number, lat: number, ring: unknown) {
  if (!Array.isArray(ring) || ring.length < 3) return false;
  let inde = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i];
    const b = ring[j];
    if (!Array.isArray(a) || !Array.isArray(b)) continue;
    if (typeof a[0] !== "number" || typeof a[1] !== "number" || typeof b[0] !== "number" || typeof b[1] !== "number") continue;
    const xi = a[0]; const yi = a[1]; const xj = b[0]; const yj = b[1];
    const skaerer = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi || Number.EPSILON) + xi;
    if (skaerer) inde = !inde;
  }
  return inde;
}

function punktIPolygon(lon: number, lat: number, coordinates: unknown) {
  if (!Array.isArray(coordinates) || coordinates.length === 0) return false;
  if (!punktIRing(lon, lat, coordinates[0])) return false;
  for (let i = 1; i < coordinates.length; i += 1) {
    if (punktIRing(lon, lat, coordinates[i])) return false;
  }
  return true;
}

function indeholderPunkt(geometry: GeoJsonGeometry, lon: number, lat: number) {
  const type = tekst(geometry.type);
  const coordinates = geometry.coordinates;
  if (type === "Polygon") return punktIPolygon(lon, lat, coordinates);
  if (type === "MultiPolygon" && Array.isArray(coordinates)) {
    return coordinates.some((polygon) => punktIPolygon(lon, lat, polygon));
  }
  return false;
}

function tomtResultat(): KloakOpland {
  return {
    fundet: false,
    aktuelKloaktype: "",
    planlagtKloaktype: "",
    startaar: null,
    ikraftaar: null,
    ejerforhold: "",
    kommune: "",
    plannavn: "",
    planid: "",
    doklink: "",
    weblink: "",
    kilde: "Plandata.dk – vedtaget kloakopland",
    kildeUrl: "https://www.plandata.dk/",
  };
}

export async function hentKloakOplandFraPlandata({ lon, lat }: { lon: number | null; lat: number | null }): Promise<KloakOpland> {
  if (lon === null || lat === null) return tomtResultat();

  const url = new URL("https://geoserver.plandata.dk/geoserver/ows");
  const margin = 0.00015;
  url.searchParams.set("service", "WFS");
  url.searchParams.set("version", "1.0.0");
  url.searchParams.set("request", "GetFeature");
  url.searchParams.set("typeName", "pdk:theme_pdk_kloakopland_vedtaget");
  url.searchParams.set("outputFormat", "application/json");
  url.searchParams.set("srsName", "EPSG:4326");
  url.searchParams.set("maxFeatures", "25");
  url.searchParams.set("bbox", `${lon - margin},${lat - margin},${lon + margin},${lat + margin},EPSG:4326`);

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json", "User-Agent": "Forsyningsdata-Danmark-WebMCP/1.0" },
      cache: "no-store",
    });
    if (!response.ok) return tomtResultat();
    const data: unknown = await response.json();
    if (!erObjekt(data) || !Array.isArray(data.features)) return tomtResultat();
    const features = data.features.filter(erObjekt);
    const match = features.find((feature) => {
      const geometry = erObjekt(feature.geometry) ? feature.geometry : null;
      return geometry ? indeholderPunkt(geometry, lon, lat) : false;
    }) ?? features[0];
    if (!match) return tomtResultat();

    const props = erObjekt(match.properties) ? match.properties : {};
    const doklink = tekst(props.doklink);
    const weblink = tekst(props.weblink);
    return {
      fundet: true,
      aktuelKloaktype: tekst(props.nuvtekst),
      planlagtKloaktype: tekst(props.plantekst),
      startaar: tal(props.startaar),
      ikraftaar: tal(props.ikraftaar),
      ejerforhold: tekst(props.ejertekst),
      kommune: tekst(props.komnavn),
      plannavn: tekst(props.plannr) || tekst(props.plannavn),
      planid: tekst(props.planid) || tekst(props.elementid),
      doklink,
      weblink,
      kilde: "Plandata.dk – vedtaget kloakopland",
      kildeUrl: doklink || weblink || "https://www.plandata.dk/",
    };
  } catch {
    return tomtResultat();
  }
}
