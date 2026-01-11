from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class ResumeAnnee(Base):
    __tablename__ = "resume_annee"
    
    id = Column(Integer, primary_key=True, index=True)
    entretien_id = Column(Integer, ForeignKey("entretien_annuel.id"), unique=True, nullable=False)
    commentaire = Column(Text, nullable=True)  # Clients/missions
    dossier_tech_a_jour = Column(Boolean, nullable=True)
    dossier_tech_transmis = Column(Boolean, nullable=True)
    
    # Relation
    entretien = relationship("EntretienAnnuel", back_populates="resume_annee")