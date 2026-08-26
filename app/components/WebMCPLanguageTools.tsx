"use client";

import { useEffect } from "react";
import { COUNTRIES, DEFAULT_COUNTRY, LOCALES, isLocaleCode, type CountryCode } from "@/lib/i18n/locales";

type Tool = { name: string; title?: string; description: string; inputSchema: Record<string, unknown>; annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean }; execute: (input: Record<string, unknown>) => Promise<string> | string };
type ModelContext = { registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => Promise<unknown> | unknown };

function currentCountry(): CountryCode {
  const stored = window.localStorage.getItem("fdd-country");
  return COUNTRIES.some((country) => country.code === stored) ? stored as CountryCode : DEFAULT_COUNTRY;
}

export default function WebMCPLanguageTools() {
  useEffect(() => {
    const mc = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!mc) return;
    const controller = new AbortController();
    const tool: Tool = {
      name: "set_interface_language",
      title: "Change the interface language",
      description: "Change the visible interface language without changing the active data country. Danish source names remain attributable to their original sources.",
      inputSchema: { type: "object", properties: { language: { type: "string", enum: LOCALES.map((locale) => locale.code) } }, required: ["language"] },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input) => {
        const language = typeof input.language === "string" ? input.language.trim() : "";
        if (!isLocaleCode(language)) return JSON.stringify({ ok: false, error: "unsupported_language", supportedLanguages: LOCALES.map((locale) => locale.code) });
        window.localStorage.setItem("fdd-language", language);
        document.documentElement.lang = language;
        window.dispatchEvent(new CustomEvent("fdd-locale-change", { detail: { locale: language, country: currentCountry(), source: "webmcp" } }));
        return JSON.stringify({ ok: true, language, languageName: LOCALES.find((locale) => locale.code === language)?.nativeName ?? language, selectedCountry: currentCountry(), dataCountry: "DK", note: "Language changed; Danish source data remains active." });
      }
    };
    void Promise.resolve(mc.registerTool(tool, { signal: controller.signal })).catch(() => {});
    return () => controller.abort();
  }, []);
  return null;
}
