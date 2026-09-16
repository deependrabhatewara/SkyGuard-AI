#!/usr/bin/env python3
"""
SkyGuard AI Telemetry Seed & Stream Simulator

Generates and streams realistic meteorological observations for ~90 Automatic
Weather Stations (AWS) across 25 regions in India.
Reuses the exact region anchors and value ranges from SkyGuard AI's theme.js
and mockData.js.
"""

import argparse
import json
import math
import random
import sys
import time
from datetime import datetime, timedelta, timezone
from urllib import request, error

# -------------------------------------------------------------------
# Geographic Anchors across India (from theme.js)
# -------------------------------------------------------------------
REGIONS = [
    {"state": "Jammu & Kashmir", "code": "JK", "lat": 34.08, "lon": 74.79},
    {"state": "Punjab", "code": "PB", "lat": 31.14, "lon": 75.34},
    {"state": "Himachal Pradesh", "code": "HP", "lat": 31.10, "lon": 77.17},
    {"state": "Uttarakhand", "code": "UK", "lat": 30.32, "lon": 78.03},
    {"state": "Delhi", "code": "DL", "lat": 28.61, "lon": 77.20},
    {"state": "Rajasthan", "code": "RJ", "lat": 26.91, "lon": 75.79},
    {"state": "Uttar Pradesh", "code": "UP", "lat": 26.84, "lon": 80.94},
    {"state": "Gujarat", "code": "GJ", "lat": 23.02, "lon": 72.57},
    {"state": "Madhya Pradesh", "code": "MP", "lat": 23.25, "lon": 77.41},
    {"state": "Bihar", "code": "BR", "lat": 25.59, "lon": 85.13},
    {"state": "West Bengal", "code": "WB", "lat": 22.57, "lon": 88.36},
    {"state": "Jharkhand", "code": "JH", "lat": 23.34, "lon": 85.31},
    {"state": "Chhattisgarh", "code": "CG", "lat": 21.25, "lon": 81.63},
    {"state": "Maharashtra", "code": "MH", "lat": 19.07, "lon": 72.87},
    {"state": "Maharashtra", "code": "MH", "lat": 18.52, "lon": 73.85},
    {"state": "Odisha", "code": "OD", "lat": 20.29, "lon": 85.82},
    {"state": "Telangana", "code": "TG", "lat": 17.38, "lon": 78.48},
    {"state": "Andhra Pradesh", "code": "AP", "lat": 16.51, "lon": 80.63},
    {"state": "Karnataka", "code": "KA", "lat": 12.97, "lon": 77.59},
    {"state": "Tamil Nadu", "code": "TN", "lat": 13.08, "lon": 80.27},
    {"state": "Kerala", "code": "KL", "lat": 9.93, "lon": 76.26},
    {"state": "Goa", "code": "GA", "lat": 15.49, "lon": 73.82},
    {"state": "Assam", "code": "AS", "lat": 26.14, "lon": 91.73},
    {"state": "Sikkim", "code": "SK", "lat": 27.33, "lon": 88.61},
    {"state": "Arunachal Pradesh", "code": "AR", "lat": 27.08, "lon": 93.62},
]

STATION_TYPES = ["Class A AWS", "Class B AWS", "Coastal AWS", "Hill Station AWS"]
WIND_DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]


