from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.template_text import TemplateText
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/admin", tags=["admin"])

class TemplateTextResponse(BaseModel):
    id: int
    key: str
    value: str
    category: str

class TemplateTextUpdate(BaseModel):
    value: str

@router.get("/templates/texts", response_model=List[TemplateTextResponse])
async def get_all_texts(db: Session = Depends(get_db)):
    texts = db.query(TemplateText).order_by(TemplateText.category, TemplateText.key).all()
    return texts

@router.put("/templates/texts/{text_id}")
async def update_text(text_id: int, data: TemplateTextUpdate, db: Session = Depends(get_db)):
    text = db.query(TemplateText).filter(TemplateText.id == text_id).first()
    if not text:
        raise HTTPException(status_code=404, detail="Text not found")
    
    text.value = data.value
    db.commit()
    return {"message": "Updated"}