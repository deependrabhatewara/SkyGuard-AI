import React from "react";
import { Search, RotateCcw, Filter, MapPin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const fieldLabel = {
  fontSize: 12,
  fontWeight: 700,
  color: "#0F172A",
  marginBottom: 8,
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const selectStyle = {
  width: "100%",
  padding: "9px 12px",
  fontSize: 13,
  fontWeight: 500,
  border: "1px solid #E2E8F0",
  borderRadius: 12,
  background: "#F8FAFC",
  color: "#0F172A",
  outline: "none",
  transition: "border-color 0.2s ease",
};

export default function Sidebar({ filters, setFilters, stateOptions, resultCount }) {
  const { t, translateState } = useLanguage();
  const update = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const reset = () => setFilters({ query: "", state: "all", status: "all" });

  const statusLabels = {
    all: t("allStationsFilter", "All Stations"),
    healthy: t("healthyFilter", "Healthy"),
    warning: t("warningFilter", "Warning"),
    anomaly: t("anomalyFilter", "Anomaly"),
    offline: t("offlineFilter", "Offline"),
  };

  return (
    <aside
      className="saas-card"
      style={{
        width: 280,
        flexShrink: 0,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
      aria-label="Station filters"
    >
      <div className="flex items-center justify-between">
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", letterSpacing: 0.3, display: "flex", alignItems: "center", gap: 8 }}>
          <Filter size={15} color="#7C3AED" />
          <span>{t("filterStationsTitle", "FILTER STATIONS")}</span>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            background: "#F5F3FF",
            color: "#7C3AED",
            padding: "2px 8px",
            borderRadius: 9999,
          }}
        >
          {resultCount} {t("matchesCount", "Matches")}
        </span>
      </div>

      {/* Search Input */}
      <div>
        <div style={fieldLabel}>{t("searchQueryLabel", "Search Query")}</div>
        <div style={{ position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 11, top: 11, color: "#94A3B8" }} />
          <input
            id="station-search"
            value={filters.query}
            onChange={(e) => update("query", e.target.value)}
            placeholder={t("searchPlaceholder", "Search by ID, city, state...")}
            style={{
              width: "100%",
              padding: "9px 12px 9px 34px",
              fontSize: 13,
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              outline: "none",
              color: "#0F172A",
              background: "#F8FAFC",
              transition: "all 0.2s ease",
            }}
          />
        </div>
      </div>

      {/* Quick Status Filters */}
      <div>
        <div style={fieldLabel}>{t("healthStatusLabel", "Health Status")}</div>
        <div className="flex flex-wrap" style={{ gap: 6 }}>
          {["all", "healthy", "warning", "anomaly", "offline"].map((s) => {
            const isSelected = filters.status === s;
            return (
              <button
                key={s}
                onClick={() => update("status", s)}
                style={{
                  fontSize: 12,
                  padding: "6px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  border: `1px solid ${isSelected ? "#7C3AED" : "#E2E8F0"}`,
                  background: isSelected ? "#7C3AED" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#475569",
                  fontWeight: 600,
                  transition: "all 0.18s ease",
                  boxShadow: isSelected ? "0 2px 8px rgba(124, 58, 237, 0.25)" : "none",
                }}
              >
                {statusLabels[s] || s}
              </button>
            );
          })}
        </div>
      </div>

      {/* State Filter Dropdown */}
      <div>
        <label htmlFor="state-filter" style={fieldLabel}>
          <MapPin size={13} color="#64748B" /> {t("regionalStateLabel", "Regional State")}
        </label>
        <select
          id="state-filter"
          value={filters.state}
          onChange={(e) => update("state", e.target.value)}
          style={selectStyle}
        >
          <option value="all">{t("allStatesOption", "All States & Territories")}</option>
          {stateOptions.map((s) => (
            <option key={s} value={s}>
              {translateState(s)}
            </option>
          ))}
        </select>
      </div>

      {/* Parameter Filter */}
      <div>
        <div style={fieldLabel}>{t("primaryMetricLabel", "Primary Metric")}</div>
        <select style={selectStyle} defaultValue="all">
          <option value="all">{t("allMetricsOption", "All Meteorological Metrics")}</option>
          <option>{t("tempMetricOption", "Temperature (°C)")}</option>
          <option>{t("pressureMetricOption", "Atmospheric Pressure (hPa)")}</option>
          <option>{t("humidityMetricOption", "Relative Humidity (%)")}</option>
          <option>{t("rainfallMetricOption", "Rainfall (mm)")}</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={reset}
        className="saas-btn-secondary"
        style={{
          width: "100%",
          padding: "10px",
          fontSize: 13,
          marginTop: 4,
          justifyContent: "center",
        }}
      >
        <RotateCcw size={14} /> {t("resetFiltersBtn", "Reset All Filters")}
      </button>
    </aside>
  );
}
