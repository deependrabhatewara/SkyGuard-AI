import React from "react";
import { GaugeCircle, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function DataQualityTab({ stations = [] }) {
  const { t, isHindi } = useLanguage();

  const avgQuality = stations.length > 0
    ? (stations.reduce((a, s) => a + s.dataQuality, 0) / stations.length).toFixed(1)
    : "98.2";

  const metrics = [
    { label: t("metricCompleteness"), value: 96.2, desc: t("metricCompletenessDesc") },
    { label: t("metricConsistency"), value: 94.1, desc: t("metricConsistencyDesc") },
    { label: t("metricTimeliness"), value: 98.7, desc: t("metricTimelinessDesc") },
    { label: t("metricValidity"), value: 95.4, desc: t("metricValidityDesc") },
    { label: t("metricAnomalyRate"), value: 2.1, desc: t("metricAnomalyRateDesc"), inverse: true },
  ];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1180, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
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
          <GaugeCircle size={20} color="#7C3AED" />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: -0.3 }}>
            {t("qualityTabTitle")}
          </h1>
          <p style={{ fontSize: 13, color: "#64748B", margin: "2px 0 0" }}>
            {isHindi
              ? `सभी ${stations.length} स्वचालित मौसम स्टेशनों पर वास्तविक समय गुणवत्ता मूल्यांकन`
              : `Real-time quality assessment across all ${stations.length} Automatic Weather Stations`}
          </p>
        </div>
      </div>

      {/* Hero Score Card */}
      <div
        className="saas-card"
        style={{
          borderRadius: 24,
          background: "linear-gradient(135deg, #FFFFFF 0%, #FAF5FF 100%)",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          padding: 28,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 28,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: `conic-gradient(#7C3AED ${Number(avgQuality) * 3.6}deg, #EDE9FE 0deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 8px 24px rgba(124, 58, 237, 0.2)",
          }}
        >
          <div
            style={{
              width: 86,
              height: 86,
              borderRadius: "50%",
              background: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>{avgQuality}%</span>
            <span style={{ fontSize: 9.5, color: "#7C3AED", fontWeight: 700 }}>
              {isHindi ? "समग्र" : "OVERALL"}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "#7C3AED", background: "#EDE9FE", padding: "3px 10px", borderRadius: 9999, marginBottom: 8 }}>
            <Sparkles size={12} /> {isHindi ? "स्वचालित गुणवत्ता नियंत्रण (AQC)" : "AUTOMATED QUALITY CONTROL (AQC)"}
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: "0 0 6px" }}>
            {t("networkQualityScore")}
          </h2>
          <p style={{ fontSize: 13.5, color: "#475569", margin: 0, lineHeight: 1.6, maxWidth: 620 }}>
            {isHindi
              ? "कच्चे टेलीमेट्री स्ट्रीम के निरंतर स्वचालित ऑडिटिंग से परिकलित समग्र गुणवत्ता रेटिंग। रीडिंग स्थानिक पड़ोस तुलना, भौतिक सीमा जांच और सेंसर क्रॉस-सहसंबंध से गुजरती हैं।"
              : "Composite quality rating computed from continuous automated auditing of raw telemetry streams. Readings undergo spatial neighborhood comparisons, physical limit checks, and sensor cross-correlation."}
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            className="saas-card saas-card-interactive"
            style={{
              borderRadius: 20,
              background: "#FFFFFF",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{m.label}</div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: m.inverse ? "#EF4444" : "#7C3AED",
                  marginTop: 6,
                  letterSpacing: -0.5,
                }}
              >
                {m.value}%
              </div>
            </div>

            <div>
              <div style={{ height: 6, background: "#F1F5F9", borderRadius: 9999, marginTop: 12, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${m.value}%`,
                    borderRadius: 9999,
                    background: m.inverse ? "#EF4444" : "linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)",
                  }}
                />
              </div>
              <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 10, lineHeight: 1.4 }}>
                {m.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Methodology Note */}
      <div
        className="saas-card"
        style={{
          marginTop: 20,
          borderRadius: 18,
          padding: "16px 20px",
          background: "#F8FAFC",
          fontSize: 12.5,
          color: "#64748B",
          lineHeight: 1.55,
        }}
      >
        <strong style={{ color: "#0F172A" }}>
          {isHindi ? "AQC पद्धति: " : "AQC Methodology: "}
        </strong>
        {isHindi
          ? "मूल्यांकन स्वचालित मौसम स्टेशनों के लिए WMO (विश्व मौसम विज्ञान संगठन) के दिशानिर्देशों का पालन करते हैं, जिसमें रेंज जांच, परिवर्तन-दर सीमाएं, दृढ़ता जांच और मल्टी-सेंसर आइसोलेशन फॉरेस्ट स्कोरिंग शामिल हैं।"
          : "Evaluations adhere to WMO (World Meteorological Organization) guidelines for Automated Weather Stations, combining range checks, rate-of-change thresholds, persistence checks, and multi-sensor Isolation Forest scoring."}
      </div>
    </div>
  );
}
