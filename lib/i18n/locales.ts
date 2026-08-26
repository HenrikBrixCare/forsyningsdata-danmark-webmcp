export const DEFAULT_COUNTRY = "DK" as const;
export const DEFAULT_LOCALE = "da" as const;

export const LOCALES = [
  { code: "da", nativeName: "Dansk" },
  { code: "en", nativeName: "English" },
  { code: "de", nativeName: "Deutsch" },
  { code: "fr", nativeName: "Français" },
  { code: "it", nativeName: "Italiano" },
  { code: "es", nativeName: "Español" },
  { code: "pl", nativeName: "Polski" },
  { code: "nl", nativeName: "Nederlands" },
  { code: "pt", nativeName: "Português" },
  { code: "sv", nativeName: "Svenska" },
  { code: "no", nativeName: "Norsk" }
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];
export type CountryCode = "DK" | "DE" | "PL" | "NL" | "BE" | "FR" | "IT" | "ES";

export const COUNTRIES: Array<{ code: CountryCode; name: string; status: "active" | "planned" }> = [
  { code: "DK", name: "Denmark", status: "active" },
  { code: "DE", name: "Germany", status: "planned" },
  { code: "PL", name: "Poland", status: "planned" },
  { code: "NL", name: "Netherlands", status: "planned" },
  { code: "BE", name: "Belgium", status: "planned" },
  { code: "FR", name: "France", status: "planned" },
  { code: "IT", name: "Italy", status: "planned" },
  { code: "ES", name: "Spain", status: "planned" }
];

export function isLocaleCode(value: unknown): value is LocaleCode {
  return typeof value === "string" && LOCALES.some((locale) => locale.code === value);
}
