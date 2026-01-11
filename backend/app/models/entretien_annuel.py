from sqlalchemy import Column, Integer, String, Date, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class StatutEnum(str, enum.Enum):
    BROUILLON = "brouillon"
    VALIDE = "valide"

class EntretienAnnuel(Base):
    __tablename__ = "entretien_annuel"
    
    id = Column(Integer, primary_key=True, index=True)
    collaborateur_nom = Column(String, nullable=False)
    collaborateur_prenom = Column(String, nullable=False)
    collaborateur_fonction = Column(String, nullable=False)
    collaborateur_date_entree = Column(Date, nullable=False)
    manager_nom = Column(String, nullable=False)
    manager_prenom = Column(String, nullable=False)
    manager_fonction = Column(String, nullable=False)
    date_entretien = Column(Date, nullable=False)
    statut = Column(Enum(StatutEnum), default=StatutEnum.BROUILLON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    resume_annee = relationship("ResumeAnnee", back_populates="entretien", uselist=False, cascade="all, delete-orphan")
    appreciation_objectif = relationship("AppreciationObjectif", back_populates="entretien", uselist=False, cascade="all, delete-orphan")