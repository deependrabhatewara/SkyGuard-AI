from datetime import datetime, timedelta, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, aliased
from sqlalchemy import select, func
from app.models import Station, Observation
from app.schemas import StationCreate, ObservationCreate


def get_station_by_id(db: Session, station_id: str) -> Optional[Station]:
    """Retrieve a single station by its ID."""
    return db.query(Station).filter(Station.id == station_id).first()


def upsert_stations(db: Session, stations: List[StationCreate]) -> List[Station]:
    """Insert or update station records."""
    station_models = []
    for s in stations:
        existing = db.query(Station).filter(Station.id == s.id).first()
        if existing:
            existing.name = s.name
            existing.state = s.state
            existing.lat = s.lat
            existing.lon = s.lon
            existing.elevation = s.elevation
            existing.station_type = s.station_type
            station_models.append(existing)
        else:
            new_station = Station(
                id=s.id,
                name=s.name,
                state=s.state,
                lat=s.lat,
                lon=s.lon,
                elevation=s.elevation,
                station_type=s.station_type
            )
            db.add(new_station)
            station_models.append(new_station)
    db.commit()
    for s in station_models:
        db.refresh(s)
    return station_models


def get_stations_with_latest(
    db: Session, state: Optional[str] = None
) -> List[Tuple[Station, Optional[Observation]]]:
    """
    Retrieve all stations paired with their most recent observation.
    Uses an ANSI SQL window function (ROW_NUMBER) for optimal execution in Postgres & SQLite.
    """
    # Subquery with row_number to find the latest observation per station
    rn_col = (
        func.row_number()
        .over(partition_by=Observation.station_id, order_by=Observation.ts.desc())
        .label("rn")
    )
    subq = select(Observation, rn_col).subquery()
    latest_obs = aliased(Observation, subq)

    stmt = (
        select(Station, latest_obs)
        .outerjoin(latest_obs, (Station.id == latest_obs.station_id) & (subq.c.rn == 1))
    )

    if state:
        stmt = stmt.filter(Station.state == state)

    stmt = stmt.order_by(Station.id.asc())
    results = db.execute(stmt).all()
    return results


def get_station_history(
    db: Session, station_id: str, hours: int = 24
) -> List[Observation]:
    """
    Retrieve chronological observations for a given station in the last N hours.
    Indexed on (station_id, ts) for sub-millisecond retrieval.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    return (
        db.query(Observation)
        .filter(Observation.station_id == station_id, Observation.ts >= cutoff)
        .order_by(Observation.ts.asc())
        .all()
    )


def create_observations(
    db: Session, observations: List[ObservationCreate]
) -> List[Observation]:
    """
    Ingest a batch of telemetry observations.
    Auto-registers any unseen station to guarantee referential integrity.
    """
    # Collect unique station IDs from payload
    station_ids = {obs.station_id for obs in observations}
    existing_ids = {
        row[0]
        for row in db.query(Station.id).filter(Station.id.in_(station_ids)).all()
    }
    missing_ids = station_ids - existing_ids

    # Create placeholder metadata for any unseen station IDs
    for missing_id in missing_ids:
        auto_station = Station(
            id=missing_id,
            name=f"{missing_id} Weather Station",
            state="Unassigned",
            lat=20.5937,
            lon=78.9629,
            elevation=100.0,
            station_type="Class A AWS"
        )
        db.add(auto_station)
    if missing_ids:
        db.commit()

    # Bulk insert observations
    db_obs_list = []
    for obs in observations:
        db_obs = Observation(
            station_id=obs.station_id,
            ts=obs.ts or datetime.now(timezone.utc),
            temperature=obs.temperature,
            pressure=obs.pressure,
            humidity=obs.humidity,
            wind_speed=obs.wind_speed,
            wind_dir=obs.wind_dir,
            rainfall=obs.rainfall,
        )
        db.add(db_obs)
        db_obs_list.append(db_obs)

    db.commit()
    return db_obs_list
