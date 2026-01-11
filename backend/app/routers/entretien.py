from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.entretien import EntretienResponse, Page1Update, Page2Update, Page3Update
from app.services import entretien_service
from fastapi.responses import StreamingResponse
import csv
from io import StringIO

router = APIRouter(prefix="/entretiens", tags=["Entretiens"])

@router.post("/", response_model=dict)
def create_entretien(db: Session = Depends(get_db)):
    """Créer un nouvel entretien en brouillon"""
    entretien = entretien_service.create_entretien(db)
    return {"id": entretien.id, "statut": entretien.statut}

@router.get("/{entretien_id}", response_model=dict)
def get_entretien(entretien_id: int, db: Session = Depends(get_db)):
    """Récupérer un entretien complet"""
    entretien = entretien_service.get_entretien(db, entretien_id)
    print(entretien.id, entretien.statut, entretien.collaborateur_nom)
    if not entretien:
        raise HTTPException(status_code=404, detail="Entretien non trouvé")
    
    response = {
        "id": entretien.id,
        "statut": entretien.statut,
        "page1": {
            "collaborateur_nom": entretien.collaborateur_nom,
            "collaborateur_prenom": entretien.collaborateur_prenom,
            "collaborateur_fonction": entretien.collaborateur_fonction,
            "collaborateur_date_entree": entretien.collaborateur_date_entree,
            "manager_nom": entretien.manager_nom,
            "manager_prenom": entretien.manager_prenom,
            "manager_fonction": entretien.manager_fonction,
            "date_entretien": entretien.date_entretien,
        }
    }
    
    if entretien.resume_annee:
        response["page2"] = {
            "commentaire": entretien.resume_annee.commentaire,
            "dossier_tech_a_jour": entretien.resume_annee.dossier_tech_a_jour,
            "dossier_tech_transmis": entretien.resume_annee.dossier_tech_transmis,
        }
    
    if entretien.appreciation_objectif:
        response["page3"] = {
            "objectif": entretien.appreciation_objectif.objectif,
            "note_consultant": entretien.appreciation_objectif.note_consultant,
            "commentaire_consultant": entretien.appreciation_objectif.commentaire_consultant,
            "note_manager": entretien.appreciation_objectif.note_manager,
            "commentaire_manager": entretien.appreciation_objectif.commentaire_manager,
        }
    
    return response

@router.put("/{entretien_id}/page1")
def update_page1(entretien_id: int, data: Page1Update, db: Session = Depends(get_db)):
    """Sauvegarder page 1"""
    entretien = entretien_service.update_page1(db, entretien_id, data)
    if not entretien:
        raise HTTPException(status_code=404, detail="Entretien non trouvé")
    return {"message": "Page 1 sauvegardée"}

@router.put("/{entretien_id}/page2")
def update_page2(entretien_id: int, data: Page2Update, db: Session = Depends(get_db)):
    """Sauvegarder page 2"""
    entretien_service.update_page2(db, entretien_id, data)
    return {"message": "Page 2 sauvegardée"}

@router.put("/{entretien_id}/page3")
def update_page3(entretien_id: int, data: Page3Update, db: Session = Depends(get_db)):
    """Sauvegarder page 3"""
    entretien_service.update_page3(db, entretien_id, data)
    return {"message": "Page 3 sauvegardée"}

@router.post("/{entretien_id}/valider")
def valider_entretien(entretien_id: int, db: Session = Depends(get_db)):
    """Valider le formulaire"""
    entretien = entretien_service.valider_entretien(db, entretien_id)
    if not entretien:
        raise HTTPException(status_code=404, detail="Entretien non trouvé")
    return {"message": "Entretien validé", "statut": entretien.statut}

@router.delete("/{entretien_id}")
def delete_entretien(entretien_id: int, db: Session = Depends(get_db)):
    """Supprimer un entretien"""
    success = entretien_service.delete_entretien(db, entretien_id)
    if not success:
        raise HTTPException(status_code=404, detail="Entretien non trouvé")
    return {"message": "Entretien supprimé"}


@router.get("/")
def list_entretiens(statut: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Liste des entretiens"""
    return entretien_service.list_entretiens(db, statut, skip, limit)

# @router.get("/")
# def list_entretiens(db: Session = Depends(get_db)):
#     """Liste tous les entretiens"""
#     entretiens = db.query(EntretienAnnuel).order_by(EntretienAnnuel.date_entretien.desc()).all()
    
#     return [{
#         "id": e.id,
#         "collaborateur_nom": e.collaborateur_nom,
#         "collaborateur_prenom": e.collaborateur_prenom,
#         "collaborateur_fonction": e.collaborateur_fonction,
#         "manager_nom": e.manager_nom,
#         "manager_prenom": e.manager_prenom,
#         "date_entretien": e.date_entretien,
#         "statut": e.statut,
#         "note_consultant": e.appreciation_objectif.note_consultant if e.appreciation_objectif else None,
#         "note_manager": e.appreciation_objectif.note_manager if e.appreciation_objectif else None,
#     } for e in entretiens]

@router.get("/export/csv")
def export_entretiens_csv(statut: str = None, db: Session = Depends(get_db)):
    """Exporter les entretiens en CSV"""
    entretiens = entretien_service.list_entretiens(db, statut, skip=0, limit=10000)
    
    # Créer le CSV
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=[
        'id', 'collaborateur_nom', 'collaborateur_prenom', 'collaborateur_fonction',
        'manager_nom', 'manager_prenom', 'date_entretien', 
        'note_consultant', 'note_manager', 'statut'
    ], delimiter=';')
    
    writer.writeheader()
    writer.writerows(entretiens)
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=entretiens.csv"}
    )