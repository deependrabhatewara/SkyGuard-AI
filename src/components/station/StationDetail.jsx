import React from "react";
import { MapPin, Thermometer, Gauge, Droplets, CloudRain, Wind, Compass } from "lucide-react";
import StatusDot from "../common/StatusDot";

import MetricCard from "../common/MetricCard";
import SensorChart from "./SensorChart";
import AIExplanation from "./AIExplanation";
import EventValidation from "./EventValidation";
import { genSparkline } from "../../utils/mockData";
import { STATUS_META } from "../../constants/theme";
import { useLanguage } from "../../context/LanguageContext";

const metaLabel = { fontSize: 11, color: "#64748B", fontWeight: 600, marginBottom: 2 };

export default function StationDetail({ station, neighbors, reduceMotion }) {
  const { t, translateState } = useLanguage();

  if (!station) {
    return (
      <div
        className="saas-card"
        style={{
          borderRadius: 24,
          padding: 48,
          textAlign: "center",
          color: "#94A3B8",
          background: "#FFFFFF",
        }}
      >
        <MapPin size={28} color="#7C3AED" style={{ marginBottom: 10 }} />
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
          {t("noStationSelectedTitle", "No Weather Station Selected")}
        </div>
        <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
          {t("noStationSelectedSubtitle", "Click any weather station dot on the India map to inspect live sensor feeds, charts, and AI diagnostics.")}
        </div>
      </div>
    );
  }

  const statusLabel = {
    healthy: t("legendHealthy", "Healthy"),
    warning: t("legendWarning", "Warning"),
    anomaly: t("legendAnomaly", "Anomaly"),
    offline: t("legendOffline", "Offline"),
  }[station.status] || station.status;

  const meta = STATUS_META[station.status] || STATUS_META.healthy;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Station Overview Header Card */}
      <div
        className="saas-card"
        style={{
          padding: 22,
          borderRadius: 24,
          background: "#FFFFFF",
          border: "1px solid rgba(124, 58, 237, 0.25)",
          boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.08)",
        }}
      >
        <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="flex items-center" style={{ gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: -0.3 }}>
                {station.id}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 9999,
                  background: meta.bg,
                  color: meta.color,
                  border: `1px solid ${meta.color}33`,
                }}
              >
                <StatusDot status={station.status} size={7} pulse={!reduceMotion && station.status === "anomaly"} />
                {statusLabel.toUpperCase()}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 9999,
                  background: "#EDE9FE",
                  color: "#7C3AED",
                  border: "1px solid rgba(124, 58, 237, 0.25)",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7C3AED" }} />
                {t("currentFocus", "ACTIVE INSPECTION")}
              </span>
            </div>
            <div style={{ fontSize: 13.5, color: "#475569", fontWeight: 500, marginTop: 3 }}>
              {station.name} · {translateState(station.state)}
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#64748B",
              background: "#F8FAFC",
              padding: "6px 12px",
              borderRadius: 10,
              border: "1px solid #E2E8F0",
              fontWeight: 500,
            }}
          >
            {t("lastTelemetryPacket", "Last Telemetry Packet")}: <strong style={{ color: "#0F172A" }}>{station.lastObservation}</strong>
          </div>
        </div>

        {/* Metadata Strip */}
        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 12,
            fontSize: 13,
            borderTop: "1px solid #F1F5F9",
            paddingTop: 16,
          }}
        >
          <div><div style={metaLabel}>{t("metaLatitude", "Latitude")}</div><strong style={{ color: "#0F172A" }}>{station.lat.toFixed(3)}° N</strong></div>
          <div><div style={metaLabel}>{t("metaLongitude", "Longitude")}</div><strong style={{ color: "#0F172A" }}>{station.lon.toFixed(3)}° E</strong></div>
          <div><div style={metaLabel}>{t("metaElevation", "Elevation")}</div><strong style={{ color: "#0F172A" }}>{station.elevation} m</strong></div>
          <div><div style={metaLabel}>{t("metaStationType", "Station Type")}</div><strong style={{ color: "#0F172A" }}>{station.stationType}</strong></div>
          <div><div style={metaLabel}>{t("metaQualityScore", "Quality Score")}</div><strong style={{ color: "#10B981" }}>{station.dataQuality}%</strong></div>
        </div>
      </div>

      {/* Sensor Metric Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        <MetricCard
          icon={Thermometer}
          label={t("metricTemp", "Temperature")}
          value={station.temperature}
          prev={station.prevTemperature}
          unit="°C"
          spark={station.sparkTemp}
          color="#EF4444"
        />
        <MetricCard
          icon={Gauge}
          label={t("metricPressure", "Pressure")}
          value={station.pressure}
          prev={station.prevPressure}
          unit="hPa"
          spark={station.sparkPress}
          color="#7C3AED"
        />
        <MetricCard
          icon={Droplets}
          label={t("metricHumidity", "Humidity")}
          value={station.humidity}
          prev={station.prevHumidity}
          unit="%"
          spark={station.sparkHum}
          color="#06B6D4"
        />
        <MetricCard
          icon={CloudRain}
          label={t("metricRainfall", "Rainfall Rate")}
          value={station.rainfall}
          unit="mm"
          spark={genSparkline(station.rainfall, 12, 0.4)}
          color="#3B82F6"
        />
        <MetricCard
          icon={Wind}
          label={t("metricWind", "Wind Velocity")}
          value={station.windSpeed}
          unit="km/h"
          spark={genSparkline(station.windSpeed, 12, 1.2)}
          color="#10B981"
        />
        <div
          className="saas-card saas-card-interactive"
          style={{
            borderRadius: 20,
            padding: 16,
            background: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "#F5F3FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
            }}
          >
            <Compass size={18} color="#7C3AED" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>
            {station.windDir}
          </div>
          <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>{t("metricWindDirection", "Wind Direction")}</div>
        </div>
      </div>

      {/* 24-Hour Historical Sensor Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <SensorChart
          title={t("chartTempTitle", "Ambient Temperature")}
          data={station.tempHist}
          unit="°C"
          color="#EF4444"
          band={[station.temperature - 3, station.temperature + 3]}
        />
        <SensorChart
          title={t("chartPressTitle", "Atmospheric Pressure")}
          data={station.pressHist}
          unit="hPa"
          color="#7C3AED"
          band={[station.pressure - 4, station.pressure + 4]}
        />
        <SensorChart
          title={t("chartHumTitle", "Relative Humidity")}
          data={station.humHist}
          unit="%"
          color="#06B6D4"
          band={[station.humidity - 8, station.humidity + 8]}
        />
      </div>

      {/* AI Explanation & Cross-Station Validation */}
      <AIExplanation station={station} reduceMotion={reduceMotion} />
      <EventValidation station={station} neighbors={neighbors} />
    </div>
  );
}