class StationState:
    """Tracks continuous telemetry state for a realistic smooth physical walk."""
    def __init__(self, station_info):
        self.info = station_info
        # Atmospheric baseline values
        self.base_temp = random.uniform(21.0, 35.0)
        self.base_pressure = random.uniform(1000.0, 1015.0)
        self.base_humidity = random.uniform(35.0, 85.0)
        # Current state
        self.temp = self.base_temp
        self.pressure = self.base_pressure
        self.humidity = self.base_humidity
        self.wind_speed = round(random.uniform(2.0, 18.0), 1)
        self.wind_dir = random.choice(WIND_DIRECTIONS)
        self.rainfall = 0.0

    def step(self, ts=None, force_anomaly=False):
        """Advance the atmospheric state by one timestep."""
        if ts is None:
            ts = datetime.now(timezone.utc)

        # Diurnal temperature cycle (peaks around 14:00 local time, troughs at 04:00)
        hour = (ts.hour + 5.5) % 24  # IST approximate
        diurnal_offset = 3.5 * math.sin((hour - 9) * (math.pi / 12))

        # Smooth random walk
        self.temp += random.uniform(-0.35, 0.35)
        self.temp = max(self.base_temp - 5, min(self.base_temp + 5, self.temp))
        current_temp = round(self.temp + diurnal_offset, 2)

        self.pressure += random.uniform(-0.25, 0.25)
        self.pressure = round(max(985.0, min(1030.0, self.pressure)), 2)

        self.humidity += random.uniform(-1.5, 1.5)
        self.humidity = round(max(15.0, min(99.0, self.humidity)), 1)

        self.wind_speed = round(max(0.5, min(65.0, self.wind_speed + random.uniform(-1.2, 1.2))), 1)
        if random.random() < 0.15:
            self.wind_dir = random.choice(WIND_DIRECTIONS)

        # 8% chance of light rain event
        if random.random() < 0.08:
            self.rainfall = round(random.uniform(0.1, 4.5), 1)
        else:
            self.rainfall = 0.0

        # Optional anomaly injection
        if force_anomaly:
            current_temp = round(current_temp + random.choice([-1, 1]) * random.uniform(10.0, 16.0), 2)

        return {
            "station_id": self.info["id"],
            "ts": ts.isoformat(),
            "temperature": current_temp,
            "pressure": self.pressure,
            "humidity": self.humidity,
            "wind_speed": self.wind_speed,
            "wind_dir": self.wind_dir,
            "rainfall": self.rainfall,
        }


def generate_station_registry(seed=20260908):
    """Generate ~90 realistic weather stations across India."""
    random.seed(seed)
    stations = []
    station_idx = 0

    for region in REGIONS:
        # Generate 3 to 5 stations per region anchor -> ~90 total
        count = random.randint(3, 5)
        for _ in range(count):
            station_idx += 1
            num = str(station_idx).zfill(3)
            station_id = f"AWS-{region['code']}-{num}"

            # Station metadata
            lat = round(region["lat"] + random.uniform(-0.8, 0.8), 4)
            lon = round(region["lon"] + random.uniform(-0.8, 0.8), 4)
            elevation = round(random.uniform(15.0, 620.0), 1)
            st_type = random.choice(STATION_TYPES)

            stations.append({
                "id": station_id,
                "name": f"{region['state']} AWS {num}",
                "state": region["state"],
                "lat": lat,
                "lon": lon,
                "elevation": elevation,
                "station_type": st_type,
            })

    return stations


def http_post_json(url, data, timeout=10):
    """Send an HTTP POST request with JSON body using standard library."""
    payload = json.dumps(data).encode("utf-8")
    req = request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    with request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def http_get_json(url, timeout=10):
    """Send an HTTP GET request using standard library."""
    req = request.Request(url, headers={"Accept": "application/json"})
    with request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def wait_for_api(api_url, max_retries=15, delay=2):
    """Wait until the FastAPI backend healthcheck responds."""
    print(f"[*] Checking connection to {api_url}/health ...")
    for attempt in range(1, max_retries + 1):
        try:
            res = http_get_json(f"{api_url}/health", timeout=3)
            if res.get("status") == "healthy":
                print(f"[+] API is ready and healthy!")
                return True
        except Exception:
            pass
        print(f"[-] Attempt {attempt}/{max_retries}: API not ready yet. Retrying in {delay}s...")
        time.sleep(delay)
    return False


def seed_stations(api_url, stations):
    """Ensure all stations are registered in the backend."""
    print(f"[*] Seeding {len(stations)} stations to {api_url}/stations ...")
    try:
        res = http_post_json(f"{api_url}/stations", stations)
        print(f"[+] Successfully seeded/updated {len(res)} stations.")
    except Exception as e:
        print(f"[!] Error seeding stations: {e}", file=sys.stderr)
        raise


