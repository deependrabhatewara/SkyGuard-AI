import React from "react";
import { ListChecks, CheckCircle2, XCircle, MapPin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function EventValidation({ station, neighbors = [] }) {
  const { t, getValidationChecks, translateState, isHindi } = useLanguage();
  if (!station || station.status !== "anomaly") return null;
  const genuine = station.anomalySource === "genuine_weather";
  const checks = getValidationChecks(genuine);

  return (
    <div className="saas-card" style={{ padding: 22, borderRadius: 24, background: "#FFFFFF" }}>
      <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
        <ListChecks size={18} color="#7C3AED" />
        <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A" }}>
          {t("spatialValidationTitle", "CROSS-STATION SPATIAL VALIDATION")}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        <div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {checks.map((c) => (
              <li key={c} className="flex items-start" style={{ gap: 10, fontSize: 12.5, color: "#475569", marginBottom: 9 }}>
                {genuine ? (
                  <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 1, flexShrink: 0 }} />
                ) : (
                  <XCircle size={16} color="#EF4444" style={{ marginTop: 1, flexShrink: 0 }} />
                )}
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <div
            style={{
              marginTop: 10,
              padding: "8px 14px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 12.5,
              background: genuine ? "#ECFDF5" : "#FEF2F2",
              color: genuine ? "#065F46" : "#991B1B",
              border: `1px solid ${genuine ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
              display: "inline-block",
            }}
          >
            {t("decisionPrefix", "DECISION:")} {genuine ? (isHindi ? "सत्यापित वास्तविक मौसमी घटना" : "Validated Genuine Meteorological Event") : (isHindi ? "पृथक उपकरण / सेंसर विफलता" : "Isolated Instrument / Sensor Malfunction")}
          </div>
        </div>

        <div style={{ fontSize: 12, color: "#64748B" }}>
          <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={14} color="#7C3AED" /> {t("nearestNeighborsTitle", "Nearest Spatial Neighbors")}
          </div>
          {neighbors.length === 0 ? (
            <div style={{ color: "#94A3B8" }}>{t("noNeighborsRange", "No neighbors within range.")}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {neighbors.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 10,
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>{n.id} ({translateState(n.state)})</span>
                  <span style={{ color: "#64748B" }}>{n.temperature.toFixed(1)}°C · {n.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
