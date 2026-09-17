import React from "react";
import { Activity, ArrowUpRight, Check } from "lucide-react";
import { STATUS_META, ANOMALY_TYPES } from "../../constants/theme";
import { useLanguage } from "../../context/LanguageContext";

export default function AnomalyIntelligencePanel({ stations, onSelect, onInspect, onAcknowledge, acknowledged }) {
  const { t, translateAnomaly } = useLanguage();
  const flagged = stations
    .filter((s) => s.status === "anomaly" || s.status === "warning")
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

  return (
    <aside
      className="saas-card"
      style={{
        width: 320,
        flexShrink: 0,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        maxHeight: 880,
      }}
      aria-label="AI anomaly intelligence"
    >
      <div style={{ paddingBottom: 14, borderBottom: "1px solid #F1F5F9", marginBottom: 14 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "#EDE9FE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Activity size={16} color="#7C3AED" />
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A", letterSpacing: 0.2 }}>
              {t("aiIntelligenceTitle", "AI INTELLIGENCE")}
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              background: "#FEE2E2",
              color: "#EF4444",
              padding: "2px 8px",
              borderRadius: 9999,
            }}
          >
            {flagged.length} {t("flaggedCount", "Flagged")}
          </span>
        </div>
        <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 4 }}>
          {t("aiIntelligenceSubtitle", "Live anomaly detections, ranked by ML confidence")}
        </div>
      </div>

      <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
        {flagged.length === 0 && (
          <div style={{ fontSize: 13, color: "#94A3B8", padding: "32px 16px", textAlign: "center" }}>
            {t("noActiveAnomalies", "No active anomalies. All station sensors are nominal.")}
          </div>
        )}
        {flagged.map((s) => {
          const meta = STATUS_META[s.status] || STATUS_META.healthy;
          const at = ANOMALY_TYPES[s.anomalyType] || ANOMALY_TYPES.spike;
          const AtIcon = at.icon;
          const isAck = acknowledged.has(s.id);
          const confPct = Math.round((s.confidence || 0.9) * 100);

          return (
            <div
              key={s.id}
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: 16,
                padding: "12px 14px",
                background: isAck ? "#F8FAFC" : "#FFFFFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                transition: "all 0.18s ease",
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                  {s.id}
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 9999,
                    background: meta.bg,
                    color: meta.color,
                  }}
                >
                  {s.status === "anomaly" ? t("criticalStat", "CRITICAL") : t("warningsStat", "WARNING")}
                </span>
              </div>

              <div style={{ fontSize: 12, color: "#475569", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                <AtIcon size={13} color="#7C3AED" />
                <span>{translateAnomaly(s.anomalyType) || at.label}</span>
              </div>

              {/* Confidence progress bar */}
              <div style={{ marginBottom: 10 }}>
                <div className="flex items-center justify-between" style={{ fontSize: 10.5, color: "#64748B", marginBottom: 3 }}>
                  <span>{t("mlConfidence", "ML Confidence")}</span>
                  <strong style={{ color: "#0F172A" }}>{confPct}%</strong>
                </div>
                <div style={{ height: 5, borderRadius: 9999, background: "#F1F5F9", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${confPct}%`,
                      borderRadius: 9999,
                      background: s.status === "anomaly" ? "#EF4444" : "#F59E0B",
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between" style={{ gap: 6, paddingTop: 4 }}>
                <button
                  onClick={() => (onInspect || onSelect)(s.id, true)}
                  className="saas-btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11.5,
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  {t("inspectBtn", "Inspect")} <ArrowUpRight size={12} />
                </button>

                <button
                  onClick={() => onAcknowledge(s.id)}
                  disabled={isAck}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: isAck ? "#10B981" : "#64748B",
                    background: isAck ? "#ECFDF5" : "#F1F5F9",
                    border: `1px solid ${isAck ? "rgba(16, 185, 129, 0.3)" : "#E2E8F0"}`,
                    padding: "5px 10px",
                    borderRadius: 8,
                    cursor: isAck ? "default" : "pointer",
                  }}
                >
                  <Check size={12} /> {isAck ? t("acknowledgedBtn", "Acknowledged") : t("acknowledgeBtn", "Acknowledge")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
