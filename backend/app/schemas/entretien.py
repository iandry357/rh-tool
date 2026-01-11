from pydantic import BaseModel
from datetime import date
from typing import Optional

# Page 1
class Page1Base(BaseModel):
    collaborateur_nom: str
    collaborateur_prenom: str
    collaborateur_fonction: str
    collaborateur_date_entree: date
    manager_nom: str
    manager_prenom: str
    manager_fonction: str
    date_entretien: date

class Page1Update(Page1Base):
    pass

# Page 2
class Page2Base(BaseModel):
    commentaire: Optional[str] = None
    dossier_tech_a_jour: Optional[bool] = None
    dossier_tech_transmis: Optional[bool] = None

class Page2Update(Page2Base):
    pass

# Page 3
class Page3Base(BaseModel):
    objectif: Optional[str] = None
    note_consultant: Optional[int] = None
    commentaire_consultant: Optional[str] = None
    note_manager: Optional[int] = None
    commentaire_manager: Optional[str] = None

class Page3Update(Page3Base):
    pass

# Response complète
class EntretienResponse(BaseModel):
    id: int
    statut: str
    page1: Page1Base
    page2: Optional[Page2Base] = None
    page3: Optional[Page3Base] = None
    
    class Config:
        from_attributes = True