"use client";

import { useEffect, useState } from "react";

const expectedTools = [
  "get_interface_context",
  "set_interface_language",
  "find_address",
  "get_address_overview",
  "get_utility_overview",
  "get_environment_screening",
  "list_available_map_layers",
  "get_follow_up_sources",
  "open_address_profile",
  "focus_address_section",
];

type DiscoveredTool = { name?: unknown };
type ModelContext = EventTarget & {
  getTools?: () => Promise<DiscoveredTool[]>;
};

export default function WebMCPTestPage() {
  const [detected, setDetected] = useState(false);
  const [language, setLanguage] = useState("da");
  const [discoveredTools, setDiscoveredTools] = useState<string[]>([]);
  const [discoverySupported, setDiscoverySupported] = useState(false);

  useEffect(() => {
    const mc = (document as Document & { modelContext?: ModelContext }).modelContext;
    setDetected(Boolean(mc));
    setDiscoverySupported(Boolean(mc?.getTools));

    const stored = window.localStorage.getItem("fdd-language");
    if (stored) setLanguage(stored);

    const onLocale = (event: Event) => {
      const detail = (event as CustomEvent<{ locale?: string }>).detail;
      if (detail?.locale) setLanguage(detail.locale);
    };

    const refreshTools = async () => {
      if (!mc?.getTools) return;
      try {
        const tools = await mc.getTools();
        const names = tools
          .map((tool) => typeof tool.name === "string" ? tool.name : "")
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        setDiscoveredTools(names);
      } catch {
        setDiscoveredTools([]);
      }
    };

    const onToolChange = () => { void refreshTools(); };
    window.addEventListener("fdd-locale-change", onLocale);
    mc?.addEventListener("toolchange", onToolChange);

    const timer = window.setTimeout(() => { void refreshTools(); }, 300);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("fdd-locale-change", onLocale);
      mc?.removeEventListener("toolchange", onToolChange);
    };
  }, []);

  const complete = discoveredTools.length === expectedTools.length && expectedTools.every((tool) => discoveredTools.includes(tool));

  return (
    <main className="shell">
      <section className="hero">
        <div className="eyebrow">WebMCP Challenge 2026 · diagnostics</div>
        <h1>WebMCP live test</h1>
        <p>Use Chrome with WebMCP testing enabled. This page checks browser support and, when available, asks document.modelContext which tools are actually registered in the current page.</p>
      </section>

      <section className="grid">
        <article className="data-card">
          <div className="card-kicker">Browser</div>
          <h2 className={detected ? "status-ok" : ""}>{detected ? "WebMCP detected ✓" : "WebMCP not detected"}</h2>
          <p className="muted">document.modelContext {detected ? "is available" : "is not available"} in this browser session.</p>
        </article>
        <article className="data-card">
          <div className="card-kicker">Data country</div>
          <h2>DK Denmark</h2>
          <p className="muted">Challenge data country remains Denmark.</p>
        </article>
        <article className="data-card">
          <div className="card-kicker">Interface language</div>
          <h2>{language}</h2>
          <p className="muted">Language can change independently from data jurisdiction.</p>
        </article>
      </section>

      <section className="data-card" style={{ marginTop: 18 }}>
        <div className="card-kicker">Actually discovered by the browser</div>
        <h2 className={complete ? "status-ok" : ""}>
          {discoverySupported
            ? `${discoveredTools.length} registered tools${complete ? " ✓" : ""}`
            : "Tool discovery unavailable in this browser"}
        </h2>
        {discoverySupported && discoveredTools.length > 0 ? (
          <ol>{discoveredTools.map((tool) => <li key={tool}><code>{tool}</code></li>)}</ol>
        ) : (
          <p className="muted">In a WebMCP-enabled Chrome build, document.modelContext.getTools() will populate this list. The Model Context Tool Inspector can also be used as an independent view.</p>
        )}
      </section>

      <section className="data-card" style={{ marginTop: 18 }}>
        <div className="card-kicker">Expected challenge contract</div>
        <h2>{expectedTools.length} WebMCP tools</h2>
        <ol>{expectedTools.map((tool) => <li key={tool}><code>{tool}</code></li>)}</ol>
      </section>

      <p style={{ marginTop: 24 }}><a className="source-link" href="/">← Back to public challenge demo</a></p>
    </main>
  );
}
