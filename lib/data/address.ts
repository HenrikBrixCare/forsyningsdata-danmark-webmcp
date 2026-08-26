type JsonRecord = Record<string, unknown>;
function obj(value: unknown): value is JsonRecord { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
function text(value: unknown) { return typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : ""; }
function num(value: unknown) { return typeof value === "number" && Number.isFinite(value) ? value : null; }

export type Address = { id: string; accessAddressId: string; label: string; street: string; houseNumber: string; postalCode: string; city: string; municipality: string; municipalityCode: string; lon: number | null; lat: number | null };

async function json(url: URL): Promise<unknown> {
  const response = await fetch(url.toString(), { cache: "no-store", headers: { Accept: "application/json" } });
  return response.ok ? response.json() : null;
}

export async function getAddress(id: string): Promise<Address | null> {
  const accessUrl = new URL(`https://api.dataforsyningen.dk/adgangsadresser/${encodeURIComponent(id)}`);
  accessUrl.searchParams.set("struktur", "nestet");
  const data = await json(accessUrl);
  if (!obj(data)) return null;
  const post = obj(data.postnummer) ? data.postnummer : {};
  const road = obj(data.vejstykke) ? data.vejstykke : {};
  const municipality = obj(road.kommune) ? road.kommune : obj(data.kommune) ? data.kommune : {};
  const point = obj(data.adgangspunkt) ? data.adgangspunkt : {};
  const coordinates = Array.isArray(point.koordinater) ? point.koordinater : [];
  const canonicalId = text(data.id) || id;
  return {
    id: canonicalId,
    accessAddressId: canonicalId,
    label: text(data.adressebetegnelse),
    street: text(road.navn),
    houseNumber: text(data.husnr),
    postalCode: text(post.nr),
    city: text(post.navn),
    municipality: text(municipality.navn),
    municipalityCode: text(municipality.kode),
    lon: num(coordinates[0]),
    lat: num(coordinates[1])
  };
}

export async function getParcel(lon: number | null, lat: number | null) {
  if (lon === null || lat === null) return null;
  const url = new URL("https://api.dataforsyningen.dk/jordstykker");
  url.searchParams.set("x", String(lon)); url.searchParams.set("y", String(lat)); url.searchParams.set("srid", "4326"); url.searchParams.set("struktur", "nestet"); url.searchParams.set("per_side", "5");
  const data = await json(url); if (!Array.isArray(data)) return null;
  const row = data.find(obj); if (!row) return null;
  const cadastral = obj(row.ejerlav) ? row.ejerlav : {};
  const municipality = obj(row.kommune) ? row.kommune : {};
  return { parcelNumber: text(row.matrikelnr), cadastralDistrict: text(cadastral.navn), municipality: text(municipality.navn), lotAreaM2: typeof row.registreretareal === "number" ? row.registreretareal : null, bfeNumber: text(row.bfenummer), sourceUrl: url.toString() };
}
