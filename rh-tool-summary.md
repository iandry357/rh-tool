# Résumé Projet RH Tool

## Objectif du Projet
Plateforme de formulaires RH avec génération PDF automatique. 

**Utilisateurs cibles** : RH, Commercial, Consultant

**Focus actuel** : Formulaire "Entretien Annuel d'Appréciation" (3 pages)

---

## Stack Technique

### Backend
- **FastAPI** - Framework API REST
- **PostgreSQL** - Base de données
- **pgvector** - Extension PostgreSQL pour RAG
- **SQLAlchemy** - ORM
- **WeasyPrint** - Génération PDF
- **Jinja2** - Templates HTML pour PDF

### Frontend
- **Next.js** (App Router)
- **Tailwind CSS**
- **React Hook Form**
- **Axios** - Client HTTP

### Infrastructure
- **Docker** (backend + PostgreSQL)
- Frontend hors Docker pour développement

### Futur
- **RAG/LLM** - Classification avis, interprétation résultats, identification actions

---

## Structure du Projet

```
rh-tool/
├── backend/
│   ├── app/
│   │   ├── models/                           # Tables PostgreSQL (SQLAlchemy)
│   │   │   ├── __init__.py
│   │   │   ├── entretien_annuel.py          # Table pivot (page 1)
│   │   │   │                                 # - Collaborateur (nom/prénom/fonction/date_entrée)
│   │   │   │                                 # - Manager (nom/prénom/fonction)
│   │   │   │                                 # - date_entretien
│   │   │   │                                 # - statut (brouillon/valide)
│   │   │   ├── resume_annee.py              # Page 2 (1:1 avec entretien_annuel)
│   │   │   │                                 # - commentaire (clients/missions)
│   │   │   │                                 # - dossier_tech_a_jour (bool)
│   │   │   │                                 # - dossier_tech_transmis (bool)
│   │   │   └── appreciation_objectif.py     # Page 3 (1:1 avec entretien_annuel)
│   │   │                                     # - objectif
│   │   │                                     # - note_consultant (1-4)
│   │   │                                     # - commentaire_consultant
│   │   │                                     # - note_manager (1-4)
│   │   │                                     # - commentaire_manager
│   │   │
│   │   ├── routers/                          # Endpoints API
│   │   │   ├── __init__.py
│   │   │   ├── entretien.py                 # CRUD entretiens
│   │   │   │                                 # POST /entretiens/
│   │   │   │                                 # GET /entretiens/{id}
│   │   │   │                                 # PUT /entretiens/{id}/page1
│   │   │   │                                 # PUT /entretiens/{id}/page2
│   │   │   │                                 # PUT /entretiens/{id}/page3
│   │   │   │                                 # POST /entretiens/{id}/valider
│   │   │   │                                 # DELETE /entretiens/{id}
│   │   │   └── pdf.py                       # POST /pdf/{id} - Génération PDF
│   │   │
│   │   ├── schemas/                          # Validation Pydantic
│   │   │   ├── __init__.py
│   │   │   └── entretien.py                 # Page1Base, Page2Base, Page3Base
│   │   │
│   │   ├── services/                         # Logique métier
│   │   │   ├── __init__.py
│   │   │   ├── entretien_service.py         # CRUD + validation
│   │   │   └── pdf_service.py               # WeasyPrint + Jinja2
│   │   │
│   │   ├── templates/                        # Templates PDF
│   │   │   └── entretien_annuel.html        # Template 3 pages avec style CSS
│   │   │
│   │   ├── __init__.py
│   │   ├── main.py                          # FastAPI app + création tables auto
│   │   ├── database.py                      # SQLAlchemy engine + session
│   │   └── config.py                        # Settings (Pydantic)
│   │
│   ├── requirements.txt                      # Dépendances Python
│   │                                         # fastapi, uvicorn, sqlalchemy
│   │                                         # psycopg2-binary, pgvector
│   │                                         # weasyprint==62.3, pydyf==0.10.0
│   │                                         # jinja2==3.1.2
│   │                                         # openai, anthropic, langchain
│   ├── Dockerfile
│   └── .env                                  # DATABASE_URL, API keys
│
├── frontend/
│   ├── app/
│   │   └── formulaires/
│   │       └── entretien-annuel/
│   │           └── page.tsx                 # Formulaire 3 pages
│   │                                         # - Navigation entre pages
│   │                                         # - Sauvegarde auto
│   │                                         # - Téléchargement PDF
│   ├── lib/
│   │   └── api.ts                           # Client Axios pour API backend
│   │                                         # createEntretien, getEntretien
│   │                                         # updatePage1/2/3, validerEntretien
│   │                                         # downloadPDF
│   └── types/
│       └── formulaires.ts                   # Types TypeScript
│                                             # EntretienAnnuelPage1/2/3
│
├── data/                                     # Volumes Docker (gitignore)
│   └── postgres/
│
├── docker-compose.yml                        # PostgreSQL + Backend
├── .env                                      # Config Docker
└── .gitignore
```

