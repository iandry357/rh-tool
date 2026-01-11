# Synthèse Projet RH Tool

## Vue d'ensemble
Plateforme de formulaires RH avec génération PDF automatique.  
**Formulaire actuel** : Entretien Annuel d'Appréciation (3 pages)

---

## Stack Technique

### Backend
- **Framework** : FastAPI
- **Base de données** : PostgreSQL + pgvector
- **ORM** : SQLAlchemy
- **PDF** : WeasyPrint + Jinja2
- **Déploiement** : Railway (Docker)

### Frontend
- **Framework** : Next.js (App Router)
- **Styling** : Tailwind CSS
- **Forms** : React Hook Form
- **HTTP** : Axios
- **Déploiement** : Vercel

---

## URLs Production

- **Frontend** : https://rh-tool.vercel.app
- **Backend API** : https://rh-tool-backend-production.up.railway.app
- **API Docs** : https://rh-tool-backend-production.up.railway.app/docs

---

## Structure du Projet

```
rh-tool/
├── backend/
│   ├── app/
│   │   ├── models/               # Tables SQLAlchemy
│   │   │   ├── entretien_annuel.py      # Table pivot (page 1)
│   │   │   ├── resume_annee.py          # Page 2 (1:1)
│   │   │   ├── appreciation_objectif.py # Page 3 (1:1)
│   │   │   └── template_text.py         # Textes dynamiques
│   │   │
│   │   ├── routers/              # Endpoints API
│   │   │   ├── entretien.py     # CRUD entretiens + export CSV
│   │   │   ├── pdf.py           # Génération PDF
│   │   │   └── admin.py         # Gestion templates
│   │   │
│   │   ├── services/             # Logique métier
│   │   │   ├── entretien_service.py
│   │   │   ├── pdf_service.py
│   │   │   └── template_service.py
│   │   │
│   │   ├── templates/
│   │   │   └── entretien_annuel.html  # Template PDF (Jinja2)
│   │   │
│   │   ├── main.py              # App FastAPI + CORS
│   │   ├── database.py          # SQLAlchemy config
│   │   └── config.py            # Settings
│   │
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env                     # DATABASE_URL
│
├── frontend/
│   ├── app/
│   │   ├── formulaires/entretien-annuel/page.tsx  # Formulaire 3 pages
│   │   ├── admin/
│   │   │   ├── templates/page.tsx       # Édition templates
│   │   │   └── entretiens/page.tsx      # Liste + export CSV
│   │   └── layout.tsx                   # Layout global
│   │
│   ├── lib/
│   │   └── api.ts               # Client Axios
│   │
│   ├── types/
│   │   └── formulaires.ts       # Types TypeScript
│   │
│   └── .env.local               # NEXT_PUBLIC_API_URL
│
├── docker-compose.yml           # PostgreSQL + Backend (dev local)
└── .gitignore
```

---

## Base de Données

### Tables principales

**entretien_annuel** (table pivot)
- collaborateur (nom, prénom, fonction, date_entrée)
- manager (nom, prénom, fonction)
- date_entretien
- statut (brouillon / valide)

**resume_annee** (1:1 avec entretien_annuel)
- commentaire (clients/missions)
- dossier_tech_a_jour (bool)
- dossier_tech_transmis (bool nullable)

**appreciation_objectif** (1:1 avec entretien_annuel)
- objectif
- note_consultant (1-4)
- commentaire_consultant
- note_manager (1-4)
- commentaire_manager

**template_texts**
- key (unique)
- value (texte)
- category (page1/page2/page3)

---

## API Endpoints

### Entretiens
- `POST /entretiens/` - Créer un entretien
- `GET /entretiens/` - Liste des entretiens (avec filtres)
- `GET /entretiens/{id}` - Récupérer un entretien
- `PUT /entretiens/{id}/page1` - Sauvegarder page 1
- `PUT /entretiens/{id}/page2` - Sauvegarder page 2
- `PUT /entretiens/{id}/page3` - Sauvegarder page 3
- `POST /entretiens/{id}/valider` - Valider (statut → valide)
- `DELETE /entretiens/{id}` - Supprimer
- `GET /entretiens/export/csv` - Export CSV (délimiteur `;`)

