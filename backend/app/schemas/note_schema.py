from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class NoteCreate(BaseModel):
    title: str
    content: str
    labels: Optional[List[str]] = []
    images: Optional[List[str]] = []


class NoteUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]
    labels: Optional[List[str]]
    images: Optional[List[str]]


class NoteOut(NoteCreate):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime