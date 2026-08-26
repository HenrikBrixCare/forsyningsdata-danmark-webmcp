"use client";

import { useEffect } from "react";
import { COUNTRIES, DEFAULT_COUNTRY, DEFAULT_LOCALE, isLocaleCode, type CountryCode } from "@/lib/i18n/locales";

type ToolContext = { signal?: AbortSignal };
type Tool = { name: string; title?: string; description: string; inputSchema: Record<string, unknown>; annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean }; execute: (input: Record<string, unknown>, context?: ToolContext) => Promise<string> | string };
type ModelContext = { registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => Promise<unknown> | unknown };

function modelContext() { return (document as Document & { modelContext?: ModelContext }).modelContext; }
function addressId(input: Record<string, unknown>) { return typeof input.addressId === "string" ? input.addressId.trim() : ""; }
function uiContext() {
  const languageValue = window.localStorage.getItem("fdd-language");
  const language = isLocaleCode(languageValue) ? languageValue : DEFAULT_LOCALE;
  const countryValue = window.localStorage.getItem("fdd-country");
  const country = COUNTRIES.some((item) => item.code === countryValue) ? countryValue as CountryCode : DEFAULT_COUNTRY;
  return {
    country,
    dataCountry: "DK" as const,
    language,
    countryStatus: COUNTRIES.find((item) => item.code === country)?.status ?? "planned",
    note: country === "DK"
      ? "Danish data sources are active. Explain results in the selected interface language while preserving original Danish source names and official terms when relevant."
      : "This country connector is planned, not active. Do not imply that non-Danish source data is available yet."
  };
}
async function get(path: string, context?: ToolContext) {
  const response = await fetch(path, { signal: context?.signal, headers: { Accept: "application/json" } });
  const result: unknown = await response.json();
  return JSON.stringify({ ok: response.ok, uiContext: uiContext(), result });
}
function missing() { return JSON.stringify({ ok: false, uiContext: uiContext(), error: "missing_address_id", message: "Use an addressId returned by find_address." }); }

export default function WebMCPTools() {
  useEffect(() => {
    const mc = modelContext();
    if (!mc) return;
    const controller = new AbortController();
    const oneId = (name: string, title: string, description: string, path: string): Tool => ({
      name, title, description,
      inputSchema: { type: "object", properties: { addressId: { type: "string", minLength: 1, description: "Stable Danish address ID returned by find_address." } }, required: ["addressId"] },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: async (input, context) => { const id = addressId(input); return id ? get(`${path}?id=${encodeURIComponent(id)}`, context) : missing(); }
    });

    const tools: Tool[] = [
      {
        name: "get_interface_context", title: "Get country and language context",
        description: "Return the selected country, active data country and interface language. Planned countries must never be presented as live data coverage.",
        inputSchema: { type: "object", properties: {} }, annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: () => JSON.stringify({ ok: true, uiContext: uiContext() })
      },
      {
        name: "find_address", title: "Find Danish address",
        description: "Search Denmark's official address registry and return matching addresses with stable IDs before property, utility or environment lookups.",
        inputSchema: { type: "object", properties: { query: { type: "string", minLength: 3, description: "Danish address or partial address." } }, required: ["query"] },
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        execute: async (input, context) => {
          const query = typeof input.query === "string" ? input.query.trim() : "";
          return query.length >= 3 ? get(`/api/webmcp/address-search?q=${encodeURIComponent(query)}`, context) : JSON.stringify({ ok: false, error: "query_too_short" });
        }
      },
      oneId("get_address_overview", "Get Danish property overview", "Return verified address, parcel/BFE and lot-area context with source and limitation information.", "/api/webmcp/address-overview"),
      oneId("get_utility_overview", "Get Danish utility overview", "Return sewer, drainage, water and orienting utility decision support. Preserve limitations for excavation and design decisions.", "/api/webmcp/utility-overview"),
      oneId("get_environment_screening", "Screen soil and climate context", "Return orienting environmental screening. Never turn screening readiness into a final risk conclusion.", "/api/webmcp/environment-screening"),
      oneId("list_available_map_layers", "List official map layers", "List relevant official map layers and distinguish visual/orienting layers from structured-conclusion-ready layers.", "/api/webmcp/map-layers"),
      oneId("get_follow_up_sources", "Get original sources and human checks", "Return original authority/local sources and recommended human checks when exact drawings, permits or excavation safety matter.", "/api/webmcp/follow-up-sources"),
      {
        name: "open_address_profile", title: "Open the address profile",
        description: "Open the human-readable profile for the verified address so the person can inspect the same context the agent is using.",
        inputSchema: { type: "object", properties: { addressId: { type: "string", minLength: 1 } }, required: ["addressId"] },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: (input) => {
          const id = addressId(input); if (!id) return missing();
          const profilePath = `/adresse/${encodeURIComponent(id)}`; window.location.assign(profilePath);
          return JSON.stringify({ ok: true, uiContext: uiContext(), navigatingTo: profilePath });
        }
      }
    ];

    for (const tool of tools) void Promise.resolve(mc.registerTool(tool, { signal: controller.signal })).catch(() => {});
    return () => controller.abort();
  }, []);
  return null;
}
