from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class NoteInDB(BaseModel):
    user_id: str = Field(..., description="The ID of the user who created the note")
    title: str = Field(..., description="The title of the note")
    content: str = Field(..., description="The main content of the note")
    labels: Optional[List[str]] = Field(default_factory=list, description="Optional tags or categories")
    images: Optional[List[str]] = Field(default_factory=list, description="List of image URLs or filenames")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of creation")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of last update")