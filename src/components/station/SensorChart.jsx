import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ReferenceArea, ReferenceDot, ResponsiveContainer
} from "recharts";
import { useLanguage } from "../../context/LanguageContext";

export default function SensorChart({ title, data, unit, color, band }) {
  const { isHindi } = useLanguage();
  const anomalyPoint = data?.find((d) => d.anomalous);

  return (
    <div className="saas-card" style={{ borderRadius: 20, padding: 18, background: "#FFFFFF" }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
          {title} <span style={{ fontSize: 11, fontWeight: 500, color: "#94A3B8" }}>{isHindi ? "(पिछले 24 घंटे)" : "(Last 24h)"}</span>
        </span>
        <div className="flex items-center" style={{ gap: 10, fontSize: 11, color: "#64748B" }}>
          <span className="flex items-center" style={{ gap: 4 }}>
            <span style={{ width: 8, height: 8, background: "#E2E8F0", display: "inline-block", borderRadius: 2 }} />
            {isHindi ? "अपेक्षित सीमा" : "Expected Band"}
          </span>
          <span className="flex items-center" style={{ gap: 4 }}>
            <span style={{ width: 10, height: 2.5, background: color || "#7C3AED", display: "inline-block", borderRadius: 2 }} />
            {isHindi ? "टेलीमेट्री" : "Telemetry"}
          </span>
          {anomalyPoint && (
            <span className="flex items-center" style={{ gap: 4, color: "#EF4444", fontWeight: 700 }}>
              <span style={{ width: 7, height: 7, background: "#EF4444", display: "inline-block", borderRadius: "50%" }} />
              {isHindi ? "विसंगति" : "Anomaly"}
            </span>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={170}>
        <LineChart data={data} margin={{ top: 6, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#94A3B8" }} interval={4} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
          <ReferenceArea y1={band[0]} y2={band[1]} fill="#EDE9FE" fillOpacity={0.35} />
          <RTooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
              background: "#FFFFFF",
              color: "#0F172A",
              fontWeight: 600,
            }}
            formatter={(v, _n, p) => [
              `${v} ${unit}${p.payload.anomalous ? (isHindi ? " ⚠️ (विसंगति)" : " ⚠️ (ANOMALY)") : ""}`,
              isHindi ? "दर्ज मान" : "Observed"
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color || "#7C3AED"}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={600}
          />
          {anomalyPoint && (
            <ReferenceDot x={anomalyPoint.t} y={anomalyPoint.value} r={6} fill="#EF4444" stroke="#FFFFFF" strokeWidth={2} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
