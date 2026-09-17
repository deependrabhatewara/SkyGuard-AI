import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "../../context/LanguageContext";

function MapRecenter({ selectedStation }) {
  const map = useMap();
  useEffect(() => {
    if (selectedStation?.lat && selectedStation?.lon) {
      map.flyTo([selectedStation.lat, selectedStation.lon], Math.max(map.getZoom(), 6), {
        duration: 1.2,
      });
    }
  }, [selectedStation?.id, selectedStation?.lat, selectedStation?.lon, map]);
  return null;
}

export default function IndiaMap({ stations, selectedId, onSelect, reduceMotion }) {
  const { t, translateAnomaly } = useLanguage();
  const [hovered, setHovered] = useState(null);
  const hoveredStation = stations.find((s) => s.id === hovered);

  const statusColors = {
    healthy: "#22c55e",
    warning: "#f59e0b",
    anomaly: "#ef4444",
    offline: "#94a3b8",
  };

  const statusLabels = {
    healthy: t("legendHealthy", "Healthy"),
    warning: t("legendWarning", "Warning"),
    anomaly: t("legendAnomaly", "Anomaly"),
    offline: t("legendOffline", "Offline"),
  };

  const stationIcon = (station) => {
    const color = statusColors[station.status] || "#22c55e";
    const isAnomaly = station.status === "anomaly";
    const isSelected = station.id === selectedId;

    return L.divIcon({
      className: "",
      html: `
        <div style="
          position: relative;
          width: ${isSelected ? 30 : 24}px;
          height: ${isSelected ? 30 : 24}px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${
            isAnomaly && !reduceMotion
              ? `
                <div style="
                  position:absolute;
                  width:30px;
                  height:30px;
                  border-radius:50%;
                  background:${color};
                  opacity:0.35;
                  animation:sg-map-pulse 1.6s ease-out infinite;
                "></div>
              `
              : ""
          }

          ${
            isSelected
              ? `
                <div style="
                  position:absolute;
                  width:32px;
                  height:32px;
                  border-radius:50%;
                  border:2px solid #38bdf8;
                  animation:${reduceMotion ? "none" : "sg-map-ring 1.5s ease-out infinite"};
                "></div>
              `
              : ""
          }

          <div style="
            position:relative;
            z-index:2;
            width:${isSelected ? 18 : 14}px;
            height:${isSelected ? 18 : 14}px;
            border-radius:50%;
            background:${color};
            border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.45);
          "></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  return (
    <div
      className="saas-card"
      style={{
        position: "relative",
        background: "#0F172A",
        borderRadius: 24,
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.06)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 18px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
          color: "#0F172A",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A", letterSpacing: -0.2 }}>
            {t("mapHeaderTitle", "India AWS Telemetry Network")}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#64748B",
              marginTop: 1,
              fontWeight: 500,
            }}
          >
            {t("mapHeaderSubtitle", "Live ESRI satellite layer · 98 active automatic weather stations")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11.5,
            fontWeight: 600,
            flexWrap: "wrap",
          }}
        >
          {Object.entries(statusColors).map(([status, color]) => (
            <span
              key={status}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 8px",
                borderRadius: 9999,
                background: status === "anomaly" ? "#FEF2F2" : status === "warning" ? "#FFFBEB" : status === "healthy" ? "#ECFDF5" : "#F1F5F9",
                color: status === "anomaly" ? "#EF4444" : status === "warning" ? "#D97706" : status === "healthy" ? "#059669" : "#64748B",
                border: `1px solid ${color}33`,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: status === "anomaly" ? `0 0 6px ${color}` : "none",
                }}
              />
              {statusLabels[status]}
            </span>
          ))}
        </div>
      </div>

      <MapContainer
        center={[22.5, 79]}
        zoom={5}
        minZoom={4}
        maxZoom={12}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "560px",
          background: "#111827",
        }}
      >
        <TileLayer
          attribution='&copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        <MapRecenter selectedStation={stations.find((s) => s.id === selectedId)} />

        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lon]}
            icon={stationIcon(station)}
            eventHandlers={{
              mouseover: () => setHovered(station.id),
              mouseout: () => setHovered(null),
              click: () => onSelect(station.id, false),
            }}
          >
            <Popup>
              <div
                style={{
                  minWidth: 210,
                  fontFamily: "Inter, Segoe UI, sans-serif",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0B2545",
                    marginBottom: 3,
                  }}
                >
                  {station.id}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#5A6B7C",
                    marginBottom: 10,
                  }}
                >
                  {station.name}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 7,
                    fontSize: 11.5,
                  }}
                >
                  <div>
                    🌡️ <b>{station.temperature.toFixed(1)}°C</b>
                  </div>
                  <div>
                    💧 <b>{station.humidity.toFixed(0)}%</b>
                  </div>
                  <div>
                    🧭 <b>{station.pressure.toFixed(0)} hPa</b>
                  </div>
                  <div>
                    💨 <b>{station.windSpeed} km/h</b>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 8,
                    borderTop: "1px solid #DBE1E7",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: statusColors[station.status],
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: statusColors[station.status],
                    }}
                  />
                  {statusLabels[station.status]}
                </div>

                {station.anomalyType && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: "6px 8px",
                      borderRadius: 5,
                      background:
                        station.status === "anomaly"
                          ? "#FBEAE7"
                          : "#FBF1D9",
                      color:
                        station.status === "anomaly"
                          ? "#B23327"
                          : "#9C6B0B",
                      fontSize: 10.5,
                      fontWeight: 600,
                    }}
                  >
                    ⚠️ {translateAnomaly(station.anomalyType) || "Data anomaly detected"}
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(station.id, true);
                  }}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "7px 12px",
                    background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                    color: "#FFFFFF",
                    borderRadius: 8,
                    border: "none",
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(124, 58, 237, 0.3)",
                  }}
                >
                  {t("inspectStationBtn", "Inspect Station")} →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {hoveredStation && (
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            zIndex: 1000,
            background: "rgba(8,27,52,0.94)",
            backdropFilter: "blur(8px)",
            color: "white",
            padding: "9px 12px",
            borderRadius: 6,
            fontSize: 11,
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontWeight: 700 }}>{hoveredStation.id}</div>
          <div style={{ color: "rgba(255,255,255,0.72)" }}>{hoveredStation.name}</div>
        </div>
      )}

      <style>{`
        @keyframes sg-map-pulse {
          0% {
            transform: scale(0.7);
            opacity: 0.65;
          }
          70% {
            transform: scale(2.1);
            opacity: 0;
          }
          100% {
            transform: scale(2.1);
            opacity: 0;
          }
        }

        @keyframes sg-map-ring {
          0% {
            transform: scale(0.7);
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }

        .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
    </div>
  );
}
