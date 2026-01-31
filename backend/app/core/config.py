"""Environment Configuration using Pydantic Settings"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # Application
    app_name: str = "ResilienceGrid"
    debug: bool = True
    
    # Redis Configuration
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    
    # Agent Configuration
    max_agents: int = 100
    agent_pool_size: int = 10
    
    # Simulation Mode (for testing)
    simulation_mode: bool = False
    
    # API Keys (to be set in .env)
    openai_api_key: str = ""
    twitter_api_key: str = ""
    twitter_api_secret: str = ""
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
