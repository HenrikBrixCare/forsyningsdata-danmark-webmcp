import { getAddress, getParcel } from "@/lib/data/address";
import { notFound } from "next/navigation";

export default async function AddressProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const address = await getAddress(id); if (!address) notFound();
  const parcel = await getParcel(address.lon, address.lat);
  const cards = [
    ["Adressevurdering", "Verified Danish address", `Coordinates: ${address.lon ?? "—"}, ${address.lat ?? "—"}`],
    ["Kloak & regnvand", "Planning and drainage context", "Use the WebMCP utility tool for the structured Plandata result and preserve the original-source limitation."],
    ["Vand", "Water-supply context", "The public challenge export hands exact local water details back to original municipal/utility sources."],
    ["Andre ledninger", "Other utilities", "Gas and other network context is orienting only; proximity is not proof of a property connection."],
    ["Ejendomsgrundlag", "Parcel basis", `${parcel?.parcelNumber || "No parcel result"} · BFE ${parcel?.bfeNumber || "—"} · ${parcel?.lotAreaM2 ?? "—"} m²`],
    ["Dataforsyningen", "Official map layers", "WMS/WMTS layers are exposed with an explicit distinction between visual context and structured conclusions."],
    ["Lokale kilder", "Original local sources", "When exact pipe location, drawings or authority requirements matter, the workflow opens the named original source."],
    ["Dokumentgrundlag", "Historic documents", "Building files, drainage drawings and permits remain human-verification steps when they matter to the decision."],
    ["Fjernvarme & tele/fiber", "Additional utility context", "This scoped repository demonstrates the WebMCP contract while keeping unrelated private adapters out of the public export."],
    ["Jord & klima", "Environmental screening", "Missing automated data is never converted into a false ‘no risk’ conclusion; original KAMP/HIP/soil sources are surfaced instead."]
  ];
  return (
    <main className="shell">
      <p><a className="source-link" href="/">← New address search</a></p>
      <header className="profile-header"><div className="eyebrow">Address profile</div><h1>{address.label}</h1><p className="muted">{address.municipality} · {address.postalCode} {address.city} · {address.lon}, {address.lat}</p></header>
      <section className="grid">
        {cards.map(([kicker, title, body]) => <article className="data-card" key={kicker}><div className="card-kicker">{kicker}</div><h2>{title}</h2><p className="muted">{body}</p></article>)}
      </section>
      <p className="muted" style={{ marginTop: 24 }}>This is the scoped public challenge profile. The live challenge preview integrates the same WebMCP interaction model with the pre-existing private product data layer.</p>
    </main>
  );
}
