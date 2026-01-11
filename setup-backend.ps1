# Création structure backend
New-Item -ItemType Directory -Path "backend/app" -Force | Out-Null
New-Item -ItemType Directory -Path "backend/app/models" -Force | Out-Null
New-Item -ItemType Directory -Path "backend/app/routers" -Force | Out-Null
New-Item -ItemType Directory -Path "backend/app/services" -Force | Out-Null
New-Item -ItemType Directory -Path "backend/app/schemas" -Force | Out-Null
New-Item -ItemType Directory -Path "backend/alembic" -Force | Out-Null
New-Item -ItemType Directory -Path "data/postgres" -Force | Out-Null

# Création fichiers backend
New-Item -ItemType File -Path "backend/requirements.txt" -Force | Out-Null
New-Item -ItemType File -Path "backend/Dockerfile" -Force | Out-Null
New-Item -ItemType File -Path "backend/.env" -Force | Out-Null
New-Item -ItemType File -Path "backend/app/__init__.py" -Force | Out-Null
New-Item -ItemType File -Path "backend/app/main.py" -Force | Out-Null
New-Item -ItemType File -Path "backend/app/database.py" -Force | Out-Null
New-Item -ItemType File -Path "backend/app/config.py" -Force | Out-Null

# Fichiers Docker
New-Item -ItemType File -Path "docker-compose.yml" -Force | Out-Null
New-Item -ItemType File -Path ".env" -Force | Out-Null

Write-Host "✓ Structure backend créée" -ForegroundColor Green
Write-Host "✓ Fichiers Docker créés" -ForegroundColor Green