def backfill_history(api_url, station_states, hours=24):
    """Backfill historical observations for past N hours so charts work immediately."""
    print(f"[*] Backfilling past {hours} hours of telemetry for {len(station_states)} stations...")
    now = datetime.now(timezone.utc)
    # Generate 1 observation every hour for the past N hours
    total_posted = 0

    for h in range(hours, 0, -1):
        ts = now - timedelta(hours=h)
        batch = []
        for state in station_states:
            # Flagship anomaly at AWS-MP-004 2 hours ago
            is_anomaly = (state.info["id"] == "AWS-MP-004" and h == 2)
            batch.append(state.step(ts=ts, force_anomaly=is_anomaly))

        try:
            http_post_json(f"{api_url}/observations", batch)
            total_posted += len(batch)
        except Exception as e:
            print(f"[!] Warning: failed backfill batch for t=-{h}h: {e}")

    print(f"[+] Backfill complete. Inserted {total_posted} historical observations.")


def run_simulator(api_url, interval, backfill_hours, run_once):
    """Main simulation loop streaming readings periodically."""
    # 1. Generate station structures
    stations = generate_station_registry()
    print(f"[+] Generated {len(stations)} station definitions across India.")

    # 2. Wait for API availability
    if not wait_for_api(api_url):
        print("[!] ERROR: Could not connect to API. Is the server running?", file=sys.stderr)
        sys.exit(1)

    # 3. Seed stations into database
    seed_stations(api_url, stations)

    # 4. Initialize dynamic state for each station
    station_states = [StationState(s) for s in stations]

    # 5. Backfill historical data if requested
    if backfill_hours > 0:
        backfill_history(api_url, station_states, hours=backfill_hours)

    # 6. Stream live readings
    print(f"[*] Starting telemetry stream. Posting every {interval} seconds... (Press Ctrl+C to stop)")
    cycle = 0

    while True:
        cycle += 1
        now = datetime.now(timezone.utc)
        batch = []

        for state in station_states:
            # 1% chance of occasional realistic anomaly
            anomaly = random.random() < 0.01
            batch.append(state.step(ts=now, force_anomaly=anomaly))

        try:
            t0 = time.time()
            resp = http_post_json(f"{api_url}/observations", batch)
            elapsed = time.time() - t0
            print(
                f"[{now.strftime('%H:%M:%S')}] Cycle #{cycle}: Posted {resp.get('inserted')} "
                f"readings across {len(batch)} stations in {elapsed*1000:.1f}ms."
            )
        except Exception as e:
            print(f"[!] Cycle #{cycle} failed to post: {e}", file=sys.stderr)

        if run_once:
            print("[+] Run-once mode specified. Exiting.")
            break

        time.sleep(interval)


def main():
    parser = argparse.ArgumentParser(
        description="SkyGuard AI Weather Telemetry Seed & Stream Simulator"
    )
    parser.add_argument(
        "--api-url",
        default="http://localhost:8000",
        help="FastAPI Backend Base URL (default: http://localhost:8000)",
    )
    parser.add_argument(
        "--interval",
        type=float,
        default=5.0,
        help="Interval in seconds between observation cycles (default: 5.0)",
    )
    parser.add_argument(
        "--backfill-hours",
        type=int,
        default=24,
        help="Hours of historical data to backfill on initial startup (default: 24, 0 to skip)",
    )
    parser.add_argument(
        "--once",
        action="store_true",
        help="Post a single round of observations and exit (useful for testing)",
    )

    args = parser.parse_args()
    try:
        run_simulator(
            api_url=args.api_url.rstrip("/"),
            interval=args.interval,
            backfill_hours=args.backfill_hours,
            run_once=args.once,
        )
    except KeyboardInterrupt:
        print("\n[*] Simulator stopped by user. Goodbye!")


if __name__ == "__main__":
    main()
