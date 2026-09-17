import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Header from "./components/layout/Header";
import TabBar from "./components/layout/TabBar";
import Footer from "./components/layout/Footer";

import Sidebar from "./components/dashboard/Sidebar";
import IndiaMap from "./components/map/IndiaMap";
import SimulationPanel from "./components/dashboard/SimulationPanel";
import StationDetail from "./components/station/StationDetail";
import StationInspectModal from "./components/station/StationInspectModal";
import EventTimeline from "./components/dashboard/EventTimeline";
import AnomalyIntelligencePanel from "./components/dashboard/AnomalyIntelligencePanel";

import AlertCenterTab from "./components/tabs/AlertCenterTab";
import TableTab from "./components/tabs/TableTab";
import DataQualityTab from "./components/tabs/DataQualityTab";
import ModelPerformanceTab from "./components/tabs/ModelPerformanceTab";

import { useStations, rand, pick } from "./utils/mockData";
import { ANOMALY_TYPES } from "./constants/theme";
import { useLanguage } from "./context/LanguageContext";
import {
  checkBackendHealth,
  fetchLiveStations,
  mergeLiveObservationIntoStation,
  postObservation,
} from "./services/api";

export default function SkyGuardAI() {
  const { language, setLanguage, isHindi, translateAnomaly } = useLanguage();
  const stationsInit = useStations();
  const [stations, setStations] = useState(stationsInit);
  const [selectedId, setSelectedId] = useState(stationsInit[3]?.id || null);
  const [filters, setFilters] = useState({ query: "", state: "all", status: "all" });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [acknowledged, setAcknowledged] = useState(new Set());
  const [inspectedStationId, setInspectedStationId] = useState(null);
  const [injecting, setInjecting] = useState(false);
  const [events, setEvents] = useState([
    {
      time: "09:41:32",
      text: isHindi
        ? "तापमान स्पाइक पहचाना गया — AWS-MP-004"
        : "Temperature spike identified — AWS-MP-004",
      color: "#EF4444",
    },
    {
      time: "09:41:34",
      text: isHindi
        ? "क्रॉस-सेंसर सत्यापन पूर्ण: कोई क्षेत्रीय पुष्टि नहीं मिली"
        : "Cross-sensor validation completed: no regional corroboration",
      color: "#7C3AED",
    },
    {
      time: "09:41:36",
      text: isHindi
        ? "एआई आइसोलेशन फॉरेस्ट द्वारा विसंगति की पुष्टि (96% विश्वसनीयता)"
        : "Anomaly confirmed by AI Isolation Forest (96% confidence)",
      color: "#EF4444",
    },
  ]);
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const [now, setNow] = useState(() => new Date().toLocaleTimeString(isHindi ? "hi-IN" : "en-IN", { hour12: false }));

  const [isOnline, setIsOnline] = useState(
    () => typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncWithBackend = async () => {
      const isHealthy = await checkBackendHealth();
      if (!isMounted) return;
      setBackendConnected(isHealthy);

      if (isHealthy) {
        try {
          const liveStations = await fetchLiveStations();
          if (liveStations && liveStations.length > 0 && isMounted) {
            setStations((prev) => {
              const liveMap = new Map(liveStations.map((s) => [s.id, s]));
              return prev.map((s) => {
                const live = liveMap.get(s.id);
                return live ? mergeLiveObservationIntoStation(s, live) : s;
              });
            });
          }
        } catch (err) {
          console.warn("SkyGuard: Live API sync skipped, using local engine", err);
        }
      }
    };

    syncWithBackend();

    const pollTimer = setInterval(() => {
      if (typeof navigator === "undefined" || navigator.onLine) {
        syncWithBackend();
      }
    }, 6000);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toLocaleTimeString("en-IN", { hour12: false })), 1000);
    return () => clearInterval(t);
  }, []);

  const stateOptions = useMemo(() => [...new Set(stations.map((s) => s.state))].sort(), [stations]);

  const filtered = useMemo(() => stations.filter((s) => {
    if (filters.state !== "all" && s.state !== filters.state) return false;
    if (filters.status !== "all" && s.status !== filters.status) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      if (!s.id.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q) && !s.state.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [stations, filters]);

  const selectedStation = stations.find((s) => s.id === selectedId) || null;

  const neighbors = useMemo(() => {
    if (!selectedStation) return [];
    return stations
      .filter((s) => s.id !== selectedStation.id)
      .map((s) => ({ ...s, dist: Math.hypot(s.lat - selectedStation.lat, s.lon - selectedStation.lon) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3);
  }, [stations, selectedStation]);

  const stationDetailRef = useRef(null);

  const handleSelect = useCallback((id, scroll = true) => {
    setSelectedId(id);
    setActiveTab("dashboard");

    const target = stations.find((s) => s.id === id);
    if (target) {
      setFilters((prev) => {
        const stateMismatch = prev.state !== "all" && prev.state !== target.state;
        const statusMismatch = prev.status !== "all" && prev.status !== target.status;
        const queryMismatch =
          prev.query &&
          !target.id.toLowerCase().includes(prev.query.toLowerCase()) &&
          !target.name.toLowerCase().includes(prev.query.toLowerCase());

        if (stateMismatch || statusMismatch || queryMismatch) {
          return { query: "", state: "all", status: "all" };
        }
        return prev;
      });
    }

    if (scroll) {
      setTimeout(() => {
        stationDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [stations]);

  const handleAcknowledge = useCallback((id) => {
    setAcknowledged((prev) => new Set(prev).add(id));
  }, []);

  const handleInspect = useCallback((id) => {
    setSelectedId(id);
    setInspectedStationId(id);
  }, []);

  const inspectedStation = stations.find((s) => s.id === inspectedStationId) || null;
  const inspectedNeighbors = useMemo(() => {
    if (!inspectedStation) return [];
    return stations
      .filter((s) => s.id !== inspectedStation.id)
      .map((s) => ({ ...s, dist: Math.hypot(s.lat - inspectedStation.lat, s.lon - inspectedStation.lon) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3);
  }, [stations, inspectedStation]);

  const pushEvent = (text, color) => {
    const t = new Date().toLocaleTimeString("en-IN", { hour12: false });
    setEvents((prev) => [{ time: t, text, color }, ...prev].slice(0, 30));
  };

  const handleInject = (faultType) => {
    let targetId = selectedId;
    if (!targetId || stations.find((s) => s.id === targetId)?.status === "offline") {
      const healthy = stations.find((s) => s.status === "healthy");
      targetId = healthy ? healthy.id : stations[0].id;
      setSelectedId(targetId);
    }
    setInjecting(true);
    pushEvent(`Observation received — ${targetId}`, "#6366F1");

    setTimeout(() => {
      setStations((prev) => prev.map((s) => {
        if (s.id !== targetId) return s;
        const anomalyIdx = 23;
        const isExtreme = faultType === "extreme_weather";
        const delta = isExtreme ? rand(6, 10) : pick([1, -1]) * rand(9, 17);
        const newTempHist = [...s.tempHist];
        newTempHist[anomalyIdx] = {
          ...newTempHist[anomalyIdx],
          value: Number((newTempHist[anomalyIdx].value + delta).toFixed(2)),
          anomalous: true,
        };
        return {
          ...s,
          status: "anomaly",
          anomalyType: faultType,
          anomalySource: isExtreme ? "genuine_weather" : "sensor_fault",
          anomalyIdx,
          confidence: Number(rand(0.86, 0.98).toFixed(2)),
          temperature: newTempHist[anomalyIdx].value,
          tempHist: newTempHist,
          lastObservation: "just now",
        };
      }));

      if (faultType === "extreme_weather") {
        setStations((prev) => {
          const target = prev.find((s) => s.id === targetId);
          if (!target) return prev;
          const near = prev
            .filter((s) => s.id !== targetId)
            .map((s) => ({ ...s, dist: Math.hypot(s.lat - target.lat, s.lon - target.lon) }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 2)
            .map((s) => s.id);
          return prev.map((s) =>
            near.includes(s.id)
              ? { ...s, status: "warning", anomalyType: "extreme_weather", confidence: Number(rand(0.6, 0.75).toFixed(2)) }
              : s
          );
        });
      }

      pushEvent(
        isHindi
          ? "मल्टी-सेंसर क्रॉस सत्यापन आरंभ किया गया"
          : "Multi-sensor cross validation initiated",
        "#7C3AED"
      );
      pushEvent(
        isHindi
          ? `${translateAnomaly(faultType)} पहचानी गई — ${targetId}`
          : `${ANOMALY_TYPES[faultType]?.label || "Anomaly"} detected — ${targetId}`,
        "#EF4444"
      );
      pushEvent(
        isHindi
          ? `एआई डिटेक्शन इंजन ने ${targetId} पर दोष की पुष्टि की`
          : `AI Detection Engine confirmed fault on ${targetId}`,
        "#EF4444"
      );

      if (backendConnected) {
        const targetStation = stations.find((st) => st.id === targetId);
        if (targetStation) {
          postObservation({
            station_id: targetId,
            temperature: targetStation.temperature,
            pressure: targetStation.pressure,
            humidity: targetStation.humidity,
            wind_speed: targetStation.windSpeed,
            wind_dir: targetStation.windDir,
            rainfall: targetStation.rainfall,
          }).catch((err) => console.warn("Backend telemetry sync skipped:", err));
        }
      }

      setInjecting(false);
    }, 1200);
  };

  const alertCount = stations.filter((s) => s.status === "anomaly" && !acknowledged.has(s.id)).length;

  const monitorRef = useRef(null);
  const simulationRef = useRef(null);

  const scrollToMonitoring = () => {
    setActiveTab("dashboard");
    setTimeout(() => {
      monitorRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div
      style={{
        fontFamily:
          language === "hi"
            ? "'Noto Sans Devanagari Variable', sans-serif"
            : "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        background: "#F8FAFC",
        minHeight: "100%",
        fontSize: `${14 * fontScale}px`,
        color: "#0F172A",
        filter: highContrast ? "contrast(1.25) saturate(1.1)" : "none",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Sticky Glassmorphic Navbar */}
      <Header
        fontScale={fontScale}
        setFontScale={setFontScale}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        reduceMotion={reduceMotion}
        setReduceMotion={setReduceMotion}
        now={now}
        isOnline={isOnline}
        setLanguage={setLanguage}
        language={language}
        backendConnected={backendConnected}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={alertCount}
        onExploreClick={scrollToMonitoring}
      />

      {/* Primary Navigation Tabs */}
      <TabBar
        active={activeTab}
        setActive={setActiveTab}
        alertCount={alertCount}
        language={language}
      />

      {/* Main Content Area */}
      <main id="main-content" style={{ minHeight: 700, padding: "28px 20px 40px", maxWidth: 1440, margin: "0 auto" }}>
        {activeTab === "dashboard" && (
          <div
            ref={monitorRef}
            className="dashboard-container"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              width: "100%",
            }}
          >
            {/* Left Column: Filter Sidebar */}
            <Sidebar
              filters={filters}
              setFilters={setFilters}
              stateOptions={stateOptions}
              resultCount={filtered.length}
            />

            {/* Middle Column: Map, Sandbox, Station Detail & Live Timeline */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Satellite Map */}
              <IndiaMap
                stations={filtered}
                selectedId={selectedId}
                onSelect={handleSelect}
                onInspect={handleInspect}
                reduceMotion={reduceMotion}
              />

              {/* Simulation Sandbox */}
              <div ref={simulationRef}>
                <SimulationPanel
                  selectedStation={selectedStation}
                  onInject={handleInject}
                  injecting={injecting}
                />
              </div>

              {/* Station Detail Card */}
              <div ref={stationDetailRef} style={{ scrollMarginTop: "80px" }}>
                <StationDetail
                  key={selectedStation?.id || "empty"}
                  station={selectedStation}
                  neighbors={neighbors}
                  reduceMotion={reduceMotion}
                />
              </div>

              {/* Live Event Audit Timeline */}
              <EventTimeline events={events} />
            </div>

            {/* Right Column: AI Anomaly Intelligence Panel */}
            <AnomalyIntelligencePanel
              stations={stations}
              onSelect={handleSelect}
              onInspect={handleInspect}
              onAcknowledge={handleAcknowledge}
              acknowledged={acknowledged}
            />
          </div>
        )}

        {activeTab === "alerts" && (
          <AlertCenterTab
            stations={stations}
            acknowledged={acknowledged}
            onAcknowledge={handleAcknowledge}
            onSelect={handleSelect}
            onInspect={handleInspect}
          />
        )}

        {activeTab === "table" && (
          <TableTab
            stations={stations}
            onSelect={handleSelect}
            onInspect={handleInspect}
          />
        )}

        {activeTab === "quality" && <DataQualityTab stations={stations} />}
        {activeTab === "performance" && <ModelPerformanceTab />}
      </main>

      {/* Modern SaaS Footer */}
      <Footer onNavigate={setActiveTab} />

      {/* Station Full-Screen Inspection Modal */}
      {inspectedStation && (
        <StationInspectModal
          station={inspectedStation}
          neighbors={inspectedNeighbors}
          reduceMotion={reduceMotion}
          onClose={() => setInspectedStationId(null)}
          onAcknowledge={handleAcknowledge}
          acknowledged={acknowledged}
        />
      )}

      {/* Responsive Dashboard Grid Styles */}
      <style>{`
        @media (max-width: 1200px) {
          .dashboard-container {
            flex-direction: column !important;
          }
          .dashboard-container > aside {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
