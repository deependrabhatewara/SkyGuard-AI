import React from "react";
import { Radio, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer({ onNavigate }) {
  const { t, isHindi } = useLanguage();

  const columns = [
    {
      title: t("footerPlatformModules"),
      links: [
        { label: t("footerLiveSatellite"), id: "dashboard" },
        { label: t("footerAlertCenter"), id: "alerts" },
        { label: t("footerStationRegistry"), id: "table" },
        { label: t("footerQualityBenchmark"), id: "quality" },
        { label: t("footerModelPerf"), id: "performance" },
      ],
    },
    {
      title: t("footerResources"),
      links: [
        { label: t("footerFastAPI") },
        { label: t("footerWMO") },
        { label: t("footerSimulator") },
        { label: t("footerTimescale") },
      ],
    },
    {
      title: t("footerGovernance"),
      links: [
        { label: t("footerDataSharing") },
        { label: t("footerSecurity") },
        { label: t("footerAccessibility") },
        { label: t("footerTerms") },
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #E2E8F0",
        padding: "56px 24px 32px",
        color: "#475569",
        fontSize: 13,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
          marginBottom: 48,
        }}
      >
        {/* Brand Column */}
        <div style={{ maxWidth: 320 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Radio size={18} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", letterSpacing: -0.3 }}>
              SkyGuard<span style={{ color: "#7C3AED" }}> AI</span>
            </span>
          </div>

          <p style={{ color: "#64748B", lineHeight: 1.6, margin: "0 0 16px" }}>
            {t("footerMission")}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10B981", fontWeight: 600, fontSize: 12.5 }}>
            <ShieldCheck size={16} />
            <span>{isHindi ? "सक्रिय और लाइव टेलीमेट्री तैयार" : "Operational & Live Telemetry Ready"}</span>
          </div>
        </div>

        {/* Links Columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <div style={{ fontWeight: 800, color: "#0F172A", fontSize: 13.5, marginBottom: 16 }}>
              {col.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map((link) => (
                <span
                  key={link.label}
                  onClick={() => link.id && onNavigate?.(link.id)}
                  style={{
                    color: "#64748B",
                    cursor: link.id ? "pointer" : "default",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (link.id) e.target.style.color = "#7C3AED";
                  }}
                  onMouseLeave={(e) => {
                    if (link.id) e.target.style.color = "#64748B";
                  }}
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          paddingTop: 24,
          borderTop: "1px solid #F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          fontSize: 12,
          color: "#94A3B8",
        }}
      >
        <div>
          {t("footerCopyright")}
        </div>
        <div>
          {t("footerNationalNetwork")}
        </div>
      </div>
    </footer>
  );
}
