# App core
New-Item -ItemType File -Path "backend/app/__init__.py" -Force | Out-Null
New-Item -ItemType File -Path "backend/app/main.py" -Force | Out-Null
New-Item -ItemType File -Path "backend/app/database.py" -Force | Out-Null
New-Item -ItemType File -Path "backend/app/config.py" -Force | Out-Null

# Models
New-Item -ItemType File -Path "backend/app/models/__init__.py" -Force | Out-Null
New-Item -ItemType File -Path "backend/app/models/entretien_annuel.py" -Force | Out-Null
New-Item -ItemType File -Path "backend/app/models/resume_annee.py" -Force | Out-Null
New-Item -ItemType File -Path "backend/app/models/appreciation_objectif.py" -Force | Out-Null

# Schemas
New-Item -ItemType File -Path "backend/app/schemas/__init__.py" -Force | Out-Null

# Routers
New-Item -ItemType File -Path "backend/app/routers/__init__.py" -Force | Out-Null

# Services
New-Item -ItemType File -Path "backend/app/services/__init__.py" -Force | Out-Null

Write-Host "✓ Fichiers backend créés" -ForegroundColor Green


# Schemas
New-Item -ItemType File -Path "backend/app/schemas/entretien.py" -Force | Out-Null

# Routers
New-Item -ItemType File -Path "backend/app/routers/entretien.py" -Force | Out-Null

# Services
New-Item -ItemType File -Path "backend/app/services/entretien_service.py" -Force | Out-Null

Write-Host "✓ Fichiers endpoints créés" -ForegroundColor Green


# Services
New-Item -ItemType File -Path "backend/app/services/pdf_service.py" -Force | Out-Null

# Routers
New-Item -ItemType File -Path "backend/app/routers/pdf.py" -Force | Out-Null

# Templates
New-Item -ItemType Directory -Path "backend/app/templates" -Force | Out-Null
New-Item -ItemType File -Path "backend/app/templates/entretien_annuel.html" -Force | Out-Null

Write-Host "✓ Fichiers PDF créés" -ForegroundColor Green