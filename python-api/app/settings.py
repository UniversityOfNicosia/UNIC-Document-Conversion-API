from pydantic import BaseSettings

class Settings(BaseSettings):
    base_url: str
    api_key: str
    app_id: str

    class Config:
        env_file = ".env"

settings = Settings()
