from typing import List, Optional, Union
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import (
    StationCreate,
    StationResponse,
    StationWithLatestObservation,
    StationHistoryResponse,
    ObservationResponse,
)
import app.crud as crud

router = APIRouter(prefix="/stations", tags=["Stations"])


@router.get(
    "",
    response_model=List[StationWithLatestObservation],
    summary="List all weather stations with their most recent observation",
)
def list_stations(
    state: Optional[str] = Query(None, description="Optional filter by State"),
    db: Session = Depends(get_db),
):
    """
    Returns all registered stations in India paired with their latest telemetry observation.
    Ideal for real-time map rendering and station registry tables.
    """
    pairs = crud.get_stations_with_latest(db, state=state)
    result = []
    for station, latest_obs in pairs:
        station_dict = {
            "id": station.id,
            "name": station.name,
            "state": station.state,
            "lat": station.lat,
            "lon": station.lon,
            "elevation": station.elevation,
            "station_type": station.station_type,
            "latest_observation": latest_obs,
        }
        result.append(station_dict)
    return result


@router.get(
    "/{station_id}",
    response_model=StationWithLatestObservation,
    summary="Get single station details with latest observation",
)
def get_station(station_id: str, db: Session = Depends(get_db)):
    station = crud.get_station_by_id(db, station_id=station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station '{station_id}' not found",
        )
    # Fetch history of 1 observation or latest
    obs_history = crud.get_station_history(db, station_id=station_id, hours=168)
    latest = obs_history[-1] if obs_history else None

    return {
        "id": station.id,
        "name": station.name,
        "state": station.state,
        "lat": station.lat,
        "lon": station.lon,
        "elevation": station.elevation,
        "station_type": station.station_type,
        "latest_observation": latest,
    }


@router.get(
    "/{station_id}/history",
    response_model=StationHistoryResponse,
    summary="Get historical time-series observations for charts",
)
def get_station_history(
    station_id: str,
    hours: int = Query(24, ge=1, le=720, description="Hours of history to retrieve (default: 24)"),
    db: Session = Depends(get_db),
):
    """
    Returns time series records for a station within the requested hour window.
    Output is ordered chronologically (ts ascending) for direct consumption by Recharts.
    """
    station = crud.get_station_by_id(db, station_id=station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station '{station_id}' not found",
        )

    observations = crud.get_station_history(db, station_id=station_id, hours=hours)
    return {
        "station_id": station_id,
        "hours": hours,
        "count": len(observations),
        "observations": observations,
    }


@router.post(
    "",
    response_model=List[StationResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register or seed one or more weather stations",
)
def create_stations(
    payload: Union[StationCreate, List[StationCreate]],
    db: Session = Depends(get_db),
):
    """
    Upsert one or more stations into the registry.
    Accepts either a single station object or a JSON array of station objects.
    """
    stations_list = [payload] if isinstance(payload, StationCreate) else payload
    if not stations_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payload must not be empty",
        )
    return crud.upsert_stations(db, stations_list)
