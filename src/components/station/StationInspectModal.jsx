import React, { useEffect, useCallback } from "react";
import {
  X,
  MapPin,
  Thermometer,
  Gauge,
  Droplets,
  CloudRain,
  Wind,
  Compass,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import MetricCard from "../common/MetricCard";
import SensorChart from "./SensorChart";
import AIExplanation from "./AIExplanation";
import EventValidation from "./EventValidation";
import StatusDot from "../common/StatusDot";
import { genSparkline } from "../../utils/mockData";
import { STATUS_META } from "../../constants/theme";
import { useLanguage } from "../../context/LanguageContext";

export default function StationInspectModal({
  station,
  neighbors,
  reduceMotion,
  onClose,
  onAcknowledge,
  acknowledged,
}) {
  const { t, translateState } = useLanguage();

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    // Freeze background scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e) => { if (e.target === e.currentTarget) onClose(); },
    [onClose]
  );

  if (!station) return null;

  const meta = STATUS_META[station.status] || STATUS_META.healthy;
  const isAck = acknowledged?.has(station.id);
  const statusLabel = {
    healthy: t("legendHealthy", "Healthy"),
    warning: t("legendWarning", "Warning"),
    anomaly: t("legendAnomaly", "Anomaly"),
    offline: t("legendOffline", "Offline"),
  }[station.status] || station.status;

  return (
    /* ── Overlay ── */
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "sg-modal-fade 0.22s ease-out",
      }}
    >
      {/* ── Dialog ── */}
      <div
        style={{
          background: "#F8FAFC",
          borderRadius: 28,
          boxShadow: "0 32px 80px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(124,58,237,0.15)",
          width: "100%",
          maxWidth: 1080,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "sg-modal-scale 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* ── Modal Header ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          {/* Left: Station identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MapPin size={22} color="#A5B4FC" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF", letterSpacing: -0.4 }}>
                  {station.id}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 9999,
                    background: meta.bg,
                    color: meta.color,
                    border: `1px solid ${meta.color}44`,
                  }}
                >
                  <StatusDot
                    status={station.status}
                    size={6}
                    pulse={!reduceMotion && station.status === "anomaly"}
                  />
                  {statusLabel.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(165,180,252,0.85)", marginTop: 3, fontWeight: 500 }}>
                {station.name} · {translateState(station.state)} ·{" "}
                {t("metaElevation", "Elevation")}: {station.elevation} m ·{" "}
                {t("metaQualityScore", "Quality")}: {station.dataQuality}%
              </div>
            </div>
          </div>

          {/* Right: Actions + Close */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {/* Acknowledge button (only for anomaly/warning) */}
            {(station.status === "anomaly" || station.status === "warning") && onAcknowledge && (
              <button
                onClick={() => !isAck && onAcknowledge(station.id)}
                disabled={isAck}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  color: isAck ? "#10B981" : "#FFFFFF",
                  background: isAck ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.22)",
                  border: isAck ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(239,68,68,0.5)",
                  cursor: isAck ? "default" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {isAck ? <ShieldCheck size={13} /> : <AlertTriangle size={13} />}
                {isAck ? t("acknowledgedBtn", "Acknowledged") : t("acknowledgeBtn", "Acknowledge")}
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#FFFFFF",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              aria-label="Close inspection modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Meta strip */}
          <div
            className="saas-card"
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              padding: "16px 20px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 14,
              fontSize: 13,
            }}
          >
            {[
              { label: t("metaLatitude", "Latitude"), value: `${station.lat.toFixed(3)}° N` },
              { label: t("metaLongitude", "Longitude"), value: `${station.lon.toFixed(3)}° E` },
              { label: t("metaElevation", "Elevation"), value: `${station.elevation} m` },
              { label: t("metaStationType", "Station Type"), value: station.stationType },
              { label: t("lastTelemetryPacket", "Last Packet"), value: station.lastObservation },
              { label: t("metaQualityScore", "Quality Score"), value: `${station.dataQuality}%`, highlight: true },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                <strong style={{ color: item.highlight ? "#10B981" : "#0F172A", fontSize: 14 }}>{item.value}</strong>
              </div>
            ))}
          </div>

          {/* Live sensor telemetry grid */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", letterSpacing: 0.8, marginBottom: 12 }}>
              ⚡ {t("liveStreamActiveMetric", "LIVE TELEMETRY PARAMETERS")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12 }}>
              <MetricCard icon={Thermometer} label={t("metricTemp", "Temperature")} value={station.temperature} prev={station.prevTemperature} unit="°C" spark={station.sparkTemp} color="#EF4444" />
              <MetricCard icon={Gauge} label={t("metricPressure", "Pressure")} value={station.pressure} prev={station.prevPressure} unit="hPa" spark={station.sparkPress} color="#7C3AED" />
              <MetricCard icon={Droplets} label={t("metricHumidity", "Humidity")} value={station.humidity} prev={station.prevHumidity} unit="%" spark={station.sparkHum} color="#06B6D4" />
              <MetricCard icon={CloudRain} label={t("metricRainfall", "Rainfall Rate")} value={station.rainfall} unit="mm" spark={genSparkline(station.rainfall, 12, 0.4)} color="#3B82F6" />
              <MetricCard icon={Wind} label={t("metricWind", "Wind Velocity")} value={station.windSpeed} unit="km/h" spark={genSparkline(station.windSpeed, 12, 1.2)} color="#10B981" />
              <div
                className="saas-card saas-card-interactive"
                style={{ borderRadius: 20, padding: 16, background: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
                  <Compass size={16} color="#7C3AED" />
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>{station.windDir}</div>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>{t("metricWindDirection", "Wind Direction")}</div>
              </div>
            </div>
          </div>

          {/* 24-hour charts */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", letterSpacing: 0.8, marginBottom: 12 }}>
              📈 {t("chartTempTitle", "24-HOUR SENSOR HISTORY")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              <SensorChart title={t("chartTempTitle", "Ambient Temperature")} data={station.tempHist} unit="°C" color="#EF4444" band={[station.temperature - 3, station.temperature + 3]} />
              <SensorChart title={t("chartPressTitle", "Atmospheric Pressure")} data={station.pressHist} unit="hPa" color="#7C3AED" band={[station.pressure - 4, station.pressure + 4]} />
              <SensorChart title={t("chartHumTitle", "Relative Humidity")} data={station.humHist} unit="%" color="#06B6D4" band={[station.humidity - 8, station.humidity + 8]} />
            </div>
          </div>

          {/* AI Fault Isolation */}
          <AIExplanation station={station} reduceMotion={reduceMotion} />

          {/* Cross-Station Spatial Validation */}
          <EventValidation station={station} neighbors={neighbors} />
        </div>
      </div>

      {/* ── Keyframe Animations ── */}
      <style>{`
        @keyframes sg-modal-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sg-modal-scale {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
