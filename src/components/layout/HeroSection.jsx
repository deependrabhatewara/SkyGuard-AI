import React from "react";
import { ArrowRight, ShieldCheck, Zap, Activity, Radio, Sparkles, TrendingUp, Cpu } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function HeroSection({
  stats,
  onExploreClick,
  onSimulateClick,
  selectedStation,
  reduceMotion,
}) {
  const { t, isHindi, translateState } = useLanguage();
  return (
    <section
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        borderBottom: "1px solid #E2E8F0",
        padding: "48px 24px 56px",
        overflow: "hidden",
      }}
    >
      {/* Subtle background ambient purple glow */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "10%",
          width: "550px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(6, 182, 212, 0.04) 50%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 40,
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Column: Headlines & CTA */}
        <div style={{ maxWidth: 580 }}>
          {/* Tag badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 9999,
              background: "#EDE9FE",
              border: "1px solid rgba(124, 58, 237, 0.25)",
              color: "#6D28D9",
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: 0.2,
              marginBottom: 20,
            }}
          >
            <Sparkles size={14} color="#7C3AED" />
            <span>{t("heroBadge", "AI METEOROLOGICAL INTELLIGENCE")}</span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: "clamp(32px, 4.2vw, 50px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              color: "#0F172A",
              margin: "0 0 18px",
            }}
          >
            {t("heroTitlePrefix", "Autonomous Quality Control for")}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("heroTitleHighlight", "Weather Stations")}
            </span>
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: "clamp(15px, 1.8vw, 16.5px)",
              lineHeight: 1.6,
              color: "#475569",
              margin: "0 0 28px",
            }}
          >
            {t("heroDescription", "SkyGuard AI monitors, validates, and cleans real-time telemetry from AWS networks nationwide. Intelligent anomaly isolation detects sensor drifts, sudden spikes, and hardware dropouts before corrupted data reaches forecasting models.")}
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            <button
              onClick={onExploreClick}
              className="saas-btn-primary"
              style={{ padding: "13px 26px", fontSize: 15 }}
            >
              {t("exploreNetworkBtn", "Explore Live Network")} <ArrowRight size={17} />
            </button>

            <button
              onClick={onSimulateClick}
              className="saas-btn-secondary"
              style={{ padding: "13px 22px", fontSize: 15 }}
            >
              <Zap size={16} color="#7C3AED" /> {t("injectAnomalyBtn", "Inject Anomaly Demo")}
            </button>
          </div>

          {/* Trust/Feature Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
              paddingTop: 18,
              borderTop: "1px solid #E2E8F0",
              fontSize: 13,
              color: "#64748B",
              fontWeight: 600,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldCheck size={16} color="#10B981" />
              <span>{t("verifiedTelemetryStat", "99.4% Verified Telemetry")}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Activity size={16} color="#7C3AED" />
              <span>{t("detectionLatencyStat", "< 3.2s Detection Latency")}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Cpu size={16} color="#06B6D4" />
              <span>{t("crossValidationStat", "Multi-Sensor Cross Validation")}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Interactive Cards */}
        <div
          style={{
            position: "relative",
            minHeight: 380,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Main Central Card: Live Station Radar */}
          <div
            className={`saas-card ${reduceMotion ? "" : "saas-float"}`}
            style={{
              width: "100%",
              maxWidth: 420,
              padding: 24,
              position: "relative",
              zIndex: 2,
              background: "#FFFFFF",
              border: "1px solid rgba(124, 58, 237, 0.15)",
              boxShadow: "0 20px 40px -15px rgba(124, 58, 237, 0.12), 0 10px 20px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div className="flex items-center" style={{ gap: 10 }}>
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
                  <Radio size={19} color="#7C3AED" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                    {t("telemetryStreamTitle", "National Telemetry Stream")}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>
                    {stats?.total || 98} {t("stationsIngestingLive", "Stations Ingesting Live")}
                  </div>
                </div>
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#10B981",
                  background: "#ECFDF5",
                  padding: "4px 10px",
                  borderRadius: 9999,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#10B981",
                  }}
                />
                {t("liveBadge", "LIVE")}
              </span>
            </div>

            {/* Metrics preview bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                background: "#F8FAFC",
                borderRadius: 16,
                padding: "12px 14px",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>{t("healthyStat", "HEALTHY")}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#10B981", marginTop: 2 }}>
                  {stats?.healthy || 92}
                </div>
              </div>
              <div style={{ borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>{t("warningsStat", "WARNINGS")}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#F59E0B", marginTop: 2 }}>
                  {stats?.warning || 3}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>{t("criticalStat", "CRITICAL")}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#EF4444", marginTop: 2 }}>
                  {stats?.anomaly || 3}
                </div>
              </div>
            </div>

            {/* Active Highlight Station */}
            <div
              style={{
                borderRadius: 14,
                padding: "12px 14px",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>
                  {t("currentFocus", "CURRENT FOCUS")}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A", marginTop: 1 }}>
                  {selectedStation ? `${selectedStation.id} (${translateState(selectedStation.state)})` : `AWS-MP-004 (${translateState("Madhya Pradesh")})`}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#7C3AED" }}>
                  {selectedStation ? `${selectedStation.temperature.toFixed(1)}°C` : "38.2°C"}
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>{t("ambientTemp", "Ambient Temp")}</div>
              </div>
            </div>
          </div>

          {/* Floating Top-Right Badge: AI Anomaly Alert */}
          <div
            className={`saas-card ${reduceMotion ? "" : "saas-float-delayed"}`}
            style={{
              position: "absolute",
              top: "-15px",
              right: "-10px",
              zIndex: 3,
              background: "#FFFFFF",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              padding: "12px 16px",
              borderRadius: 20,
              boxShadow: "0 12px 28px -6px rgba(239, 68, 68, 0.15), 0 4px 12px rgba(0,0,0,0.04)",
              maxWidth: 240,
            }}
          >
            <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#EF4444",
                }}
              />
              <span style={{ fontSize: 11.5, fontWeight: 800, color: "#EF4444" }}>
                {t("aiAnomalyConfirmed", "AI ANOMALY CONFIRMED")}
              </span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>
              {isHindi ? "AWS-MP-004: तापमान स्पाइक दोष" : "AWS-MP-004: Spike Fault"}
            </div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
              {t("confidencePrefix", "Confidence")}: <strong>96%</strong> ({t("isolationForest", "Isolation Forest")})
            </div>
          </div>

          {/* Floating Bottom-Left Badge: Quality Score */}
          <div
            className={`saas-card ${reduceMotion ? "" : "saas-float"}`}
            style={{
              position: "absolute",
              bottom: "-15px",
              left: "-10px",
              zIndex: 3,
              background: "#FFFFFF",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              padding: "12px 18px",
              borderRadius: 20,
              boxShadow: "0 12px 28px -6px rgba(16, 185, 129, 0.15), 0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center" style={{ gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "#ECFDF5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={16} color="#10B981" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                  98.4% {t("accuracyBadge", "Accuracy")}
                </div>
                <div style={{ fontSize: 11, color: "#64748B" }}>
                  {t("crossStationVerified", "Cross-Station Verified")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