---

## Architecture Base de Données

### Relations
```
entretien_annuel (1) ──→ (1) resume_annee
                   (1) ──→ (1) appreciation_objectif
```

### Logique Statut
- **brouillon** : Formulaire en cours, modifiable
- **valide** : Formulaire finalisé (après clic "Valider le formulaire")

---

## Fonctionnalités Implémentées

### Frontend
- ✅ Formulaire 3 pages avec style "papier" (pointillés)
- ✅ Navigation par onglets (Page 1/2/3)
- ✅ Sauvegarde automatique à chaque changement de page
- ✅ Boutons Précédent/Suivant
- ✅ Bouton "Valider le formulaire" (page 3)
- ✅ Bouton "Télécharger PDF"
- ✅ Persistance des données entre pages

### Backend
- ✅ API REST complète (CRUD)
- ✅ Sauvegarde par page indépendante
- ✅ Validation finale (statut → valide)
- ✅ Génération PDF avec WeasyPrint + Jinja2
- ✅ Template PDF multi-pages avec mise en forme

### Infrastructure
- ✅ Docker Compose (PostgreSQL + Backend)
- ✅ pgvector activé (prêt pour RAG)
- ✅ Création automatique des tables au démarrage

---

## Problèmes Résolus

### 1. Types Radio Buttons
- **Problème** : Radio buttons renvoient des strings, types attendus boolean/number
- **Solution** : Conversion explicite lors de la sauvegarde (`Number()`, comparaison `=== 'true'`)

### 2. Persistance Page 2
- **Problème** : Seul le bouton "Suivant" sauvegardait
- **Solution** : Sauvegarde auto dans `PageNavigation` et bouton Précédent

### 3. Création Tables au Démarrage
- **Problème** : `Base.metadata.create_all()` ne s'exécutait pas
- **Solution** : Imports explicites des models avant `create_all` dans `main.py`

### 4. Compatibilité WeasyPrint
- **Problème** : `TypeError: PDF.__init__()` avec versions incompatibles
- **Solution** : Pin versions `weasyprint==62.3` et `pydyf==0.10.0`

### 5. Jinja2 Manquant
- **Problème** : `ModuleNotFoundError: No module named 'jinja2'`
- **Solution** : Ajout `jinja2==3.1.2` dans `requirements.txt`

---

## Commandes Utiles

### Démarrage
```bash
docker-compose up backend
cd frontend && npm run dev
```

### Rebuild
```bash
docker-compose down
docker-compose build backend
docker-compose up backend
```

### Reset Complet
```bash
docker-compose down -v
Remove-Item -Recurse -Force data\postgres
docker-compose up backend
```

### Logs
```bash
docker-compose logs backend -f
docker-compose logs postgres
```

---

## Prochaines Étapes

### Court Terme
1. ✅ Vérifier création automatique des tables (résolu)
2. Tester téléchargement PDF complet
3. Ajouter gestion des erreurs utilisateur

### Moyen Terme
1. Implémenter 2 autres types de formulaires
2. Ajouter authentification simple (email/password)
3. Liste des entretiens avec filtres (brouillon/validé)
4. Édition d'entretiens existants

### Long Terme
1. **RAG/LLM** :
   - Classification automatique des avis
   - Interprétation des résultats
   - Identification d'actions recommandées
   - Analyse comparative multi-entretiens
2. Système de notifications (rappel 3 jours avant)
3. Signature électronique sur PDF
4. Export Excel/CSV des entretiens
5. Dashboard analytique RH

---

## Notes Importantes

### Règles de Travail
- Pas d'over-engineering
- Une solution à la fois
- Code direct, pas d'explications architecturales non sollicitées
- Validation avant changements structurels

### Configuration Docker
- Frontend en local (hors Docker) pour développement
- Backend + PostgreSQL dans Docker
- Port PostgreSQL : 5433 (externe) → 5432 (interne)
- Base de données : `rh_tool` (user: `rh_user`)

### Git
- `.gitignore` à la racine pour tout le projet
- `data/` ignoré (volumes Docker)
- Pas de `.env` committé