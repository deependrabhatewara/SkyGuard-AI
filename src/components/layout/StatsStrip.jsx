import React from "react";
import CountUp from "../common/CountUp";

import { Server, Activity, AlertTriangle, ShieldCheck, WifiOff, Clock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function StatsStrip({ stats, reduceMotion, lastSync }) {
  const { t } = useLanguage();

  const metrics = [
    {
      label: t("totalNetworkMetric", "Total AWS Network"),
      value: stats.total,
      color: "#0F172A",
      bg: "#F1F5F9",
      icon: Server,
      iconColor: "#64748B",
    },
    {
      label: t("healthyStationsMetric", "Healthy Stations"),
      value: stats.healthy,
      color: "#10B981",
      bg: "#ECFDF5",
      icon: ShieldCheck,
      iconColor: "#10B981",
    },
    {
      label: t("activeWarningsMetric", "Active Warnings"),
      value: stats.warning,
      color: "#F59E0B",
      bg: "#FFFBEB",
      icon: AlertTriangle,
      iconColor: "#F59E0B",
    },
    {
      label: t("criticalAnomaliesMetric", "Critical Anomalies"),
      value: stats.anomaly,
      color: "#EF4444",
      bg: "#FEF2F2",
      icon: Activity,
      iconColor: "#EF4444",
    },
    {
      label: t("offlineMetric", "Offline / Comms Loss"),
      value: stats.offline,
      color: "#64748B",
      bg: "#F1F5F9",
      icon: WifiOff,
      iconColor: "#94A3B8",
    },
  ];

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        padding: "16px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            flex: 1,
            minWidth: 280,
          }}
        >
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",
                  borderRadius: 16,
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: m.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={m.iconColor} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: m.color,
                      lineHeight: 1.1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    <CountUp value={m.value} reduceMotion={reduceMotion} />
                  </div>
                  <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600, marginTop: 2 }}>
                    {m.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Sync Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 14,
            background: "#F5F3FF",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            flexShrink: 0,
          }}
        >
          <Clock size={16} color="#7C3AED" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", fontVariantNumeric: "tabular-nums" }}>
              {lastSync} IST
            </div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
              {t("liveStreamActiveMetric", "Live Stream Active")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
