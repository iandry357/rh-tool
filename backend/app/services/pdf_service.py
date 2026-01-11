from weasyprint import HTML
from jinja2 import Template
from sqlalchemy.orm import Session
from app.models.template_text import TemplateText
import os

def generate_entretien_pdf(entretien_data: dict, db: Session) -> bytes:
    """Génère un PDF depuis les données de l'entretien"""
    
    # Récupère les textes du template
    template_texts = db.query(TemplateText).all()
    texts_dict = {t.key: t.value for t in template_texts}
    
    # Charger le template HTML
    template_path = os.path.join(os.path.dirname(__file__), '..', 'templates', 'entretien_annuel.html')
    with open(template_path, 'r', encoding='utf-8') as f:
        template_content = f.read()
    
    # Rendre le template avec les données + textes
    template = Template(template_content)
    html_content = template.render(**entretien_data, texts=texts_dict)
    
    # Générer le PDF
    pdf_bytes = HTML(string=html_content).write_pdf()
    
    return pdf_bytes