### PDF
- `POST /pdf/{id}` - Générer PDF (entretien validé uniquement)

### Admin
- `GET /admin/templates/texts` - Liste des textes templates
- `PUT /admin/templates/texts/{id}` - Modifier un texte

---

## Fonctionnalités Implémentées

### ✅ Frontend
- Formulaire 3 pages avec navigation par onglets
- Sauvegarde automatique à chaque changement de page
- Validation finale (statut → valide)
- Téléchargement PDF
- Persistance des données entre pages
- Textes dynamiques depuis la base de données

### ✅ Backend
- API REST complète (CRUD)
- Génération PDF avec WeasyPrint + Jinja2
- Templates dynamiques éditables
- Export CSV des entretiens
- CORS configuré pour production

### ✅ Admin
- Interface d'édition des templates
- Liste des entretiens avec filtres
- Export CSV

### ✅ Infrastructure
- Docker Compose (dev local)
- Déploiement Railway (backend + PostgreSQL)
- Déploiement Vercel (frontend)

---

## Commandes Utiles

### Développement Local

**Backend**
```bash
cd backend
docker-compose up -d          # Démarrer PostgreSQL + Backend
docker-compose logs backend   # Voir les logs
docker-compose down           # Arrêter
```

**Frontend**
```bash
cd frontend
npm install
npm run dev                   # http://localhost:3000
```

**Accès PostgreSQL**
```bash
docker-compose exec postgres psql -U rh_user -d rh_tool
```

---

### Déploiement

**Backend (Railway via Docker Hub)**
```bash
cd backend
docker build -t rh-tool-backend .
docker tag rh-tool-backend iandry/rh-tool-backend:latest
docker push iandry/rh-tool-backend:latest
# Railway redéploie automatiquement
```

**Frontend (Vercel)**
```bash
git push  # Vercel redéploie automatiquement
```

---

## Variables d'Environnement

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/rh_tool
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://rh-tool-backend-production.up.railway.app
```

---

## Configuration CORS

Dans `backend/app/main.py` :
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://rh-tool.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
``` 

---

## Prochaines Étapes

### Court Terme
- [ ] Implémenter Markdown dans les templates (éditeur + rendu)
- [ ] Ajouter authentification basique
- [ ] Permettre édition d'entretiens existants

### Moyen Terme
- [ ] Créer 2 autres types de formulaires
- [ ] Système de notifications (rappel 3 jours avant)
- [ ] Signature électronique sur PDF
- [ ] Filtres avancés sur liste entretiens

### Long Terme
- [ ] **RAG/LLM** :
  - Classification automatique des avis
  - Interprétation des résultats
  - Identification d'actions recommandées
  - Analyse comparative multi-entretiens
- [ ] Dashboard analytique RH
- [ ] Export Excel avancé

---

## Notes Importantes

### Règles de Travail
- Stack simple : FastAPI + Next.js + PostgreSQL
- Pas d'over-engineering
- Une solution à la fois
- Validation avant changements structurels

### Git
- `.gitignore` à la racine
- `data/` ignoré (volumes Docker)
- `.env` et `.env.local` ignorés

### Tables Auto-créées
Les tables sont créées automatiquement au démarrage du backend via SQLAlchemy.

### Textes par Défaut
Les textes de templates sont initialisés automatiquement au premier démarrage grâce à `init_default_texts()`.

---

## Troubleshooting

**Les tables ne se créent pas ?**
```bash
docker-compose logs backend
# Vérifier les erreurs de connexion PostgreSQL
```

**Erreur CORS en production ?**
- Vérifier que l'URL Vercel est dans `allow_origins`
- Rebuild + push Docker image

**Frontend ne se connecte pas à l'API ?**
- Vérifier `NEXT_PUBLIC_API_URL` dans Vercel
- Redéployer après modification des variables

**PDF ne se génère pas ?**
- Vérifier que l'entretien est `valide`
- Checker les logs Railway pour erreurs WeasyPrint

---

## Contact & Support

**Repo GitHub** : [Ajouter l'URL du repo]  
**Déploiements** :
- Backend : Railway
- Frontend : Vercel
- Base de données : Railway PostgreSQL