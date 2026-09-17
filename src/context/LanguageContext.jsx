import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  STATE_NAMES,
  ANOMALY_TRANSLATIONS,
  getHindiAnomalyExplanation,
  getSpatialValidationChecks,
  t as translateHelper,
} from "../constants/translations";
import { explainAnomaly as getEnglishExplanation } from "../utils/mockData";

export const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  isHindi: false,
  t: (key, fallback) => fallback || key,
  translateState: (s) => s,
  translateAnomaly: (a) => a,
  getAnomalyExplanation: () => null,
  getValidationChecks: () => [],
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("skyguard-language") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("skyguard-language", language);
    } catch (e) {
      console.warn("Could not persist language to localStorage", e);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = language === "hi" ? "hi" : "en";
    }
  }, [language]);

  const t = useCallback(
    (key, fallback = "") => translateHelper(language, key, fallback),
    [language]
  );

  const translateState = useCallback(
    (stateName) => {
      if (!stateName) return "";
      return STATE_NAMES[language]?.[stateName] || stateName;
    },
    [language]
  );

  const translateAnomaly = useCallback(
    (anomalyType) => {
      if (!anomalyType) return "";
      return ANOMALY_TRANSLATIONS[language]?.[anomalyType] || anomalyType;
    },
    [language]
  );

  const getAnomalyExplanation = useCallback(
    (station) => {
      if (!station || !station.anomalyType) return null;
      if (language === "hi") {
        const deltaT =
          station.tempHist?.[station.anomalyIdx]?.value -
            station.tempHist?.[station.anomalyIdx - 1]?.value || 12;
        return getHindiAnomalyExplanation(station.anomalyType, deltaT);
      }
      return getEnglishExplanation(station);
    },
    [language]
  );

  const getValidationChecks = useCallback(
    (genuine) => getSpatialValidationChecks(genuine, language),
    [language]
  );

  const isHindi = language === "hi";

  const value = {
    language,
    setLanguage,
    isHindi,
    t,
    translateState,
    translateAnomaly,
    getAnomalyExplanation,
    getValidationChecks,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
