import json
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    APP_NAME: str = "SkyGuard AI Telemetry API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    DATABASE_URL: str = "postgresql://skyguard:skyguard_pass@localhost:5432/skyguard_db"
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://localhost:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("["):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
