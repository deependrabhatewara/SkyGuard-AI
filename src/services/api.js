/**
 * SkyGuard AI - REST API Client
 * Connects the React/Vite frontend with the FastAPI backend (http://localhost:8000).
 * Handles live polling, telemetry posting, and health detection with graceful offline fallback.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Check if the FastAPI backend is running and healthy.
 * Times out after 2 seconds to avoid blocking the UI.
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === "healthy";
  } catch {
    return false;
  }
}

/**
 * Fetch all registered weather stations with their latest observations.
 */
export async function fetchLiveStations() {
  const res = await fetch(`${API_BASE_URL}/stations`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to fetch stations from API`);
  }
  return await res.json();
}

/**
 * Fetch historical time series observations for charts.
 */
export async function fetchStationHistory(stationId, hours = 24) {
  const res = await fetch(
    `${API_BASE_URL}/stations/${encodeURIComponent(stationId)}/history?hours=${hours}`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to fetch history for ${stationId}`);
  }
  return await res.json();
}

/**
 * Ingest one or more telemetry observations into the backend.
 */
export async function postObservation(observationOrList) {
  const res = await fetch(`${API_BASE_URL}/observations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(observationOrList),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: Failed to post telemetry`);
  }
  return await res.json();
}

/**
 * Merge live API telemetry into an existing local station model.
 * Preserves sparklines, history buffers, and anomaly metadata seamlessly.
 */
export function mergeLiveObservationIntoStation(existing, liveData) {
  if (!liveData || !liveData.latest_observation) {
    return existing;
  }
  const obs = liveData.latest_observation;
  const newTemp = obs.temperature;
  const newPress = obs.pressure;
  const newHum = obs.humidity;

  // Append new point to history buffers, keeping up to 24 hourly points
  const timeLabel = new Date(obs.ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const updatedTempHist = [
    ...(existing.tempHist || []).slice(-23),
    { t: timeLabel, value: newTemp, anomalous: false },
  ];

  const updatedPressHist = [
    ...(existing.pressHist || []).slice(-23),
    { t: timeLabel, value: newPress, anomalous: false },
  ];

  const updatedHumHist = [
    ...(existing.humHist || []).slice(-23),
    { t: timeLabel, value: newHum, anomalous: false },
  ];

  // Update sparklines
  const updatedSparkTemp = [...(existing.sparkTemp || []).slice(-11), newTemp];
  const updatedSparkPress = [...(existing.sparkPress || []).slice(-11), newPress];
  const updatedSparkHum = [...(existing.sparkHum || []).slice(-11), newHum];

  return {
    ...existing,
    temperature: newTemp,
    pressure: newPress,
    humidity: newHum,
    windSpeed: obs.wind_speed,
    windDir: obs.wind_dir,
    rainfall: obs.rainfall,
    prevTemperature: existing.temperature,
    prevPressure: existing.pressure,
    prevHumidity: existing.humidity,
    tempHist: updatedTempHist,
    pressHist: updatedPressHist,
    humHist: updatedHumHist,
    sparkTemp: updatedSparkTemp,
    sparkPress: updatedSparkPress,
    sparkHum: updatedSparkHum,
    lastObservation: "just now",
  };
}
