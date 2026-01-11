from sqlalchemy.orm import Session
from app.models.template_text import TemplateText

def init_default_texts(db: Session):
    defaults = [
        # Page 1
        {"key": "page1_title", "value": "Entretien Annuel", "category": "page1"},
        {"key": "page1_collaborateur_label", "value": "Collaborateur :", "category": "page1"},
        {"key": "page1_nom_prenom_label", "value": "Nom, Prénom :", "category": "page1"},
        {"key": "page1_fonction_label", "value": "Fonction :", "category": "page1"},
        {"key": "page1_date_entree_label", "value": "Date d'entrée dans l'entreprise :", "category": "page1"},
        {"key": "page1_manager_label", "value": "Responsable hiérarchique :", "category": "page1"},
        {"key": "page1_date_entretien_label", "value": "Date de l'entretien :", "category": "page1"},
        
        # Page 2
        {"key": "page2_title", "value": "Entretien Annuel", "category": "page2"},
        {"key": "page2_resume_title", "value": "1. Résumé de l'année", "category": "page2"},
        {"key": "page2_instructions", "value": "• L'Entretien Annuel est l'occasion de faire un point concernant de son travail\n• Le salarié doit envoyer le formulaire pré-rempli minimum 3 jours avant l'entretien.\n• Après l'EAA, ce document devra être signé par les 2 parties ; un scan sera remis au salarié et l'original au service RH.", "category": "page2"},
        {"key": "page2_clients_label", "value": "Nom du ou des Clients dans l'ordre chronologique avec les mois associés :", "category": "page2"},
        {"key": "page2_dossier_tech_label", "value": "Avez-vous mis votre Dossier Technique à jour ?", "category": "page2"},
        {"key": "page2_dossier_transmis_label", "value": "Si oui, l'avez-vous transmis à votre manager ?", "category": "page2"},
        {"key": "page2_note_manager_collab_label", "value": "Note global", "category": "page2"},
        
        # Page 3
        {"key": "page3_title", "value": "Entretien Annuel", "category": "page3"},
        {"key": "page3_appreciation_title", "value": "2. Appréciation des objectifs de l'année", "category": "page3"},
        {"key": "page3_instructions", "value": "→ Le salarié doit recopier « Missions de l'ordre de mission » tous les objectifs inscrits dans son (ou ses) ordre(s) de mission.\n\nÉchelle de notation :\n• 4 : Performance supérieure aux attentes : dépasse les performances attendues\n• 3 : Performance correspondant pleinement\n• 2 : Performance acceptable \n• 1 : Performance insuffisante", "category": "page3"},
        {"key": "page3_objectifs_label", "value": "Mission de l'ordre de mission (ou des ordres de mission de l'année)", "category": "page3"},
        {"key": "page3_notation_collab_label", "value": "Notation Collaborateur", "category": "page3"},
        {"key": "page3_notation_manager_label", "value": "Notation Manager", "category": "page3"},
        {"key": "page3_commentaires_collab_label", "value": "Commentaires du collaborateur", "category": "page3"},
        {"key": "page3_commentaires_manager_label", "value": "Commentaires du manager", "category": "page3"},
        {"key": "page3_echelle_notation_title", "value": "Échelle de notation :", "category": "page3"},
        {"key": "page3_notation_4", "value": "4 : Performance supérieure ", "category": "page3"},
        {"key": "page3_notation_3", "value": "3 : Performance correspondant ", "category": "page3"},
        {"key": "page3_notation_2", "value": "2 : Performance acceptable ", "category": "page3"},
        {"key": "page3_notation_1", "value": "1 : Performance insuffisante", "category": "page3"},

    ]
    
    for item in defaults:
        existing = db.query(TemplateText).filter(TemplateText.key == item["key"]).first()
        if not existing:
            db.add(TemplateText(**item))
    
    db.commit()