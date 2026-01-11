from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import entretien_service
from app.services.pdf_service import generate_entretien_pdf

router = APIRouter(prefix="/pdf", tags=["PDF"])

@router.post("/{entretien_id}")
def generate_pdf(entretien_id: int, db: Session = Depends(get_db)):
    """Générer le PDF d'un entretien validé"""
    
    # Récupérer l'entretien
    entretien = entretien_service.get_entretien(db, entretien_id)
    if not entretien:
        raise HTTPException(status_code=404, detail="Entretien non trouvé")
    
    # Vérifier que l'entretien est validé
    if entretien.statut != "valide":
        raise HTTPException(status_code=400, detail="L'entretien doit être validé avant génération du PDF")
    
    # Préparer les données
    data = {
        "page1": {
            "collaborateur_nom": entretien.collaborateur_nom,
            "collaborateur_prenom": entretien.collaborateur_prenom,
            "collaborateur_fonction": entretien.collaborateur_fonction,
            "collaborateur_date_entree": entretien.collaborateur_date_entree.strftime("%d/%m/%Y"),
            "manager_nom": entretien.manager_nom,
            "manager_prenom": entretien.manager_prenom,
            "manager_fonction": entretien.manager_fonction,
            "date_entretien": entretien.date_entretien.strftime("%d/%m/%Y"),
        },
        "page2": {
            "commentaire": entretien.resume_annee.commentaire if entretien.resume_annee else "",
            "dossier_tech_a_jour": entretien.resume_annee.dossier_tech_a_jour if entretien.resume_annee else False,
            "dossier_tech_transmis": entretien.resume_annee.dossier_tech_transmis if entretien.resume_annee else None,
        },
        "page3": {
            "objectif": entretien.appreciation_objectif.objectif if entretien.appreciation_objectif else "",
            "note_consultant": entretien.appreciation_objectif.note_consultant if entretien.appreciation_objectif else None,
            "commentaire_consultant": entretien.appreciation_objectif.commentaire_consultant if entretien.appreciation_objectif else "",
            "note_manager": entretien.appreciation_objectif.note_manager if entretien.appreciation_objectif else None,
            "commentaire_manager": entretien.appreciation_objectif.commentaire_manager if entretien.appreciation_objectif else "",
        }
    }
    
    # Générer le PDF
    pdf_bytes = generate_entretien_pdf(data, db)
    
    # Retourner le PDF
    filename = f"entretien_annuel_{entretien.collaborateur_nom}_{entretien.collaborateur_prenom}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )