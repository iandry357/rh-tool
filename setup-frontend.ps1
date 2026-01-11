# Navigation vers frontend
Set-Location -Path "frontend"

# Création des dossiers
New-Item -ItemType Directory -Path "app/formulaires/entretien-annuel" -Force | Out-Null
New-Item -ItemType Directory -Path "components/forms" -Force | Out-Null
New-Item -ItemType Directory -Path "lib" -Force | Out-Null
New-Item -ItemType Directory -Path "types" -Force | Out-Null

Write-Host "✓ Structure créée" -ForegroundColor Green

# Installation des dépendances
Write-Host "Installation des dépendances..." -ForegroundColor Yellow
npm install react-hook-form zod @hookform/resolvers axios

Write-Host "✓ Setup terminé" -ForegroundColor Green