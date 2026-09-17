import React, { useState } from "react";
import { AlertCircle, Bell, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function AlertCenterTab({ stations, acknowledged, onAcknowledge, onSelect }) {
  const { t, translateState, translateAnomaly, getAnomalyExplanation, isHindi } = useLanguage();
  const [filter, setFilter] = useState("all");

  const alerts = stations
    .filter((s) => s.status === "anomaly" || s.status === "warning")
    .map((s) => ({
      station: s,
      severity: s.status === "anomaly" ? "Critical" : "Warning",
      status: acknowledged.has(s.id) ? "Acknowledged" : "Open",
    }));

  const categoryLabels = {
    all: t("allAlertsCategory", "All Alerts"),
    Critical: t("criticalCategory", "Critical"),
    Warning: t("warningCategory", "Warning"),
    Acknowledged: t("acknowledgedCategory", "Acknowledged"),
  };

  const categories = ["all", "Critical", "Warning", "Acknowledged"];
  const filtered = alerts.filter((a) => filter === "all" || a.severity === filter || a.status === filter);

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1180, margin: "0 auto" }}>
      {/* Header Bar */}
      <div className="flex items-center justify-between" style={{ marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: "#EDE9FE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bell size={18} color="#7C3AED" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: -0.3 }}>
                {t("alertCenterTitle", "Network Alert Center")}
              </h1>
              <p style={{ fontSize: 13, color: "#64748B", margin: "2px 0 0" }}>
                {t("alertCenterSubtitle", "Active anomaly warnings and hardware health incidents across India's AWS network")}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex" style={{ gap: 8, flexWrap: "wrap" }}>
          {categories.map((c) => {
            const isSelected = filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  padding: "7px 14px",
                  borderRadius: 9999,
                  cursor: "pointer",
                  border: `1px solid ${isSelected ? "#7C3AED" : "#E2E8F0"}`,
                  background: isSelected ? "#7C3AED" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#475569",
                  transition: "all 0.18s ease",
                  boxShadow: isSelected ? "0 4px 12px rgba(124, 58, 237, 0.25)" : "none",
                }}
              >
                {categoryLabels[c] || c}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div
          className="saas-card"
          style={{
            padding: 48,
            textAlign: "center",
            color: "#64748B",
            borderRadius: 24,
          }}
        >
          <CheckCircle2 size={32} color="#10B981" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
            {t("noAlertsCategory", "No incidents in this category.")}
          </div>
        </div>
      )}

      {/* Alert Card List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map(({ station: s, severity: _severity, status }) => {
          const ex = getAnomalyExplanation(s);
          const isCritical = s.status === "anomaly";

          return (
            <div
              key={s.id}
              className="saas-card saas-card-interactive"
              style={{
                borderRadius: 20,
                background: "#FFFFFF",
                padding: "20px 22px",
                borderLeft: `5px solid ${isCritical ? "#EF4444" : "#F59E0B"}`,
              }}
            >
              <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                <div className="flex items-center" style={{ gap: 10, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "3px 10px",
                      borderRadius: 9999,
                      background: isCritical ? "#FEE2E2" : "#FEF3C7",
                      color: isCritical ? "#EF4444" : "#D97706",
                    }}
                  >
                    {isCritical ? t("criticalCategory", "Critical").toUpperCase() : t("warningCategory", "Warning").toUpperCase()}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{s.id}</span>
                  <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>
                    {translateState(s.state)} · <strong>{translateAnomaly(s.anomalyType) || "Anomaly"}</strong>
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>{s.lastObservation}</span>
              </div>

              {ex && (
                <div style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.55, marginBottom: 14 }}>
                  {ex.headline}
                </div>
              )}

              <div
                className="flex items-center justify-between"
                style={{
                  paddingTop: 12,
                  borderTop: "1px solid #F1F5F9",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div className="flex items-center" style={{ gap: 8 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      fontWeight: 600,
                      color: status === "Acknowledged" ? "#059669" : "#D97706",
                      background: status === "Acknowledged" ? "#ECFDF5" : "#FFFBEB",
                      padding: "3px 10px",
                      borderRadius: 9999,
                    }}
                  >
                    {status === "Acknowledged" ? <Check size={12} /> : <AlertCircle size={12} />}
                    {status === "Acknowledged" ? t("acknowledgedBtn", "Acknowledged") : (isHindi ? "लंबित (Open)" : "Open")}
                  </span>
                  <span style={{ fontSize: 12, color: "#64748B" }}>
                    {t("confidencePrefix", "Confidence")}: <strong>{Math.round((s.confidence || 0.92) * 100)}%</strong>
                  </span>
                </div>

                <div className="flex" style={{ gap: 8 }}>
                  <button
                    className="saas-btn-primary"
                    style={{ padding: "7px 14px", fontSize: 12 }}
                    onClick={() => {
                      onSelect(s.id, true);
                    }}
                  >
                    {t("inspectStationBtn", "Inspect Station")} <ArrowRight size={13} />
                  </button>

                  <button
                    className="saas-btn-secondary"
                    style={{ padding: "7px 14px", fontSize: 12 }}
                    onClick={() => onAcknowledge(s.id)}
                    disabled={acknowledged.has(s.id)}
                  >
                    {acknowledged.has(s.id) ? t("acknowledgedBtn", "Acknowledged") : t("acknowledgeBtn", "Acknowledge")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
