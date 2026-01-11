from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class TemplateText(Base):
    __tablename__ = "template_texts"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False)
    category = Column(String, nullable=False)  # "page1", "page2", "page3"