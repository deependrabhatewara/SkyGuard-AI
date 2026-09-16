from typing import List, Union
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ObservationCreate, IngestionResponse
import app.crud as crud

router = APIRouter(prefix="/observations", tags=["Observations"])


@router.post(
    "",
    response_model=IngestionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest one or more AWS telemetry observations",
)
def ingest_observations(
    payload: Union[ObservationCreate, List[ObservationCreate]],
    db: Session = Depends(get_db),
):
    """
    Ingest real-time meteorological observations from real or simulated weather stations.
    Accepts either a single observation object or a list of observation objects.
    Observations are persisted to the time-series table indexed on (station_id, ts).
    """
    obs_list = [payload] if isinstance(payload, ObservationCreate) else payload

    if not obs_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payload must contain at least one observation",
        )

    saved_obs = crud.create_observations(db, obs_list)
    unique_stations = sorted(list({o.station_id for o in saved_obs}))

    return IngestionResponse(
        status="success",
        inserted=len(saved_obs),
        station_ids=unique_stations,
    )
