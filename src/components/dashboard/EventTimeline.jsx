import React from "react";
import { Clock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function EventTimeline({ events = [] }) {
  const { t } = useLanguage();

  return (
    <div className="saas-card" style={{ padding: "20px 24px", borderRadius: 24, background: "#FFFFFF" }}>
      <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
        <Clock size={17} color="#7C3AED" />
        <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A" }}>
          {t("timelineTitle", "LIVE SYSTEM EVENT AUDIT")}
        </span>
      </div>
      <div style={{ maxHeight: 200, overflowY: "auto", paddingRight: 4 }}>
        {events.length === 0 && (
          <div style={{ fontSize: 12.5, color: "#94A3B8" }}>
            {t("noEventsLogged", "No events logged yet.")}
          </div>
        )}
        {events.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 12, position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: e.color || "#7C3AED",
                  marginTop: 4,
                  boxShadow: `0 0 6px ${e.color || "#7C3AED"}66`,
                }}
              />
              {i < events.length - 1 && <span style={{ width: 1.5, flex: 1, background: "#E2E8F0", marginTop: 4 }} />}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                {e.time} IST
              </div>
              <div style={{ fontSize: 13, color: "#0F172A", fontWeight: 500, marginTop: 1 }}>
                {e.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
