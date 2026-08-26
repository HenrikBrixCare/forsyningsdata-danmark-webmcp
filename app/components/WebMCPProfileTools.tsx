"use client";

import { useEffect, useState } from "react";

type Tool = { name: string; title?: string; description: string; inputSchema: Record<string, unknown>; annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean }; execute: (input: Record<string, unknown>) => Promise<string> | string };
type ModelContext = { registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => Promise<unknown> | unknown };
type Section = "overview" | "sewer" | "water" | "other_utilities" | "property" | "map_layers" | "sources" | "documents" | "heat_telecom" | "environment";

const labels: Record<Section, string> = {
  overview: "Adressevurdering", sewer: "Kloak & regnvand", water: "Vand", other_utilities: "Andre ledninger",
  property: "Ejendomsgrundlag", map_layers: "Dataforsyningen", sources: "Lokale kilder", documents: "Dokumentgrundlag",
  heat_telecom: "Fjernvarme & tele/fiber", environment: "Jord & klima"
};
const values = Object.keys(labels) as Section[];
const pendingKey = "fdd-webmcp-profile-focus";
function valid(value: unknown): value is Section { return typeof value === "string" && values.includes(value as Section); }
function focus(section: Section) {
  const expected = labels[section].toLocaleLowerCase("da-DK");
  const card = Array.from(document.querySelectorAll<HTMLElement>("article.data-card")).find((item) => (item.querySelector(".card-kicker")?.textContent ?? "").trim().toLocaleLowerCase("da-DK").includes(expected));
  if (!card) return false;
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.animate([{ transform: "scale(1)" }, { transform: "scale(1.012)" }, { transform: "scale(1)" }], { duration: 900, easing: "ease-out" });
  return true;
}

export default function WebMCPProfileTools() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const pending = window.sessionStorage.getItem(pendingKey);
    if (!valid(pending) || !window.location.pathname.startsWith("/adresse/")) return;
    const timer = window.setTimeout(() => { if (focus(pending)) { window.sessionStorage.removeItem(pendingKey); setMessage(labels[pending]); window.setTimeout(() => setMessage(null), 2600); } }, 350);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    const mc = (document as Document & { modelContext?: ModelContext }).modelContext; if (!mc) return;
    const controller = new AbortController();
    const tool: Tool = {
      name: "focus_address_section", title: "Show a section of the address profile",
      description: "Open or focus the human-readable section that matches the data the agent is discussing, keeping the person in the loop.",
      inputSchema: { type: "object", properties: { addressId: { type: "string", minLength: 1 }, section: { type: "string", enum: values } }, required: ["addressId", "section"] },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input) => {
        const id = typeof input.addressId === "string" ? input.addressId.trim() : ""; const section = input.section;
        if (!id) return JSON.stringify({ ok: false, error: "missing_address_id" });
        if (!valid(section)) return JSON.stringify({ ok: false, error: "unsupported_profile_section", supportedSections: values });
        const profilePath = `/adresse/${encodeURIComponent(id)}`;
        if (window.location.pathname === profilePath && focus(section)) { setMessage(labels[section]); window.setTimeout(() => setMessage(null), 2600); return JSON.stringify({ ok: true, action: "focused", addressId: id, section, visibleLabel: labels[section], profilePath }); }
        window.sessionStorage.setItem(pendingKey, section); window.location.assign(profilePath);
        return JSON.stringify({ ok: true, action: "navigating_then_focusing", addressId: id, section, visibleLabel: labels[section], profilePath });
      }
    };
    void Promise.resolve(mc.registerTool(tool, { signal: controller.signal })).catch(() => {});
    return () => controller.abort();
  }, []);
  return message ? <div className="webmcp-status">WebMCP · Viser: {message}</div> : null;
}
