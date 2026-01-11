from sqlalchemy import Column, Integer, String, ForeignKey, Text, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class AppreciationObjectif(Base):
    __tablename__ = "appreciation_objectif"
    
    id = Column(Integer, primary_key=True, index=True)
    entretien_id = Column(Integer, ForeignKey("entretien_annuel.id"), unique=True, nullable=False)
    objectif = Column(Text, nullable=True)
    note_consultant = Column(Integer, nullable=True)
    commentaire_consultant = Column(Text, nullable=True)
    note_manager = Column(Integer, nullable=True)
    commentaire_manager = Column(Text, nullable=True)
    
    # Contraintes pour les notes (1-4)
    __table_args__ = (
        CheckConstraint('note_consultant >= 1 AND note_consultant <= 4', name='check_note_consultant'),
        CheckConstraint('note_manager >= 1 AND note_manager <= 4', name='check_note_manager'),
    )
    
    # Relation
    entretien = relationship("EntretienAnnuel", back_populates="appreciation_objectif")