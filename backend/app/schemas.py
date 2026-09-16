from datetime import datetime, timezone
from typing import Optional, List, Union
from pydantic import BaseModel, Field, ConfigDict


class StationBase(BaseModel):
    name: str = Field(..., max_length=128, description="Station display name")
    state: str = Field(..., max_length=64, description="State or Union Territory")
    lat: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    lon: float = Field(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees")
    elevation: float = Field(..., description="Elevation above sea level in meters")
    station_type: str = Field(..., max_length=64, description="e.g. Class A AWS, Coastal AWS")


class StationCreate(StationBase):
    id: str = Field(..., max_length=32, description="Unique station identifier, e.g. AWS-MP-004")


class StationResponse(StationBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class ObservationBase(BaseModel):
    temperature: float = Field(..., description="Temperature in degrees Celsius")
    pressure: float = Field(..., description="Atmospheric pressure in hPa")
    humidity: float = Field(..., ge=0.0, le=100.0, description="Relative humidity percentage")
    wind_speed: float = Field(..., ge=0.0, description="Wind speed in km/h")
    wind_dir: str = Field(..., max_length=8, description="Wind direction (e.g. N, NE, SW)")
    rainfall: float = Field(0.0, ge=0.0, description="Accumulated rainfall in mm")


class ObservationCreate(ObservationBase):
    station_id: str = Field(..., max_length=32, description="Station identifier")
    ts: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Observation timestamp (UTC/ISO-8601)"
    )


class ObservationResponse(ObservationBase):
    id: int
    station_id: str
    ts: datetime

    model_config = ConfigDict(from_attributes=True)


class StationWithLatestObservation(StationResponse):
    latest_observation: Optional[ObservationResponse] = None

    model_config = ConfigDict(from_attributes=True)


class StationHistoryResponse(BaseModel):
    station_id: str
    hours: int
    count: int
    observations: List[ObservationResponse]


class IngestionResponse(BaseModel):
    status: str = "success"
    inserted: int
    station_ids: List[str]
