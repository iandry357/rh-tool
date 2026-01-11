from weasyprint import HTML
from jinja2 import Template
import os

def generate_entretien_pdf(entretien_data: dict) -> bytes:
    """Génère un PDF depuis les données de l'entretien"""
    
    # Charger le template HTML
    template_path = os.path.join(os.path.dirname(__file__), '..', 'templates', 'entretien_annuel.html')
    with open(template_path, 'r', encoding='utf-8') as f:
        template_content = f.read()
    
    # Rendre le template avec les données
    template = Template(template_content)
    html_content = template.render(**entretien_data)
    
    # Générer le PDF
    pdf_bytes = HTML(string=html_content).write_pdf()
    
    return pdf_bytes