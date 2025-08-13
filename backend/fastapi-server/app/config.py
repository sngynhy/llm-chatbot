from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = Field("Chatbot", alias="PROJECT_NAME")
    VERSION: str = Field("1.0.0", alias="VERSION")
    DESCRIPTION: str = Field("Chatbot API", alias="DESCRIPTION")

    MONGODB_URI: str = Field(..., alias="MONGODB_URI")
    MONGODB_DB: str = Field("chatbot", alias="MONGODB_DB")
    MONGODB_COLLECTION: str = Field("chats", alias="MONGODB_COLLECTION")

    OLLAMA_BASE_URL: str = Field("http://localhost:11434/v1/chat/completions", alias="OLLAMA_BASE_URL")
    OLLAMA_API_KEY: str = Field(..., alias="OLLAMA_API_KEY")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()