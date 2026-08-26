export type KlimadataResultat = {
  kontrolleret: boolean;
  fundet: boolean;
  risikoNiveau: "Ikke vurderet" | "Forberedt screening" | "Screening kræver datasæt";
  terraennaertGrundvandStatus: string;
  lavningerStatus: string;
  oversvoemmelseStatus: string;
  datakvalitet: string;
  screeningspunkter: string[];
  naesteSkridt: string[];
  kilde: string;
  kildeUrl: string;
  hipUrl: string;
  kampUrl: string;
  note: string;
};

const KILDER = {
  kilde: "KAMP / HIP – klimatilpasning og hydrologiske data",
  kildeUrl: "https://klimatilpasning.dk/kommuner-og-forsyning/vaerktoejer/kamp/",
  hipUrl: "https://hip.dataforsyningen.dk/",
  kampUrl: "https://kamp.klimatilpasning.dk/",
};

function resultat(overrides: Partial<KlimadataResultat>): KlimadataResultat {
  return {
    kontrolleret: false,
    fundet: false,
    risikoNiveau: "Ikke vurderet",
    terraennaertGrundvandStatus: "Afventer sikker stedfæstelse",
    lavningerStatus: "Afventer sikker stedfæstelse",
    oversvoemmelseStatus: "Afventer sikker stedfæstelse",
    datakvalitet: "Klima- og grundvandslaget kan først bruges, når adressen er stedfæstet med koordinater.",
    screeningspunkter: [],
    naesteSkridt: ["Sørg for sikker koordinat på adressen, før KAMP/HIP-lag kobles på."],
    ...KILDER,
    note: "Klima- og grundvandslaget er et orienterende screeningslag. Det må ikke bruges som myndighedsafgørelse uden kontrol i de originale kilder.",
    ...overrides,
  };
}

export async function hentKlimadata({ lon, lat }: { lon: number | null; lat: number | null }): Promise<KlimadataResultat> {
  const stedfaestet = lon !== null && lat !== null;
  if (!stedfaestet) {
    return resultat({ note: "Adressepunktet er ikke stedfæstet sikkert nok til klima- og grundvandsscreening." });
  }

  const koordinat = `${lon.toFixed(5)}, ${lat.toFixed(5)}`;
  return resultat({
    kontrolleret: true,
    risikoNiveau: "Forberedt screening",
    terraennaertGrundvandStatus: "Klar til HIP-opslag for terrænnært grundvand, når datasættet kobles på.",
    lavningerStatus: "Klar til KAMP-screening for lavninger og vand på terræn, når datasættet kobles på.",
    oversvoemmelseStatus: "Klar til KAMP-screening for skybrud/oversvømmelse, men ingen automatisk risikokonklusion endnu.",
    datakvalitet: "Adressepunktet er stedfæstet, men konkrete KAMP/HIP-datasæt er endnu ikke koblet på med opløsning, tema og tærskelværdi. Derfor vises screeningstatus – ikke risikodom.",
    screeningspunkter: [
      "Terrænnært grundvand",
      "Lavninger og vand på terræn",
      "Skybrud og oversvømmelse",
      "Datakilde, opløsning og manuel kontrol",
    ],
    naesteSkridt: [
      "Kobl HIP-lag på for terrænnært grundvand.",
      "Kobl KAMP-lag på for lavninger, vand på terræn og skybrudsscreening.",
      "Vis kun risiko, når datasæt, opløsning og tærskelværdi er kendt.",
    ],
    note: `Adressepunktet er stedfæstet (${koordinat}). Klima/grundvand kan derfor screenes mod KAMP/HIP i næste integrationslag. Der konkluderes ikke automatisk om risiko endnu.`,
  });
}
