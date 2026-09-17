import React from "react";
import { Zap, PauseCircle, TrendingUp, WifiOff, CloudRain, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function SimulationPanel({ selectedStation, onInject, injecting }) {
  const { t } = useLanguage();

  const faults = [
    { id: "spike", label: t("faultSpike", "Temperature Spike (+12°C)"), icon: Zap, color: "#EF4444" },
    { id: "stuck", label: t("faultStuck", "Frozen / Stuck Sensor"), icon: PauseCircle, color: "#F59E0B" },
    { id: "drift", label: t("faultDrift", "Calibration Drift"), icon: TrendingUp, color: "#7C3AED" },
    { id: "dropout", label: t("faultDropout", "Telemetry Dropout"), icon: WifiOff, color: "#64748B" },
    { id: "extreme_weather", label: t("faultExtreme", "Extreme Weather Event"), icon: CloudRain, color: "#06B6D4" },
  ];

  return (
    <div
      className="saas-card"
      style={{
        padding: "20px 24px",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 100%)",
        border: "1px solid rgba(124, 58, 237, 0.2)",
        borderRadius: 24,
      }}
    >
      <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "#EDE9FE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={16} color="#7C3AED" />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A" }}>
              {t("sandboxTitle", "DEMO FAULT INJECTION SANDBOX")}
            </div>
            <div style={{ fontSize: 12, color: "#64748B" }}>
              {t("sandboxSubtitle", "Test how the AI isolates hardware malfunctions from genuine weather events")}
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: "#7C3AED",
            background: "#EDE9FE",
            padding: "4px 10px",
            borderRadius: 9999,
          }}
        >
          {t("targetPrefix", "Target")}: <strong>{selectedStation ? selectedStation.id : t("autoSelectedStation", "Auto-Selected Station")}</strong>
        </span>
      </div>

      {/* Fault Injection Button Row */}
      <div className="flex flex-wrap" style={{ gap: 8, marginTop: 12 }}>
        {faults.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => onInject(f.id)}
              disabled={injecting}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 12.5,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
                color: "#0F172A",
                cursor: injecting ? "not-allowed" : "pointer",
                opacity: injecting ? 0.6 : 1,
                boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                if (!injecting) {
                  e.currentTarget.style.borderColor = "#7C3AED";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(124, 58, 237, 0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!injecting) {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.02)";
                }
              }}
            >
              <Icon size={15} color={f.color} />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {injecting && (
        <div
          className="flex items-center"
          style={{
            gap: 10,
            marginTop: 14,
            padding: "8px 14px",
            background: "#EDE9FE",
            borderRadius: 12,
            fontSize: 12.5,
            color: "#6D28D9",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              border: "2px solid #7C3AED",
              borderTopColor: "transparent",
              borderRadius: "50%",
              display: "inline-block",
              animation: "sg-spin 0.7s linear infinite",
            }}
          />
          {t("simulatingLoadingText", "Running AI Anomaly Detection Pipeline & Cross-Sensor Verification…")}
        </div>
      )}
    </div>
  );
}
