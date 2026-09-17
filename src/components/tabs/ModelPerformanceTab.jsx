import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip
} from "recharts";
import { Cpu, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ModelPerformanceTab() {
  const { t, isHindi } = useLanguage();

  const kpis = [
    { label: t("kpiPrecision"), value: "94.2%", desc: t("kpiPrecisionDesc") },
    { label: t("kpiRecall"), value: "91.6%", desc: t("kpiRecallDesc") },
    { label: t("kpiFalsePositive"), value: "0.14%", desc: t("kpiFalsePositiveDesc") },
    { label: t("kpiF1Score"), value: "92.9%", desc: t("kpiF1ScoreDesc") },
  ];

  const breakdown = [
    { label: t("chartBarNormal"), value: 8600, color: "#10B981" },
    { label: t("chartBarFaults"), value: 214, color: "#7C3AED" },
    { label: t("chartBarIsolated"), value: 196, color: "#06B6D4" },
    { label: t("chartBarFalsePos"), value: 12, color: "#F59E0B" },
    { label: t("chartBarMissed"), value: 18, color: "#EF4444" },
  ];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1180, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "#EDE9FE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Cpu size={20} color="#7C3AED" />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: -0.3 }}>
            {t("modelPerfTitle")}
          </h1>
          <p style={{ fontSize: 13, color: "#64748B", margin: "2px 0 0" }}>
            {t("modelPerfSubtitle")}
          </p>
        </div>
      </div>

      {/* Info Badge */}
      <div
        style={{
          fontSize: 12.5,
          color: "#7C3AED",
          background: "#EDE9FE",
          border: "1px solid rgba(124, 58, 237, 0.25)",
          borderRadius: 12,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <Sparkles size={15} color="#7C3AED" />
        <span>
          {isHindi
            ? "8,800+ वास्तविक समय टेलीमेट्री अवलोकन चक्रों पर मूल्यांकन किए गए प्रदर्शन मेट्रिक्स।"
            : "Performance metrics evaluated over 8,800+ real-time telemetry observation cycles."}
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {kpis.map((k) => (
          <div
            key={k.label}
            className="saas-card saas-card-interactive"
            style={{
              padding: 20,
              borderRadius: 20,
              background: "#FFFFFF",
            }}
          >
            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>{k.label}</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#7C3AED",
                marginTop: 6,
                letterSpacing: -0.5,
              }}
            >
              {k.value}
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{k.desc}</div>
          </div>
        ))}
      </div>

      {/* Chart & Diagnostics Card */}
      <div
        className="saas-card"
        style={{
          borderRadius: 24,
          padding: 24,
          background: "#FFFFFF",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
          {t("chartClassificationTitle")}
        </div>
        <div style={{ fontSize: 12, color: "#64748B", marginBottom: 18 }}>
          {isHindi
            ? "सामान्य टेलीमेट्री बनाम सिमुलेटेड विसंगति प्रकारों में मूल्यांकन डेटासेट वितरण"
            : "Evaluation dataset distribution across nominal telemetry versus simulated anomaly types"}
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={breakdown} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <RTooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                background: "#FFFFFF",
                fontWeight: 600,
              }}
            />
            <Bar dataKey="value" fill="#7C3AED" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
