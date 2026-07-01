// Lightweight in-house i18n. UI-level phrases; features prompt AI in whatever language user writes in.
import { createContext, useContext } from "react";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zu", label: "isiZulu" },
  { code: "xh", label: "isiXhosa" },
  { code: "af", label: "Afrikaans" },
  { code: "st", label: "Sesotho" },
  { code: "ts", label: "Xitsonga" },
  { code: "tn", label: "Setswana" },
  { code: "pt", label: "Português" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

const STRINGS: Record<string, Partial<Record<LangCode, string>>> = {
  welcome: {
    en: "Welcome to Chambers OS",
    zu: "Siyakwamukela ku-Chambers OS",
    xh: "Wamkelekile kwi-Chambers OS",
    af: "Welkom by Chambers OS",
    st: "Rea u amohela ho Chambers OS",
    ts: "Amukelekile eka Chambers OS",
    tn: "O amogetswe kwa Chambers OS",
    pt: "Bem-vindo ao Chambers OS",
    fr: "Bienvenue sur Chambers OS",
    de: "Willkommen bei Chambers OS",
    es: "Bienvenido a Chambers OS",
  },
  dashboard: {
    en: "Dashboard", af: "Kontrolebord", pt: "Painel", fr: "Tableau de bord", de: "Übersicht", es: "Panel",
  },
  generate: { en: "Generate", af: "Genereer", pt: "Gerar", fr: "Générer", de: "Erzeugen", es: "Generar" },
};

export function t(key: string, lang: LangCode = "en"): string {
  return STRINGS[key]?.[lang] ?? STRINGS[key]?.en ?? key;
}

export const LangContext = createContext<{ lang: LangCode; setLang: (l: LangCode) => void }>({
  lang: "en",
  setLang: () => {},
});

export function useLang() {
  return useContext(LangContext);
}
