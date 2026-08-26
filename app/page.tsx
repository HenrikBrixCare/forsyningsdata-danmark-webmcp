import LocalizedChallengeHero from "./components/LocalizedChallengeHero";

export default function HomePage() {
  return (
    <main className="shell">
      <LocalizedChallengeHero />

      <section className="grid">
        <article className="data-card"><div className="card-kicker">Agent-ready</div><h2>10 typed actions</h2><p className="muted">Find an address, retrieve structured context, open the visible profile, focus the section being discussed and switch interface language.</p></article>
        <article className="data-card"><div className="card-kicker">Human in the loop</div><h2>Same workflow, two views</h2><p className="muted">Structured tool output and the human-readable profile stay connected instead of replacing each other.</p></article>
        <article className="data-card"><div className="card-kicker">Trust</div><h2>Sources + limitations</h2><p className="muted">Decision-support output preserves original-source attribution and does not turn screening into unsupported certainty.</p></article>
        <article className="data-card"><div className="card-kicker">Country connectors</div><h2>Denmark live. Pattern global.</h2><p className="muted">The challenge activates Danish data only. Country and interface language are separate so future connectors can be added without pretending planned coverage is already live.</p></article>
      </section>

      <p className="muted" style={{ marginTop: 32 }}>
        Address and parcel data attribution: (CC BY 4.0) Klimadatastyrelsen via Dataforsyningen.
        {" "}<a className="source-link" href="https://dataforsyningen.dk/terms" target="_blank" rel="noreferrer">Terms</a>
      </p>
    </main>
  );
}
