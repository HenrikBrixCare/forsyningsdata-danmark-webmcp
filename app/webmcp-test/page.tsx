"use client";

import { useEffect, useState } from "react";

const tools = [
  "get_interface_context",
  "set_interface_language",
  "find_address",
  "get_address_overview",
  "get_utility_overview",
  "get_environment_screening",
  "list_available_map_layers",
  "get_follow_up_sources",
  "open_address_profile",
  "focus_address_section"
];

export default function WebMCPTestPage() {
  const [detected, setDetected] = useState(false);
  const [language, setLanguage] = useState("da");
  useEffect(() => {
    setDetected(Boolean((document as Document & { modelContext?: unknown }).modelContext));
    const stored = window.localStorage.getItem("fdd-language"); if (stored) setLanguage(stored);
    const listener = (event: Event) => { const detail = (event as CustomEvent<{ locale?: string }>).detail; if (detail?.locale) setLanguage(detail.locale); };
    window.addEventListener("fdd-locale-change", listener); return () => window.removeEventListener("fdd-locale-change", listener);
  }, []);

  return (
    <main className="shell">
      <section className="hero">
        <div className="eyebrow">WebMCP Challenge 2026 · diagnostics</div>
        <h1>WebMCP live test</h1>
        <p>Use Chrome with WebMCP testing enabled and the Model Context Tool Inspector to inspect and execute the registered tools.</p>
      </section>
      <section className="grid">
        <article className="data-card"><div className="card-kicker">Browser</div><h2 className={detected ? "status-ok" : ""}>{detected ? "WebMCP detected ✓" : "WebMCP not detected"}</h2><p className="muted">document.modelContext {detected ? "is available" : "is not available"} in this browser session.</p></article>
        <article className="data-card"><div className="card-kicker">Data country</div><h2>DK Denmark</h2><p className="muted">Challenge data country remains Denmark.</p></article>
        <article className="data-card"><div className="card-kicker">Interface language</div><h2>{language}</h2><p className="muted">Language can change independently from data jurisdiction.</p></article>
      </section>
      <section className="data-card" style={{ marginTop: 18 }}>
        <div className="card-kicker">Expected registered tools</div><h2>10 WebMCP tools</h2>
        <ol>{tools.map((tool) => <li key={tool}><code>{tool}</code></li>)}</ol>
        <p className="muted">The browser's WebMCP inspector is the authoritative view of tools actually discovered in the current session.</p>
      </section>
      <p style={{ marginTop: 24 }}><a className="source-link" href="/">← Back to public challenge demo</a></p>
    </main>
  );
}
