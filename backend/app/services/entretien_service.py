from sqlalchemy.orm import Session
from app.models import EntretienAnnuel, ResumeAnnee, AppreciationObjectif
from app.schemas.entretien import Page1Update, Page2Update, Page3Update

def create_entretien(db: Session) -> EntretienAnnuel:
    """Crée un entretien vide en brouillon"""
    entretien = EntretienAnnuel(
        collaborateur_nom="",
        collaborateur_prenom="",
        collaborateur_fonction="",
        collaborateur_date_entree="2024-01-01",
        manager_nom="",
        manager_prenom="",
        manager_fonction="",
        date_entretien="2024-01-01"
    )
    db.add(entretien)
    db.commit()
    db.refresh(entretien)
    return entretien

def get_entretien(db: Session, entretien_id: int) -> EntretienAnnuel:
    return db.query(EntretienAnnuel).filter(EntretienAnnuel.id == entretien_id).first()

def update_page1(db: Session, entretien_id: int, data: Page1Update) -> EntretienAnnuel:
    entretien = get_entretien(db, entretien_id)
    if not entretien:
        return None
    
    for key, value in data.model_dump().items():
        setattr(entretien, key, value)
    
    db.commit()
    db.refresh(entretien)
    return entretien

def update_page2(db: Session, entretien_id: int, data: Page2Update) -> ResumeAnnee:
    resume = db.query(ResumeAnnee).filter(ResumeAnnee.entretien_id == entretien_id).first()
    
    if not resume:
        resume = ResumeAnnee(entretien_id=entretien_id)
        db.add(resume)
    
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(resume, key, value)
    
    db.commit()
    db.refresh(resume)
    return resume

def update_page3(db: Session, entretien_id: int, data: Page3Update) -> AppreciationObjectif:
    appreciation = db.query(AppreciationObjectif).filter(AppreciationObjectif.entretien_id == entretien_id).first()
    
    if not appreciation:
        appreciation = AppreciationObjectif(entretien_id=entretien_id)
        db.add(appreciation)
    
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(appreciation, key, value)
    
    db.commit()
    db.refresh(appreciation)
    return appreciation

def valider_entretien(db: Session, entretien_id: int) -> EntretienAnnuel:
    entretien = get_entretien(db, entretien_id)
    if not entretien:
        return None
    
    entretien.statut = "valide"
    db.commit()
    db.refresh(entretien)
    return entretien

def delete_entretien(db: Session, entretien_id: int) -> bool:
    entretien = get_entretien(db, entretien_id)
    if not entretien:
        return False
    
    db.delete(entretien)
    db.commit()
    return True

# def list_entretiens(db: Session, statut: str = None, skip: int = 0, limit: int = 100):
#     query = db.query(EntretienAnnuel)
#     if statut:
#         query = query.filter(EntretienAnnuel.statut == statut)
#     return query.offset(skip).limit(limit).all()

def list_entretiens(db: Session, statut: str = None, skip: int = 0, limit: int = 100):
    query = db.query(EntretienAnnuel)
    if statut:
        query = query.filter(EntretienAnnuel.statut == statut)
    
    entretiens = query.order_by(EntretienAnnuel.date_entretien.desc()).offset(skip).limit(limit).all()
    
    return [{
        "id": e.id,
        "collaborateur_nom": e.collaborateur_nom,
        "collaborateur_prenom": e.collaborateur_prenom,
        "collaborateur_fonction": e.collaborateur_fonction,
        "manager_nom": e.manager_nom,
        "manager_prenom": e.manager_prenom,
        "date_entretien": e.date_entretien.isoformat() if e.date_entretien else None,
        "statut": e.statut,
        "note_consultant": e.appreciation_objectif.note_consultant if e.appreciation_objectif else None,
        "note_manager": e.appreciation_objectif.note_manager if e.appreciation_objectif else None,
        "commentaire_consultant": e.appreciation_objectif.commentaire_consultant if e.appreciation_objectif else None,
        "commentaire_manager": e.appreciation_objectif.commentaire_manager if e.appreciation_objectif else None,
    } for e in entretiens]