from sqlalchemy import (
    Column,
    String,
    Float,
    DateTime,
    BigInteger,
    Integer,
    ForeignKey,
    Index,
    func
)
from sqlalchemy.orm import relationship
from app.database import Base


class Station(Base):
    __tablename__ = "stations"

    id = Column(String(32), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    state = Column(String(64), nullable=False, index=True)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    elevation = Column(Float, nullable=False)
    station_type = Column(String(64), nullable=False)

    observations = relationship(
        "Observation",
        back_populates="station",
        cascade="all, delete-orphan",
        passive_deletes=True
    )


class Observation(Base):
    __tablename__ = "observations"

    id = Column(BigInteger().with_variant(Integer, "sqlite"), primary_key=True, autoincrement=True)
    station_id = Column(
        String(32),
        ForeignKey("stations.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    ts = Column(DateTime(timezone=True), nullable=False, default=func.now())
    temperature = Column(Float, nullable=False)
    pressure = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    wind_speed = Column(Float, nullable=False)
    wind_dir = Column(String(8), nullable=False)
    rainfall = Column(Float, nullable=False, default=0.0)

    station = relationship("Station", back_populates="observations")

    __table_args__ = (
        Index("ix_observations_station_ts", "station_id", "ts"),
    )
