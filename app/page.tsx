export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="eyebrow">OpenAI WebMCP Challenge 2026</div>
        <h1>One address. Structured tools for agents — visible context for humans.</h1>
        <p>
          This scoped public demo exposes Danish address, property, utility, environment,
          map-layer and source actions through WebMCP. The active data country remains Denmark,
          while the interface language can change independently.
        </p>
        <div className="actions">
          <a className="button" href="/webmcp-test">Open WebMCP diagnostics</a>
          <a className="button" href="/adresse/0a3f509c-e673-32b8-e044-0003ba298018">Open demo address</a>
        </div>
      </section>

      <section className="grid">
        <article className="data-card"><div className="card-kicker">Agent-ready</div><h2>10 typed actions</h2><p className="muted">Find an address, retrieve structured context, open the visible profile, focus the section being discussed and switch interface language.</p></article>
        <article className="data-card"><div className="card-kicker">Human in the loop</div><h2>Same workflow, two views</h2><p className="muted">Structured tool output and the human-readable profile stay connected instead of replacing each other.</p></article>
        <article className="data-card"><div className="card-kicker">Trust</div><h2>Sources + limitations</h2><p className="muted">Decision-support output preserves original-source attribution and does not turn screening into unsupported certainty.</p></article>
      </section>
    </main>
  );
}
