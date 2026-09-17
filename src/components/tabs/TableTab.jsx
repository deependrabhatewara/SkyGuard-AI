import React, { useState, useMemo } from "react";
import { Search, FileDown, ChevronLeft, ChevronRight, Table2, ArrowRight } from "lucide-react";
import StatusDot from "../common/StatusDot";
import { STATUS_META } from "../../constants/theme";
import { useLanguage } from "../../context/LanguageContext";

const tdStyle = { padding: "12px 14px", color: "#0F172A", fontSize: 13, whiteSpace: "nowrap" };
const thStyle = {
  padding: "12px 14px",
  color: "#64748B",
  fontSize: 11.5,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  textAlign: "left",
  borderBottom: "1px solid #E2E8F0",
  background: "#F8FAFC",
  cursor: "pointer",
  userSelect: "none",
};

export default function TableTab({ stations, onSelect }) {
  const { t, translateState, isHindi } = useLanguage();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let list = stations.filter(
      (s) =>
        s.id.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.state.toLowerCase().includes(query.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [stations, query, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: "id", label: t("colStationId", "Station ID") },
    { key: "state", label: t("colState", "State") },
    { key: "temperature", label: t("colTemp", "Temp (°C)") },
    { key: "pressure", label: t("colPressure", "Pressure (hPa)") },
    { key: "humidity", label: t("colHumidity", "Humidity (%)") },
    { key: "lastObservation", label: t("colLastPing", "Last Ingestion") },
    { key: "status", label: t("colStatus", "Health Status") },
  ];

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const exportCSV = () => {
    const header = "Station ID,Location,State,Temperature,Pressure,Humidity,Last Update,Health,Anomaly\n";
    const rows = filtered
      .map((s) =>
        [
          s.id,
          s.name,
          s.state,
          s.temperature.toFixed(1),
          s.pressure.toFixed(1),
          s.humidity.toFixed(1),
          s.lastObservation,
          s.status,
          s.anomalyType || "",
        ].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skyguard_station_registry.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1240, margin: "0 auto" }}>
      {/* Top Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            <Table2 size={18} color="#7C3AED" />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: -0.3 }}>
              {t("registryTitle", "National Station Registry")}
            </h1>
            <p style={{ fontSize: 13, color: "#64748B", margin: "2px 0 0" }}>
              {isHindi ? `भारत भर में ${stations.length} स्वचालित मौसम स्टेशनों का संपूर्ण डेटाबेस` : `Complete index of ${stations.length} automatic weather stations across India`}
            </p>
          </div>
        </div>

        <div className="flex items-center" style={{ gap: 10, flexWrap: "wrap" }}>
          {/* Search Box */}
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: 11, color: "#94A3B8" }} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={t("searchRegistryPlaceholder", "Search station or state...")}
              style={{
                padding: "8px 14px 8px 36px",
                fontSize: 13,
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
                color: "#0F172A",
                outline: "none",
                width: 240,
              }}
            />
          </div>

          <button onClick={exportCSV} className="saas-btn-secondary" style={{ padding: "8px 14px", fontSize: 12.5 }}>
            <FileDown size={14} /> {t("exportCsvBtn", "Export CSV")}
          </button>
        </div>
      </div>

      {/* Table Container Card */}
      <div
        className="saas-card"
        style={{
          borderRadius: 24,
          overflow: "hidden",
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} style={thStyle} onClick={() => toggleSort(c.key)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {c.label}
                      {sortKey === c.key && (
                        <span style={{ fontSize: 10, color: "#7C3AED" }}>
                          {sortDir === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th style={{ ...thStyle, cursor: "default" }}>{t("colActions", "Action")}</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((s, idx) => {
                const meta = STATUS_META[s.status] || STATUS_META.healthy;
                const statusName = {
                  healthy: t("legendHealthy", "Healthy"),
                  warning: t("legendWarning", "Warning"),
                  anomaly: t("legendAnomaly", "Anomaly"),
                  offline: t("legendOffline", "Offline"),
                }[s.status] || meta.label;

                return (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: "1px solid #F1F5F9",
                      background: idx % 2 === 0 ? "#FFFFFF" : "#FAFBFD",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F3FF")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = idx % 2 === 0 ? "#FFFFFF" : "#FAFBFD")
                    }
                  >
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700, color: "#0F172A" }}>{s.id}</span>
                    </td>
                    <td style={tdStyle}>{translateState(s.state)}</td>
                    <td style={{ ...tdStyle, fontVariantNumeric: "tabular-nums" }}>
                      {s.temperature.toFixed(1)}°C
                    </td>
                    <td style={{ ...tdStyle, fontVariantNumeric: "tabular-nums" }}>
                      {s.pressure.toFixed(1)} hPa
                    </td>
                    <td style={{ ...tdStyle, fontVariantNumeric: "tabular-nums" }}>
                      {s.humidity.toFixed(1)}%
                    </td>
                    <td style={{ ...tdStyle, color: "#64748B" }}>{s.lastObservation}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 9px",
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 700,
                          background: meta.bg,
                          color: meta.color,
                        }}
                      >
                        <StatusDot status={s.status} size={6} />
                        {statusName}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => {
                          onSelect(s.id, true);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#7C3AED",
                          background: "#EDE9FE",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                      >
                        {t("inspectBtn", "View")} <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #E2E8F0",
            background: "#F8FAFC",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 12.5, color: "#64748B" }}>
            Showing <strong>{(page - 1) * pageSize + 1}</strong> to{" "}
            <strong>{Math.min(page * pageSize, filtered.length)}</strong> of{" "}
            <strong>{filtered.length}</strong> stations
          </div>

          <div className="flex items-center" style={{ gap: 8 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="saas-btn-secondary"
              style={{ padding: "6px 12px", fontSize: 12 }}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A", padding: "0 6px" }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="saas-btn-secondary"
              style={{ padding: "6px 12px", fontSize: 12 }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
