"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LOCALE, LOCALES, isLocaleCode, type LocaleCode } from "@/lib/i18n/locales";

type Copy = {
  headline: string;
  intro: string;
  diagnostics: string;
  address: string;
  label: string;
};

const COPY: Record<LocaleCode, Copy> = {
  da: {
    headline: "Én adresse. Strukturerede værktøjer til agenter — synlig kontekst til mennesker.",
    intro: "Denne afgrænsede offentlige demo eksponerer danske adresse-, ejendoms-, forsynings-, miljø-, kortlags- og kildehandlinger gennem WebMCP. Datakilden er fortsat Danmark, mens brugerfladens sprog kan ændres uafhængigt.",
    diagnostics: "Åbn WebMCP-diagnostik",
    address: "Åbn demoadresse",
    label: "Brugerfladesprog",
  },
  en: {
    headline: "One address. Structured tools for agents — visible context for humans.",
    intro: "This scoped public demo exposes Danish address, property, utility, environment, map-layer and source actions through WebMCP. The active data country remains Denmark while the interface language can change independently.",
    diagnostics: "Open WebMCP diagnostics",
    address: "Open demo address",
    label: "Interface language",
  },
  de: {
    headline: "Eine Adresse. Strukturierte Werkzeuge für Agenten — sichtbarer Kontext für Menschen.",
    intro: "Diese öffentliche Demo stellt dänische Adress-, Grundstücks-, Versorgungs-, Umwelt-, Karten- und Quellenaktionen über WebMCP bereit. Das aktive Datenland bleibt Dänemark, während die Sprache der Benutzeroberfläche unabhängig geändert werden kann.",
    diagnostics: "WebMCP-Diagnose öffnen",
    address: "Demo-Adresse öffnen",
    label: "Oberflächensprache",
  },
  fr: {
    headline: "Une adresse. Des outils structurés pour les agents — un contexte visible pour les humains.",
    intro: "Cette démo publique expose via WebMCP des actions danoises liées aux adresses, propriétés, réseaux, à l’environnement, aux couches cartographiques et aux sources. Le pays des données reste le Danemark tandis que la langue de l’interface peut changer indépendamment.",
    diagnostics: "Ouvrir le diagnostic WebMCP",
    address: "Ouvrir l’adresse de démonstration",
    label: "Langue de l’interface",
  },
  it: {
    headline: "Un indirizzo. Strumenti strutturati per gli agenti — contesto visibile per le persone.",
    intro: "Questa demo pubblica espone tramite WebMCP azioni danesi su indirizzi, proprietà, sottoservizi, ambiente, livelli cartografici e fonti. Il paese dei dati resta la Danimarca, mentre la lingua dell’interfaccia può cambiare in modo indipendente.",
    diagnostics: "Apri diagnostica WebMCP",
    address: "Apri indirizzo demo",
    label: "Lingua dell’interfaccia",
  },
  es: {
    headline: "Una dirección. Herramientas estructuradas para agentes — contexto visible para las personas.",
    intro: "Esta demo pública expone mediante WebMCP acciones danesas de dirección, propiedad, servicios, medio ambiente, capas de mapa y fuentes. El país de los datos sigue siendo Dinamarca mientras el idioma de la interfaz puede cambiar de forma independiente.",
    diagnostics: "Abrir diagnóstico WebMCP",
    address: "Abrir dirección de demostración",
    label: "Idioma de la interfaz",
  },
  pl: {
    headline: "Jeden adres. Ustrukturyzowane narzędzia dla agentów — widoczny kontekst dla ludzi.",
    intro: "Ta publiczna demonstracja udostępnia przez WebMCP duńskie działania dotyczące adresów, nieruchomości, sieci, środowiska, warstw mapowych i źródeł. Krajem danych pozostaje Dania, a język interfejsu można zmieniać niezależnie.",
    diagnostics: "Otwórz diagnostykę WebMCP",
    address: "Otwórz adres demonstracyjny",
    label: "Język interfejsu",
  },
  nl: {
    headline: "Eén adres. Gestructureerde tools voor agents — zichtbare context voor mensen.",
    intro: "Deze openbare demo stelt via WebMCP Deense acties beschikbaar voor adressen, eigendommen, nutsvoorzieningen, milieu, kaartlagen en bronnen. Het actieve dataland blijft Denemarken terwijl de interfacetaal onafhankelijk kan worden gewijzigd.",
    diagnostics: "WebMCP-diagnostiek openen",
    address: "Demo-adres openen",
    label: "Interfacetaal",
  },
  pt: {
    headline: "Um endereço. Ferramentas estruturadas para agentes — contexto visível para pessoas.",
    intro: "Esta demonstração pública expõe através do WebMCP ações dinamarquesas de endereço, propriedade, infraestruturas, ambiente, camadas de mapa e fontes. O país dos dados continua a ser a Dinamarca, enquanto o idioma da interface pode mudar de forma independente.",
    diagnostics: "Abrir diagnóstico WebMCP",
    address: "Abrir endereço de demonstração",
    label: "Idioma da interface",
  },
  sv: {
    headline: "En adress. Strukturerade verktyg för agenter — synlig kontext för människor.",
    intro: "Den här offentliga demon exponerar danska åtgärder för adress, fastighet, försörjning, miljö, kartlager och källor via WebMCP. Det aktiva datalandet förblir Danmark medan gränssnittsspråket kan ändras oberoende.",
    diagnostics: "Öppna WebMCP-diagnostik",
    address: "Öppna demoadress",
    label: "Gränssnittsspråk",
  },
  no: {
    headline: "Én adresse. Strukturerte verktøy for agenter — synlig kontekst for mennesker.",
    intro: "Denne offentlige demoen eksponerer danske handlinger for adresse, eiendom, forsyning, miljø, kartlag og kilder gjennom WebMCP. Aktivt dataland forblir Danmark, mens språket i grensesnittet kan endres uavhengig.",
    diagnostics: "Åpne WebMCP-diagnostikk",
    address: "Åpne demoadresse",
    label: "Grensesnittspråk",
  },
};

function storedLocale(): LocaleCode {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const value = window.localStorage.getItem("fdd-language");
  return isLocaleCode(value) ? value : DEFAULT_LOCALE;
}

export default function LocalizedChallengeHero() {
  const [locale, setLocale] = useState<LocaleCode>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocale(storedLocale());
    const onLocaleChange = (event: Event) => {
      const custom = event as CustomEvent<{ locale?: unknown }>;
      if (isLocaleCode(custom.detail?.locale)) setLocale(custom.detail.locale);
    };
    window.addEventListener("fdd-locale-change", onLocaleChange);
    return () => window.removeEventListener("fdd-locale-change", onLocaleChange);
  }, []);

  const copy = COPY[locale];
  const languageName = LOCALES.find((item) => item.code === locale)?.nativeName ?? locale;

  return (
    <section className="hero">
      <div className="eyebrow">OpenAI WebMCP Challenge 2026</div>
      <div className="locale-status" aria-live="polite">{copy.label}: <strong>{languageName}</strong> · Data: <strong>DK</strong></div>
      <h1>{copy.headline}</h1>
      <p>{copy.intro}</p>
      <div className="actions">
        <a className="button" href="/webmcp-test">{copy.diagnostics}</a>
        <a className="button" href="/adresse/0a3f509c-e673-32b8-e044-0003ba298018">{copy.address}</a>
      </div>
    </section>
  );
}
