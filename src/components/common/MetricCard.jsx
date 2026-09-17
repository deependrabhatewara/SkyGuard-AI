import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Sparkline from "./Sparkline";


export default function MetricCard({ icon: Icon, label, value, unit, prev, spark, color }) {
  const change = prev !== undefined && prev !== null ? ((value - prev) / (Math.abs(prev) || 1)) * 100 : null;

  return (
    <div
      className="saas-card saas-card-interactive"
      style={{
        padding: "16px 18px",
        background: "#FFFFFF",
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          {Icon && (
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: color ? `${color}18` : "#EDE9FE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={15} color={color || "#7C3AED"} />
            </div>
          )}
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#64748B" }}>
            {label}
          </span>
        </div>

        {change !== null && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              fontSize: 11,
              fontWeight: 700,
              color: change >= 0 ? "#10B981" : "#EF4444",
              background: change >= 0 ? "#ECFDF5" : "#FEF2F2",
              padding: "2px 6px",
              borderRadius: 6,
            }}
          >
            {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>

      <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginTop: 2, letterSpacing: "-0.02em" }}>
        {typeof value === "number" ? value.toFixed(1) : value}
        <span style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8" }}> {unit}</span>
      </div>

      {spark && (
        <div style={{ marginTop: 10, opacity: 0.85 }}>
          <Sparkline data={spark} color={color || "#7C3AED"} />
        </div>
      )}
    </div>
  );
}
