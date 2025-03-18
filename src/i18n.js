import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import lu from "./locales/lu.json";
import de from "./locales/de.json"

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      lu: { translation: lu },
      de: { translation: de}
    },
    fallbackLng: "lu",
    interpolation: {
      escapeValue: false,
    },
    detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      },
  });

export default i18n;
