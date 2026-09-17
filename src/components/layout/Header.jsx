import React, { useState } from "react";
import {
  Radio,
  Globe,
  Contrast,
  Sliders,
  Database,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { TABS } from "../../constants/theme";
import { useLanguage } from "../../context/LanguageContext";

export default function Header({
  fontScale,
  setFontScale,
  highContrast,
  setHighContrast,
  reduceMotion,
  setReduceMotion,
  now,
  isOnline,
  backendConnected,
  activeTab,
  setActiveTab,
  alertCount,
  onExploreClick,
}) {
  const { t, isHindi, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleTabClick = (tabId) => {
    setActiveTab?.(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        position: "relative",
        zIndex: 100,
        background: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
      }}
    >
      <div
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Left: Logo & Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
              flexShrink: 0,
            }}
          >
            <Radio size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: "-0.02em",
                  color: "#0F172A",
                }}
              >
                SkyGuard<span style={{ color: "#7C3AED" }}> AI</span>
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 500, marginTop: 1 }}>
              {t("brandSubtitle", "Autonomous AWS Telemetry Intelligence")}
            </div>
          </div>
        </div>

        {/* Right: Actions, Health, Language, Accessibility, CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Network Connection Status */}
          <div
            style={{
              display: "none",
              alignItems: "center",
              gap: 6,
              padding: "6px 11px",
              borderRadius: 9999,
              background: isOnline ? "#ECFDF5" : "#FEF2F2",
              border: `1px solid ${isOnline ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
              color: isOnline ? "#059669" : "#EF4444",
              fontSize: 12,
              fontWeight: 600,
            }}
            className="desktop-status"
            title={isOnline ? t("browserOnline", "Online") : t("browserOffline", "Offline")}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: isOnline ? "#10B981" : "#EF4444",
              }}
            />
            <span>{isOnline ? t("browserOnline", "Online") : t("browserOffline", "Offline")}</span>
          </div>

          {/* Backend Connection Status */}
          {backendConnected !== undefined && (
            <div
              style={{
                display: "none",
                alignItems: "center",
                gap: 6,
                padding: "6px 11px",
                borderRadius: 9999,
                background: backendConnected ? "#EDE9FE" : "#F8FAFC",
                border: `1px solid ${backendConnected ? "rgba(124, 58, 237, 0.3)" : "#E2E8F0"}`,
                color: backendConnected ? "#7C3AED" : "#64748B",
                fontSize: 12,
                fontWeight: 600,
              }}
              className="desktop-status"
              title={backendConnected ? "Connected to live FastAPI & TimescaleDB" : "Running Standalone"}
            >
              <Database size={13} color={backendConnected ? "#7C3AED" : "#94A3B8"} />
              <span>{backendConnected ? t("apiConnected", "API :8000") : t("standaloneMode", "Standalone")}</span>
            </div>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage((prev) => (prev === "en" ? "hi" : "en"))}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              color: "#0F172A",
              fontSize: 12.5,
              fontWeight: 600,
              padding: "7px 12px",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            aria-label="Toggle language"
          >
            <Globe size={14} color="#7C3AED" />
            <span>{isHindi ? "English" : "हिन्दी"}</span>
          </button>

          {/* Accessibility Settings Dropdown Toggle */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setSettingsOpen((v) => !v)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: settingsOpen ? "#EDE9FE" : "#FFFFFF",
                border: `1px solid ${settingsOpen ? "#7C3AED" : "#E2E8F0"}`,
                color: settingsOpen ? "#7C3AED" : "#475569",
                fontSize: 12.5,
                fontWeight: 600,
                padding: "7px 10px",
                borderRadius: 10,
                cursor: "pointer",
              }}
              aria-label="Accessibility settings"
              aria-expanded={settingsOpen}
            >
              <Sliders size={14} />
              <ChevronDown size={13} />
            </button>

            {/* Dropdown Card */}
            {settingsOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: "0 14px 30px -5px rgba(0, 0, 0, 0.12)",
                  minWidth: 220,
                  zIndex: 1200,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>
                  {t("displaySettings", "Display & Accessibility")}
                </div>

                {/* Text Size Scale */}
                <div>
                  <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6 }}>{t("textScaling", "Text Scaling")}</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {["A-", "A", "A+"].map((label, i) => {
                      const targetScale = 0.92 + i * 0.1;
                      const isSelected = Math.abs(fontScale - targetScale) < 0.01;
                      return (
                        <button
                          key={label}
                          onClick={() => setFontScale(targetScale)}
                          style={{
                            flex: 1,
                            padding: "5px 0",
                            fontSize: 12,
                            fontWeight: 600,
                            background: isSelected ? "#EDE9FE" : "#F8FAFC",
                            border: `1px solid ${isSelected ? "#7C3AED" : "#E2E8F0"}`,
                            color: isSelected ? "#7C3AED" : "#475569",
                            borderRadius: 8,
                            cursor: "pointer",
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* High Contrast Toggle */}
                <button
                  onClick={() => setHighContrast((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    background: highContrast ? "#F5F3FF" : "#F8FAFC",
                    border: `1px solid ${highContrast ? "#7C3AED" : "#E2E8F0"}`,
                    color: highContrast ? "#7C3AED" : "#475569",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Contrast size={14} /> {t("highContrast", "High Contrast")}
                  </span>
                  <span>{highContrast ? t("on", "ON") : t("off", "OFF")}</span>
                </button>

                {/* Reduce Motion */}
                <button
                  onClick={() => setReduceMotion((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    background: reduceMotion ? "#F5F3FF" : "#F8FAFC",
                    border: `1px solid ${reduceMotion ? "#7C3AED" : "#E2E8F0"}`,
                    color: reduceMotion ? "#7C3AED" : "#475569",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span>{t("reduceMotion", "Reduce Motion")}</span>
                  <span>{reduceMotion ? t("on", "ON") : t("off", "OFF")}</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA (Desktop) */}
          <button
            onClick={() => {
              handleTabClick("dashboard");
              onExploreClick?.();
            }}
            className="saas-btn-primary"
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            {t("liveMonitorBtn", "Live Monitor")}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={toggleMobileMenu}
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: 10,
              border: "1px solid #E2E8F0",
              background: "#FFFFFF",
              color: "#0F172A",
              cursor: "pointer",
            }}
            className="mobile-hamburger"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            boxShadow: "0 20px 30px rgba(0, 0, 0, 0.08)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            zIndex: 1150,
            animation: "sg-fade-in 0.2s ease-out",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: 0.5 }}>
            {t("mobileNavHeader", "NAVIGATION")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              const tabLabel = {
                dashboard: t("tabDashboard", "Monitoring Dashboard"),
                alerts: t("tabAlerts", "Alert Center"),
                table: t("tabTable", "Station Registry"),
                quality: t("tabQuality", "Data Quality"),
                performance: t("tabPerformance", "Model Performance"),
              }[tab.id] || tab.label;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    color: isActive ? "#7C3AED" : "#0F172A",
                    background: isActive ? "#F5F3FF" : "#F8FAFC",
                    border: `1px solid ${isActive ? "#EDE9FE" : "transparent"}`,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon size={16} color={isActive ? "#7C3AED" : "#64748B"} />
                    {tabLabel}
                  </span>
                  {tab.id === "alerts" && alertCount > 0 && (
                    <span
                      style={{
                        background: "#EF4444",
                        color: "#FFFFFF",
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 9999,
                        padding: "2px 8px",
                      }}
                    >
                      {alertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            style={{
              paddingTop: 12,
              borderTop: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              color: "#64748B",
            }}
          >
            <span>{t("statusLabel", "Status")}: <strong>{backendConnected ? t("apiConnected", "Live API :8000") : t("standaloneMode", "Standalone Engine")}</strong></span>
            <span>{t("clockLabel", "Clock")}: <strong>{now} IST</strong></span>
          </div>
        </div>
      )}

      {/* Responsive Media Query Style Inject */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-status {
            display: flex !important;
          }
          .mobile-hamburger {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .desktop-status {
            display: none !important;
          }
          .mobile-hamburger {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
