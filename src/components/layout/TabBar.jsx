import React from "react";
import { TABS } from "../../constants/theme";
import { useLanguage } from "../../context/LanguageContext";

export default function TabBar({ active, setActive, alertCount }) {
  const { t } = useLanguage();
  return (
    <div
      style={{
        background: "#F8FAFC",
        padding: "12px 24px 8px",
        display: "flex",
        justifyContent: "center",
      }}
      aria-label="Tab Navigation"
    >
      <nav
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          background: "#FFFFFF",
          padding: "6px",
          borderRadius: 20,
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
          overflowX: "auto",
          maxWidth: "100%",
        }}
      >
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 16px",
                borderRadius: 14,
                fontSize: 13,
                fontWeight: 600,
                color: isActive ? "#FFFFFF" : "#475569",
                background: isActive ? "#7C3AED" : "transparent",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isActive ? "0 4px 12px rgba(124, 58, 237, 0.3)" : "none",
              }}
            >
              <Icon size={15} color={isActive ? "#FFFFFF" : "#64748B"} />
              <span>
                {{
                  dashboard: t("tabDashboard", "Monitoring Dashboard"),
                  alerts: t("tabAlerts", "Alert Center"),
                  table: t("tabTable", "Station Registry"),
                  quality: t("tabQuality", "Data Quality"),
                  performance: t("tabPerformance", "Model Performance"),
                }[tab.id] || tab.label}
              </span>

              {tab.id === "alerts" && alertCount > 0 && (
                <span
                  style={{
                    background: isActive ? "#FFFFFF" : "#EF4444",
                    color: isActive ? "#7C3AED" : "#FFFFFF",
                    fontSize: 10.5,
                    fontWeight: 800,
                    borderRadius: 9999,
                    padding: "1px 6px",
                    marginLeft: 2,
                  }}
                >
                  {alertCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
