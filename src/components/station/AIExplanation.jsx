import React from "react";
import { CheckCircle2, ShieldAlert, ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function AIExplanation({ station }) {
  const { t, getAnomalyExplanation } = useLanguage();
  const ex = getAnomalyExplanation(station);

  const steps = [
    t("stepObserved", "Observed"),
    t("stepPatternAnalysis", "Pattern Analysis"),
    t("stepCrossSensor", "Cross-Sensor Validation"),
    t("stepAIDetection", "AI Detection"),
    t("stepExplanation", "Explanation"),
    t("stepAction", "Recommended Action"),
  ];

  if (!ex) {
    return (
      <div
        className="saas-card"
        style={{
          borderRadius: 20,
          padding: 20,
          background: "#ECFDF5",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          textAlign: "center",
        }}
      >
        <CheckCircle2 size={24} color="#10B981" style={{ marginBottom: 6 }} />
        <div style={{ fontSize: 14, fontWeight: 700, color: "#065F46" }}>
          {t("noAnomalyTitle", "No Anomaly Detected — Nominal AWS Sensor Stream")}
        </div>
        <div style={{ fontSize: 12.5, color: "#047857", marginTop: 2 }}>
          {t("noAnomalySubtitle", "All temperature, barometric pressure, and humidity parameters comply with atmospheric physical bounds.")}
        </div>
      </div>
    );
  }

  return (
    <div
      className="saas-card"
      style={{
        borderRadius: 24,
        background: "#FFFFFF",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(239, 68, 68, 0.15)",
          background: "linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div className="flex items-center" style={{ gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "#FEE2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldAlert size={18} color="#EF4444" />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: "#991B1B" }}>
              {t("aiReportTitle", "AI FAULT ISOLATION REPORT")}
            </div>
            <div style={{ fontSize: 11.5, color: "#B91C1C" }}>
              {t("aiReportSubtitle", "Automated Root Cause Diagnosis & Field Recommendation")}
            </div>
          </div>
        </div>

        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#EF4444",
            background: "#FFFFFF",
            padding: "4px 12px",
            borderRadius: 9999,
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          {t("confidencePrefix", "Confidence")}: {((station.confidence || 0.94) * 100).toFixed(0)}%
        </span>
      </div>

      <div style={{ padding: 22 }}>
        <div style={{ fontSize: 14, color: "#0F172A", lineHeight: 1.6, fontWeight: 600 }}>
          {ex.headline}
        </div>

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 13 }}>
            <strong style={{ color: "#0F172A" }}>{t("whyThisMatters", "Why this matters:")} </strong>
            <span style={{ color: "#475569" }}>{ex.matters}</span>
          </div>
          <div style={{ fontSize: 13 }}>
            <strong style={{ color: "#0F172A" }}>{t("likelyRootCause", "Likely root cause:")} </strong>
            <span style={{ color: "#475569" }}>{ex.cause}</span>
          </div>
          <div style={{ fontSize: 13 }}>
            <strong style={{ color: "#7C3AED" }}>{t("recommendedTechnicianAction", "Recommended technician action:")} </strong>
            <span style={{ color: "#475569" }}>{ex.action}</span>
          </div>
        </div>

        {/* Diagnostic Pipeline Steps */}
        <div
          style={{
            marginTop: 22,
            paddingTop: 16,
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            overflowX: "auto",
            paddingBottom: 6,
            gap: 12,
          }}
        >
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: i === steps.length - 1 ? "#7C3AED" : "#64748B",
                  background: i === steps.length - 1 ? "#EDE9FE" : "#F8FAFC",
                  padding: "6px 12px",
                  borderRadius: 8,
                  whiteSpace: "nowrap",
                  border: `1px solid ${i === steps.length - 1 ? "#DDD6FE" : "#E2E8F0"}`,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: i === steps.length - 1 ? "#7C3AED" : "#94A3B8" }} />
                {step}
              </div>
              {i < steps.length - 1 && <ArrowRight size={12} color="#CBD5E1" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
